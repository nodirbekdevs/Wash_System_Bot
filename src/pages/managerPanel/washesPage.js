const kb = require('./../../helpers/keyboard-buttons')
const keyboard = require('./../../helpers/keyboard')
const {getWashes, getWash, makeWash, updateWash, deleteWash, countWashes} = require('./../../controllers/washController')
const {getManager} = require('./../../controllers/managerController')
const {getFees, getFee} = require('./../../controllers/feeController')
const {getEmployees, getEmployee, updateEmployee} = require('./../../controllers/employeeController')
const {getCar} = require('./../../controllers/carController')
const {getClient} = require('./../../controllers/clientController')
const {getBranch} = require('./../../controllers/branchController')
const {report, wash_pagination, universal_keyboard, date, car_keyboard} = require('./../../helpers/utils')

let wash_id

const mws0 = async (bot, chat_id, lang) => {
  let message, kbb

  if (lang === kb.language.uz) {
    message = 'Yuvishlar sahifasi'
    kbb = keyboard.manager.washes.uz
  } else if (lang === kb.language.ru) {
    message = 'Страница мойок'
    kbb = keyboard.manager.washes.ru
  }

  await bot.sendMessage(chat_id, message, {
    reply_markup: {
      resize_keyboard: true,
      keyboard: kbb,
      one_time_keyboard: true
    }
  })
}

const mws1 = async (bot, chat_id, lang) => {
  const manager = await getManager({telegram_id: chat_id}),
    query = {
      manager: {$gt: 0}, branch: manager.branch, status: 'washed',
      created_at: {
        $gte: new Date(new Date().setHours(0o0, 0o0, 0o0)),
        $lt: new Date(new Date().setHours(23, 59, 59))
      }
    }

  const report = await wash_pagination(1, 6, query, 'MANAGER', lang), kbb = report.kbs.reply_markup

  await bot.sendMessage(chat_id, report.text, {parse_mode: 'HTML', reply_markup: kbb})
}

const mws2 = async (bot, chat_id, query_id, message_id, data, _id, lang) => {
  let message

  const manager = await getManager({telegram_id: chat_id}),
    query = {
      manager: manager.telegram_id, branch: manager.branch, status: 'washed',
      created_at: {
        $gte: new Date(new Date().setHours(0o0, 0o0, 0o0)),
        $lt: new Date(new Date().setHours(23, 59, 59))
      }
    }, phrase = data.split('#')

  if ((phrase[0] === 'left' || phrase[0] === 'right') && phrase[1] === 'wash') {
    const report = await wash_pagination(parseInt(phrase[2]), 6, query, 'MANAGER', lang), kbb = report.kbs.reply_markup

    await bot.editMessageText(report.text, {chat_id, message_id, parse_mode: 'HTML', reply_markup: kbb})
  }

  if (data === 'wash') {
    const wash = await getWash({_id})

    const started_at = date(wash.washed_time.started_at), ended_at = date(wash.washed_time.washed_at)

    const wash_data = {
      employee: wash.employee, branch: wash.branch, fee: wash.fee, car: wash.car, car_type: wash.car_type,
      car_number: wash.car_number, price: wash.price, cash: wash.cash, benefit: wash.price - wash.cash,
      washing_time_started: started_at, washing_time_ended: ended_at
    }

    message = report(wash_data, 'WASH', lang)

    await bot.sendMessage(chat_id, message)

    await bot.answerCallbackQuery(query_id, '')
  }
}

const mws3 = async (bot, chat_id, lang) => {
  let message, kbb

  const manager = await getManager({telegram_id: chat_id}),
    fees = await getFees({owner: manager.owner, manager: chat_id, branch: manager.branch, status: 'active'})

  if (manager.branch && fees.length > 0) {
    const employees = await getEmployees({
      manager: manager.telegram_id, branch: manager.branch, is_idler: false, status: 'active'
    })

    if (employees.length > 0) {
      kbb = universal_keyboard(employees, lang)

      message = (lang === kb.language.uz) ? "Ishni bajarish uchun xodimni kiriting." : "Введите сотрудника для выполнения работы."

      const new_wash = await makeWash({manager: manager.telegram_id, branch: manager.branch})

      wash_id = new_wash.id
    } else if (employees.length <= 0) {
      if (lang === kb.language.uz) {
        message = "Mashina yuvishga hali xodim bo'shagani yo'q"
        kbb = keyboard.manager.washes.uz
      } else if (lang === kb.language.ru) {
        message = "Пока нет сотрудника, который мог бы помыть машину"
        kbb = keyboard.manager.washes.ru
      }
    }
  } else if (!manager.branch) {
    if (lang === kb.language.uz) {
      message = "Sizga filial biriktirilmaganligi sababli siz avtomobil yuvish qo'sha olmaysiz"
      kbb = keyboard.manager.washes.uz
    } else if (lang === kb.language.ru) {
      message = "Вы не можете добавить автомойку, потому что у вас нет филиалаю"
      kbb = keyboard.manager.washes.ru
    }
  } else if (fees.length <= 0) {
    if (lang === kb.language.uz) {
      message = "Filialga tarif qo'shilmagani sababli siz avtomobil yuvish qo'sha olmaysiz"
      kbb = keyboard.manager.washes.uz
    } else if (lang === kb.language.ru) {
      message = "Вы не можете добавить автомойку, потому что в филиале нет добавленного тарифа"
      kbb = keyboard.manager.washes.ru
    }
  }

  await bot.sendMessage(chat_id, message, {reply_markup: {resize_keyboard: true, keyboard: kbb}})
}

const mws4 = async (bot, chat_id, _id, text, lang) => {
  await updateWash({_id}, {employee: text, step: 1})

  const manager = await getManager({telegram_id: chat_id}),
    fees = await getFees({owner: manager.owner, manager: chat_id, branch: manager.branch, status: 'active'}),
    kbb = universal_keyboard(fees, lang),
    message = (lang === kb.language.uz)
      ? "Mashinani yuvish uchun tarifni tanlang." : "Выберите тариф на мойку автомобиля."

  await bot.sendMessage(chat_id, message, {reply_markup: {resize_keyboard: true, keyboard: kbb}})
}

const mws5 = async (bot, chat_id, _id, text, lang) => {
  await updateWash({_id}, {fee: text, step: 2})

  const manager = await getManager({telegram_id: chat_id})

  const fee = await getFee({
    owner: manager.owner, manager: chat_id, branch: manager.branch, name: text, status: 'active'
  })

  const message = (lang === kb.language.uz) ? "Mashinani markasini tanlang." : "Выберите марку автомобиля.",
    kbb = car_keyboard(fee.cars, lang)

  await bot.sendMessage(chat_id, message, {reply_markup: {resize_keyboard: true, keyboard: kbb}})
}

const mws6 = async (bot, chat_id, _id, text, lang) => {
  let message, kbb

  const car = await getCar({name: text})

  await updateWash({_id}, {car: car.name, car_type: car.type, step: 3})

  if (lang === kb.language.uz) {
    message = "Mashinani raqamini kiriting."
    kbb = keyboard.options.back.uz
  } else if (lang === kb.language.ru) {
    message = "Введите номер автомобиля."
    kbb = keyboard.options.back.ru
  }

  await bot.sendMessage(chat_id, message, {reply_markup: {resize_keyboard: true, keyboard: kbb}})
}

const mws7 = async (bot, chat_id, _id, text, lang) => {
  let message, kbb

  const day = date(new Date())

  await updateWash({_id}, {car_number: text, step: 4})

  const wash = await getWash({_id}), fee = await getFee({name: wash.fee}),
    manager = await getManager({telegram_id: wash.manager})

  const data = {
    manager: manager.name, employee: wash.employee, branch: wash.branch, fee: wash.fee, car: wash.car,
    car_type: wash.car_type, car_number: wash.car_number, price: fee.price, cash: fee.cash,
    benefit: fee.price - fee.cash, started_at: day
  }

  message = report(data, 'WASH_MAKING', lang)

  if (lang === kb.language.uz) {
    message += "\nTugaganini tasdiqlaysizmi."
    kbb = keyboard.options.confirmation.uz
  } else if (lang === kb.language.ru) {
    message += "\nВы можете подтвердить, что это сделано?"
    kbb = keyboard.options.confirmation.ru
  }

  await bot.sendMessage(chat_id, message, {reply_markup: {resize_keyboard: true, keyboard: kbb}})
}

const mws8 = async (bot, chat_id, _id, text, lang) => {
  let message, client

  const kbb = (lang === kb.language.uz) ? keyboard.manager.washes.uz : keyboard.manager.washes.ru

  const wash = await getWash({_id}), fee = await getFee({name: wash.fee, branch: wash.branch})

  if (wash.client > 0) {
    client = await getClient({telegram_id: wash.client})
  }

  if (text === kb.options.confirmation.uz || text === kb.options.confirmation.ru) {
    wash.step = 5
    wash.cash = fee.cash
    wash.price = fee.price
    wash.benefit = fee.price - fee.cash
    wash.status = 'washing'
    wash.washed_time.started_at = new Date()
    await wash.save()

    await updateEmployee({manager: wash.manager, branch: wash.branch, name: wash.employee}, {is_idler: true})

    message = (lang === kb.language.uz) ? "Avtomobilni yuvish ishlari boshlandi" : "Автомойка началась"

    if (client) {
      const clause = (lang === kb.language.uz) ? "Mashinangiz yuvish boshlandi." : "У вас началась мойка автомобиля."

      await bot.sendMessage(client.telegram_id, clause)
    }
  } else if (text === kb.options.not_to_confirmation.uz || text === kb.options.not_to_confirmation.ru) {
    await deleteWash({_id})

    message = (lang === kb.language.uz) ? "Bu mashinani yuvish tasdiqlanmadi" : "Эта автомойка не одобрена"
  }

  await bot.sendMessage(chat_id, message, {reply_markup: {resize_keyboard: true, keyboard: kbb}})
}

const mws9 = async (bot, chat_id, _id, lang) => {
  let message, kbb

  if (lang === kb.language.uz) {
    message = "Yangi mashina yuvish ma'qullanmadi."
    kbb = keyboard.manager.washes.uz
  } else if (lang === kb.language.ru) {
    message = "Новую автомойку не одобрили."
    kbb = keyboard.manager.washes.ru
  }

  await deleteWash({_id})

  await bot.sendMessage(chat_id, message, {reply_markup: {resize_keyboard: true, keyboard: kbb}})
}

const mws10 = async (bot, chat_id, lang) => {
  const manager = await getManager({telegram_id: chat_id}),
    query = {
      branch: manager.branch, step: 5, status: 'washing',
      created_at: {
        $gte: new Date(new Date().setHours(0o0, 0o0, 0o0)),
        $lt: new Date(new Date().setHours(23, 59, 59))
      }
    }

  const report = await wash_pagination(1, 6, query, 'MANAGER', lang), kbb = report.kbs.reply_markup

  await bot.sendMessage(chat_id, report.text, {parse_mode: 'HTML', reply_markup: kbb})
}

const mws11 = async (bot, chat_id, query_id, message_id, data, _id, lang) => {
  const manager = await getManager({telegram_id: chat_id}),
    query = {
      manager: manager.telegram_id, branch: manager.branch, status: 'washing',
      created_at: {
        $gte: new Date(new Date().setHours(0o0, 0o0, 0o0)),
        $lt: new Date(new Date().setHours(23, 59, 59))
      }
    }

  const report = await wash_pagination(parseInt(data.split('#')[2]), 6, query, 'MANAGER', lang),
    kbb = report.kbs.reply_markup

  await bot.editMessageText(report.text, {chat_id, message_id, parse_mode: 'HTML', reply_markup: kbb})
}

const mws12 = async (bot, chat_id, message_id, data, _id, lang) => {
  let clause, back

  const wash = await getWash({_id}), manager = await getManager({telegram_id: chat_id})

  const day = date(wash.washed_time.started_at)

  const wash_data = {
    manager: manager.name, employee: wash.employee, branch: wash.branch, fee: wash.fee, car_type: wash.car, car: wash.car_type,
    car_number: wash.car_number, cash: wash.cash, price: wash.price, benefit: wash.price - wash.cash, started_at: day
  }

  const message = report(wash_data, 'WASH_MAKING', lang)

  if (lang === kb.language.uz) {
    clause = kb.options.washed.uz
    back = kb.options.back.uz
  } else if (lang === kb.language.ru) {
    clause = kb.options.washed.ru
    back = kb.options.back.ru
  }

  await bot.editMessageText(message, {
    chat_id, message_id, parse_mode: 'HTML',
    reply_markup: {
      inline_keyboard: [
        [{text: clause, callback_data: JSON.stringify({phrase: "washed", id: wash._id})}],
        [{text: back, callback_data: JSON.stringify({phrase: "w_back", id: ''})}],
      ]
    }
  })
}

const mws13 = async (bot, chat_id, message_id, data, _id, lang) => {
  let client, message

  const manager = await getManager({telegram_id: chat_id}), wash = await getWash({_id})

  if (data === 'washed' && wash.status === 'washing') {
    const employee = await getEmployee({name: wash.employee}),
      branch = await getBranch({manager: wash.manager, name: wash.branch}),
      fee = await getFee({owner: branch.owner, manager: branch.manager, branch: branch.name, name: wash.fee})

    if (wash.client) {
      client = await getClient({telegram_id: wash.client})
    }

    wash.status = 'washed'
    wash.step = 6
    wash.washed_time.washed_at = Date.now()
    await wash.save()

    employee.total_washes += 1
    employee.is_idler = false
    await employee.save()

    branch.total_washes += 1
    await branch.save()

    fee.total_washes += 1
    await fee.save()

    if (client) {
      client.total_washes += 1
      await client.save()
    }

    message = (lang === kb.language.uz)
      ? `${employee.name} - ${wash.car} - ${wash.car_type} - ${wash.car_number}. Mashinani yuvish yakunlandi`
      : `${employee.name} - ${wash.car} - ${wash.car_type} - ${wash.car_number}. Автомойка завершена`

    await bot.sendMessage(chat_id, message)
  } else if (data === 'washed' && wash.status === 'washed') {
    message = (lang === kb.language.uz) ? `Avtomobil yuvib bo'lingan` : `Машину помыли`

    await bot.sendMessage(chat_id, message)
  }

  const query = {
    manager: manager.telegram_id, branch: manager.branch, step: 5, status: 'washing',
    created_at: {
      $gte: new Date(new Date().setHours(0o0, 0o0, 0o0)),
      $lt: new Date(new Date().setHours(23, 59, 59))
    }
  }

  const report = await wash_pagination(1, 6, query, 'MANAGER', lang), kbb = report.kbs.reply_markup

  if (report.text === 'Hali yuvishlar mavjud emas' || report.text === 'Автомоек пока нет') {
    await bot.deleteMessage(chat_id, message_id)
    const clause = (lang === kb.language.uz) ? "Yuvilayotgan mashina qolmadi" : "Машины больше не моют"
    await bot.sendMessage(chat_id, clause, report.kbs)
  } else if (report.text !== 'Hali yuvishlar mavjud emas' || report.text !== 'Автомоек пока нет') {
    await bot.editMessageText(report.text, {chat_id, message_id, parse_mode: 'HTML', reply_markup: kbb})
  }
}

const managerWashes = async (bot, chat_id, text, lang) => {
  const manager = await getManager({telegram_id: chat_id})

  const wash = await getWash({_id: wash_id, manager: manager.telegram_id, branch: manager.branch, status: 'process'})
    ? await getWash({_id: wash_id, manager: manager.telegram_id, branch: manager.branch, status: 'process'})
    : (await getWashes({manager: manager.telegram_id, branch: manager.branch, status: 'process'}))[0]

  if (text === kb.manager.pages.uz.washes || text === kb.manager.pages.ru.washes) await mws0(bot, chat_id, lang)
  if (text === kb.manager.washes.uz.today || text === kb.manager.washes.ru.today) await mws1(bot, chat_id, lang)
  if (text === kb.manager.washes.uz.add || text === kb.manager.washes.ru.add) await mws3(bot, chat_id, lang)
  if (text === kb.manager.washes.uz.washing || text === kb.manager.washes.ru.washing) await mws10(bot, chat_id, lang)

  if (wash) {
    if (text === kb.options.back.uz || text === kb.options.back.ru) {
      await mws9(bot, chat_id, wash._id, lang)
    } else if (text !== kb.options.back.uz || text !== kb.options.back.ru) {
      if (wash.step === 0) await mws4(bot, chat_id, wash._id, text, lang)
      if (wash.step === 1) await mws5(bot, chat_id, wash._id, text, lang)
      if (wash.step === 2) await mws6(bot, chat_id, wash._id, text, lang)
      if (wash.step === 3) await mws7(bot, chat_id, wash._id, text, lang)
      if (wash.step === 4) await mws8(bot, chat_id, wash._id, text, lang)
    }
  }
}


module.exports = {managerWashes, mws2, mws11, mws12, mws13}
