const kb = require('./../../helpers/keyboard-buttons')
const keyboard = require('./../../helpers/keyboard')
const {getWashes, getWash, makeWash, updateWash, deleteWash, countWashes} = require('./../../controllers/washController')
const {getManager} = require('./../../controllers/managerController')
const {getEmployees, getEmployee, updateEmployee} = require('./../../controllers/employeeController')
const {getCars, getCar} = require('./../../controllers/carController')
const {getClient} = require('./../../controllers/clientController')
const {getBranch} = require('./../../controllers/branchController')
const {bio, pagination, branch_manager_keyboard, date} = require('./../../helpers/utils')
const {mmp} = require('./mainPage')

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

  await bot.sendMessage(chat_id, message, {reply_markup: {resize_keyboard: true, keyboard: kbb}})
}

const mws1 = async (bot, chat_id, message_id, lang) => {
  const manager = await getManager({telegram_id: chat_id}),
    washes = await getWashes({
      manager: manager.telegram_id,
      branch: manager.branch,
      status: 'washed',
      created_at: {
        $gte: new Date(new Date().setHours(0o0, 0o0, 0o0)),
        $lt: new Date(new Date().setHours(23, 59, 59))
      }
    })

  const report = await pagination(1, 10, washes, lang)

  await bot.sendMessage(chat_id, report.text, {
    parse_mode: 'HTML',
    reply_to_message_id: message_id,
    reply_markup: {inline_keyboard: report.kbb}
  })
}

const mws2 = async (bot, chat_id, query_id, message_id, data, _id, lang) => {
  let message

  const manager = await getManager({telegram_id: chat_id}),
    washes = await getWashes({
      manager: manager.telegram_id,
      branch: manager.branch,
      status: 'washed',
      created_at: {
        $gte: new Date(new Date().setHours(0o0, 0o0, 0o0)),
        $lt: new Date(new Date().setHours(23, 59, 59))
      }
    })

  if (data.split('#')[0] === 'left' || data.split('#')[0] === 'right') {
    const btn = data.split('#'), current_page = parseInt(btn[2])

    const report = await pagination(current_page, 10, washes, lang)

    await bot.editMessageText(report.text, {
      chat_id, message_id, parse_mode: 'HTML', reply_markup: {inline_keyboard: report.kbb}
    })

    await bot.answerCallbackQuery(query_id, '')
  }

  if (data === 'washed') {
    const wash = await getWash({_id}), employee = await getEmployee({telegram_id: wash.employee})

    const started_at = date(wash.washed_time.started_at), ended_at = date(wash.washed_time.washed_at)

    const data = {
      employee: employee.name,
      branch: wash.branch,
      car: wash.car,
      car_number: wash.car_number,
      price: wash.price,
      cash: wash.cash,
      benefit: wash.price - wash.cash,
      washing_time_started: started_at,
      washing_time_ended: ended_at
    }

    message = bio(data, 'WASH', lang)

    await bot.sendMessage(chat_id, message)

    await bot.answerCallbackQuery(query_id, '')
  }
}

const mws3 = async (bot, chat_id, query_id, message_id, data, lang) => {
  let message

  if (data === 'none') {
    message = (lang === kb.language.uz)
      ? "Bu yerda ma'lumotlar yo'q. Siz noto'g'ri betni tanladingiz."
      : "Здесь нет информации. Вы выбрали не ту страницу."

    await bot.answerCallbackQuery(query_id, {text: message, show_alert: true})
  }

  if (data === 'delete') {
    await bot.deleteMessage(chat_id, message_id)

    await mmp(bot, chat_id, lang)
  }
}

const mws4 = async (bot, chat_id, lang) => {
  const manager = await getManager({telegram_id: chat_id}),
    employees = await getEmployees({
      manager: manager.telegram_id,
      branch: manager.branch,
      is_idler: false,
      status: 'active'
    }),
    kbb = branch_manager_keyboard(employees, lang),
    message = (lang === kb.language.uz)
      ? "Ishni bajarish uchun xodimni kiriting." : "Введите сотрудника для выполнения работы."

  const new_wash = await makeWash({manager: manager.telegram_id, branch: manager.branch})

  wash_id = new_wash.id

  await bot.sendMessage(chat_id, message, {reply_markup: {resize_keyboard: true, keyboard: kbb}})
}

const mws5 = async (bot, chat_id, _id, text, lang) => {
  await updateWash({_id}, {employee: text, step: 1})

  const manager = await getManager({telegram_id: chat_id}),
    cars = await getCars({owner: manager.owner, branch: manager.branch, status: 'active'}),
    kbb = branch_manager_keyboard(cars, lang),
    message = (lang === kb.language.uz)
      ? "Mashinani turini tanlang." : "Выберите тип машины."

  await bot.sendMessage(chat_id, message, {reply_markup: {resize_keyboard: true, keyboard: kbb}})
}

const mws6 = async (bot, chat_id, _id, text, lang) => {
  await updateWash({_id}, {car: text, step: 2})

  const manager = await getManager({telegram_id: chat_id}),
    cars = await getCars({owner: manager.owner, branch: manager.branch, status: 'active'}),
    kbb = branch_manager_keyboard(cars, lang),
    message = (lang === kb.language.uz)
      ? "Mashinani markasini tanlang." : "Выберите марку автомобиля."

  await bot.sendMessage(chat_id, message, {reply_markup: {resize_keyboard: true, keyboard: kbb}})
}

const mws7 = async (bot, chat_id, _id, text, lang) => {
  let message, kbb

  await updateWash({_id}, {car_type: text, step: 3})

  if (lang === kb.language.uz) {
    message = "Mashinani raqamini kiriting."
    kbb = keyboard.options.back.uz
  } else if (lang === kb.language.ru) {
    message = "Введите номер автомобиля."
    kbb = keyboard.options.back.ru
  }

  await bot.sendMessage(chat_id, message, {reply_markup: {resize_keyboard: true, keyboard: kbb}})
}

const mws8 = async (bot, chat_id, _id, text, lang) => {
  let message, kbb

  const day = date(new Date())

  await updateWash({_id}, {car_number: text, step: 4})

  const wash = await getWash({_id}), car = await getCar({type: wash.car, branch: wash.branch}),
    manager = await getManager({telegram_id: wash.manager})

  const data = {
    manager: manager.name,
    employee: wash.employee,
    branch: wash.branch,
    car_type: wash.car,
    car: wash.car_type,
    car_number: wash.car_number,
    cash: car.cash,
    price: car.price,
    benefit: car.price - car.cash,
    started_at: day
  }

  message = bio(data, 'WASH_MAKING', lang)

  if (lang === kb.language.uz) {
    message += "\nTugaganini tasdiqlaysizmi."
    kbb = keyboard.options.confirmation.uz
  } else if (lang === kb.language.ru) {
    message += "\nВы можете подтвердить, что это сделано?"
    kbb = keyboard.options.confirmation.ru
  }

  await bot.sendMessage(chat_id, message, {reply_markup: {resize_keyboard: true, keyboard: kbb}})
}

const mws9 = async (bot, chat_id, _id, text, lang) => {
  let message, client

  const kbb = (lang === kb.language.uz) ? keyboard.manager.washes.uz : keyboard.manager.washes.ru

  const wash = await getWash({_id}), car = await getCar({type: wash.car, branch: wash.branch})

  if (wash.client > 0) {
    client = await getClient({telegram_id: wash.client})
  }

  if (text === kb.options.confirmation.uz || text === kb.options.confirmation.ru) {
    wash.step = 5
    wash.cash = car.cash
    wash.price = car.price
    wash.benefit = car.price - car.cash
    wash.status = 'washing'
    wash.washed_time.started_at = new Date()
    await wash.save()

    await updateEmployee({manager: wash.manager, branch: wash.branch, name: wash.employee}, {is_idler: true})

    message = (lang === kb.language.uz) ? "Avtomobilni yuvish ishlari boshlandi" : "Автомойка началась"

    const clause = (lang === kb.language.uz) ? "Mashinangiz yuvish boshlandi." : "У вас началась мойка автомобиля."

    await bot.sendMessage(client.telegram_id, clause)
  } else if (text === kb.options.not_to_confirmation.uz || text === kb.options.not_to_confirmation.ru) {
    await deleteWash({_id})

    message = (lang === kb.language.uz) ? "Bu mashinani yuvish tasdiqlanmadi" : "Эта автомойка не одобрена"
  }

  await bot.sendMessage(chat_id, message, {reply_markup: {resize_keyboard: true, keyboard: kbb}})
}

const mws10 = async (bot, chat_id, lang) => {
  const manager = await getManager({telegram_id: chat_id}),
    washes = await getWashes({
      manager: manager.telegram_id,
      branch: manager.branch,
      step: 5,
      status: 'washing',
      created_at: {
        $gte: new Date(new Date().setHours(0o0, 0o0, 0o0)),
        $lt: new Date(new Date().setHours(23, 59, 59))
      }
    })

  const report = await pagination(1, 10, washes, lang)

  await bot.sendMessage(chat_id, report.text, {
    parse_mode: 'HTML',
    reply_markup: {inline_keyboard: report.kbb}
  })
}

const mws11 = async (bot, chat_id, message_id, data, _id, lang) => {
  let clause, back

  const wash = await getWash({_id}), manager = await getManager({telegram_id: chat_id}),
    car = await getCar({type: wash.car, branch: wash.branch})

  const day = date(wash.washed_time.started_at)

  data = {
    manager: manager.name,
    employee: wash.employee,
    branch: wash.branch,
    car_type: wash.car,
    car: wash.car_type,
    car_number: wash.car_number,
    cash: car.cash,
    price: car.price,
    benefit: car.price - car.cash,
    started_at: day
  }

  const message = bio(data, 'WASH_MAKING', lang)

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

const mws12 = async (bot, chat_id, message_id, data, _id, lang) => {
  let client, message

  const manager = await getManager({telegram_id: chat_id}), wash = await getWash({_id}),
    employee = await getEmployee({name: wash.employee}),
    branch = await getBranch({manager: wash.manager, name: wash.branch})

  if (wash.client) {
    client = await getClient({telegram_id: wash.client})
  }

  if (data === 'washed') {
    wash.status = 'washed'
    wash.step = 6
    wash.washed_time.washed_at = new Date()
    await wash.save()

    employee.total_washes += 1
    employee.is_idler = false
    await employee.save()

    branch.total_washes += 1
    await branch.save()

    if (client) {
      client.total_washes += 1
      await client.save()
    }

    message = (lang === kb.language.uz)
      ? `${employee.name} - ${wash.car} - ${wash.car_type} - ${wash.car_number}. Mashinani yuvish yakunlandi`
      : `${employee.name} - ${wash.car} - ${wash.car_type} - ${wash.car_number}. Автомойка завершена`

    await bot.sendMessage(chat_id, message)
  }

  const washes = await getWashes({
    manager: manager.telegram_id, branch: manager.branch, status: 'washing',
    created_at: {
      $gte: new Date(new Date().setHours(0o0, 0o0, 0o0)),
      $lt: new Date(new Date().setHours(23, 59, 59))
    }
  })

  const report = await pagination(1, 10, washes, lang)

  await bot.editMessageText(report.text, {
    chat_id, message_id, parse_mode: 'HTML', reply_markup: {inline_keyboard: report.kbb}
  })
}

const managerWashes = async (bot, chat_id, message_id, text, lang) => {
  const manager = await getManager({telegram_id: chat_id})

  const wash = await getWash({_id: wash_id, manager: manager.telegram_id, branch: manager.branch, status: 'process'})
    ? await getWash({_id: wash_id, manager: manager.telegram_id, branch: manager.branch, status: 'process'})
    : (await getWashes({manager: manager.telegram_id, branch: manager.branch, status: 'process'}))[0]

  if (text === kb.manager.pages.uz.washes || text === kb.manager.pages.ru.washes) await mws0(bot, chat_id, lang)
  if (text === kb.manager.washes.uz.today || text === kb.manager.washes.ru.today) await mws1(bot, chat_id, message_id, lang)
  if (text === kb.manager.washes.uz.add || text === kb.manager.washes.ru.add) await mws4(bot, chat_id, lang)
  if (text === kb.manager.washes.uz.washing || text === kb.manager.washes.ru.washing) await mws10(bot, chat_id, lang)

  if (wash) {
    if (wash.step === 0) await mws5(bot, chat_id, wash._id, text, lang)
    if (wash.step === 1) await mws6(bot, chat_id, wash._id, text, lang)
    if (wash.step === 2) await mws7(bot, chat_id, wash._id, text, lang)
    if (wash.step === 3) await mws8(bot, chat_id, wash._id, text, lang)
    if (wash.step === 4) await mws9(bot, chat_id, wash._id, text, lang)
  }
}

module.exports = {managerWashes, mws2, mws3, mws11, mws12}
