const kb = require('./../../helpers/keyboard-buttons')
const keyboard = require('./../../helpers/keyboard')
const {omp} = require('./mainPage')
const {getBranches, getBranch, updateBranch} = require('./../../controllers/branchController')
const {getOwner, updateOwner} = require('./../../controllers/ownerController')
const {getWash} = require('./../../controllers/washController')
const {getManager} = require('./../../controllers/managerController')
const {report, branch_report_keyboard, wash_pagination, date} = require('./../../helpers/utils')

const ows0 = async (bot, chat_id, lang) => {
  let message = '', clause, kbb

  const branches = await getBranches({owner: chat_id, status: 'provided'})

  if (branches.length > 0) {
    clause = (lang === kb.language.uz)
      ? "Qaysi filialdagi bugungi yuvishlarni ko'rmoqchisiz ?"
      : "В какой филиале вы бы хотели видеть сегодняшние мойки ?"

    kbb = branch_report_keyboard(branches, lang)

    message = (lang === kb.language.uz) ? "Yuvishlar sahifasi." : "Страница мойок."

    await updateOwner({telegram_id: chat_id}, {step: 17})

  } else if (branches.length <= 0) {
    if (lang === kb.language.uz) {
      clause = "Hali filiallar mavjud bo'lmaganligi sababli bugungi yuvishlarni ko'ra olmaysiz"
      kbb = keyboard.owner.pages.uz
    } else if (lang === kb.language.ru) {
      clause = "Вы не можете видеть сегодняшние мойки, потому что еще нет филталов"
      kbb = keyboard.owner.pages.ru
    }
  }

  if (message !== '') {
    await bot.sendMessage(chat_id, message)
  }

  await bot.sendMessage(chat_id, clause, {reply_markup: {resize_keyboard: true, keyboard: kbb}})
}

const ows1 = async (bot, chat_id, text, lang) => {
  let message, kbb

  const branch = await getBranch({name: text}) ? await getBranch({name: text}) : await getBranch({_id: text})

  if (branch) {
    await updateOwner({telegram_id: chat_id}, {step: 18})

    await updateBranch({_id: branch._id}, {situation: 'wash'})

    if (lang === kb.language.uz) {
      message = "Yuvilgan avtomobillarni ko'rmoqchimisiz yoki yuvilayogan avtomobillarnimi"
      kbb = keyboard.owner.washes.uz
    } else if (lang === kb.language.ru) {
      message = "Вы хотите увидеть вымытые машины или машины, которые можно мытают?"
      kbb = keyboard.owner.washes.ru
    }
  } else if (!branch) {
    await updateOwner({telegram_id: chat_id}, {step: 5})

    if (lang === kb.language.uz) {
      message = "Bunday filial topilmadi"
      kbb = keyboard.owner.pages.uz
    } else if (lang === kb.language.ru) {
      message = "Такой филиал не найдено"
      kbb = keyboard.owner.pages.ru
    }
  }

  await bot.sendMessage(chat_id, message, {reply_markup: {resize_keyboard: true, keyboard: kbb}})
}

const ows2 = async (bot, chat_id, branch, lang) => {
  const query = {
    manager: {$gt: 0}, branch: branch.name, status: 'washed',
    created_at: {
      $gte: new Date(new Date().setHours(0o0, 0o0, 0o0)),
      $lt: new Date(new Date().setHours(23, 59, 59))
    }
  }

  const report = await wash_pagination(1, 6, query, 'OWNER', lang), kbb = report.kbs.reply_markup

  await bot.sendMessage(chat_id, report.text, {parse_mode: 'HTML', reply_markup: kbb})

  const message = (lang === kb.language.uz)
    ? `Bugungi yuvilgan mashinalardan tushgan foyda ${report.total}`
    : `Сегодняшняя прибыль автомойки ${report.total}`

  await bot.sendMessage(chat_id, message)
}

const ows3 = async (bot, chat_id, branch, lang) => {
  const query = {
    manager: {$gt: 0}, branch: branch.name, status: 'washing',
    created_at: {
      $gte: new Date(new Date().setHours(0o0, 0o0, 0o0)),
      $lt: new Date(new Date().setHours(23, 59, 59))
    }
  }

  const report = await wash_pagination(1, 6, query, 'OWNER', lang), kbb = report.kbs.reply_markup

  await bot.sendMessage(chat_id, report.text, {parse_mode: 'HTML', reply_markup: kbb})

  const message = (lang === kb.language.uz)
    ? `Yuvilayotgan mashinalardan tushadigan foyda ${report.total}`
    : `Прибыль от мойки автомобилей ${report.total}`

  await bot.sendMessage(chat_id, message)
}

const ows4 = async (bot, chat_id, message_id, data, _id, lang) => {
  let clause, back, message, wash_data

  const wash = await getWash({_id}), manager = await getManager({telegram_id: wash.manager})

  if (data === 'wash') {
    const started_at = date(wash.washed_time.started_at), ended_at = date(wash.washed_time.washed_at)

    const wash_data = {
      employee: wash.employee, branch: wash.branch, fee: wash.fee, car: wash.car, car_type: wash.car_type,
      car_number: wash.car_number, price: wash.price, cash: wash.cash, benefit: wash.price - wash.cash,
      washing_time_started: started_at, washing_time_ended: ended_at
    }

    message = report(wash_data, 'WASH', lang)

    back = (lang === kb.language.uz) ? kb.options.back.uz : kb.options.back.ru

    clause = [[{text: back, callback_data: JSON.stringify({phrase: "wash_back", id: ''})}]]
  } else if (data === 'washing') {
    const day = date(wash.washed_time.started_at)

    wash_data = {
      manager: manager.name,
      employee: wash.employee,
      branch: wash.branch,
      fee: wash.fee,
      car_type: wash.car,
      car: wash.car_type,
      car_number: wash.car_number,
      cash: wash.cash,
      price: wash.price,
      benefit: wash.price - wash.cash,
      started_at: day
    }

    message = report(wash_data, 'WASH_MAKING', lang)

    back = (lang === kb.language.uz) ? kb.options.back.uz : kb.options.back.ru

    clause = [[{text: back, callback_data: JSON.stringify({phrase: "wing_back", id: ''})}]]
  }

  await bot.editMessageText(message, {
    chat_id, message_id, parse_mode: 'HTML', reply_markup: {inline_keyboard: clause}
  })
}

const ows5 = async (bot, chat_id, message_id, data, lang) => {
  let query, report, kbb

  const branch = await getBranch({owner: chat_id, situation: 'wash'})

  if (data === 'wash_back') {
    query = {
      manager: {$gt: 0}, branch: branch.name, status: 'washed',
      created_at: {
        $gte: new Date(new Date().setHours(0o0, 0o0, 0o0)),
        $lt: new Date(new Date().setHours(23, 59, 59))
      }
    }

    report = await wash_pagination(1, 6, query, 'OWNER', lang)

    kbb = report.kbs.reply_markup
  } else if (data === 'wing_back') {
    query = {
      manager: {$gt: 0}, branch: branch.name, status: 'washing',
      created_at: {
        $gte: new Date(new Date().setHours(0o0, 0o0, 0o0)),
        $lt: new Date(new Date().setHours(23, 59, 59))
      }
    }

    report = await wash_pagination(1, 6, query, 'OWNER', lang)

    kbb = report.kbs.reply_markup
  }

  if (report) {
    if (report.text === 'Hali yuvishlar mavjud emas' || report.text === 'Автомоек пока нет') {
      await bot.deleteMessage(chat_id, message_id)
      const clause = (lang === kb.language.uz) ? "Yuvilayotgan mashina qolmadi" : "Машины больше не моют"
      await bot.sendMessage(chat_id, clause, report.kbs)
    } else if (report.text !== 'Hali yuvishlar mavjud emas' || report.text !== 'Автомоек пока нет') {
      await bot.editMessageText(report.text, {chat_id, message_id, parse_mode: 'HTML', reply_markup: kbb})
    }
  }
}

const ows6 = async (bot, chat_id, message_id, data, lang) => {
  let query

  const branch = await getBranch({owner: chat_id, situation: 'wash'})

  if (branch) {
    if ((data[0] === 'left' || data[0] === 'right') && data[1] === 'wash') {
      query = {
        manager: {$gt: 0}, branch: branch.name, status: 'washed',
        created_at: {
          $gte: new Date(new Date().setHours(0o0, 0o0, 0o0)),
          $lt: new Date(new Date().setHours(23, 59, 59))
        }
      }
    } else if ((data[0] === 'left' || data[0] === 'right') && data[1] === 'washing') {
      query = {
        manager: {$gt: 0}, branch: branch.name, status: 'washing',
        created_at: {
          $gte: new Date(new Date().setHours(0o0, 0o0, 0o0)),
          $lt: new Date(new Date().setHours(23, 59, 59))
        }
      }
    }

    const report = await wash_pagination(parseInt(data[2]), 6, query, 'OWNER', lang), kbb = report.kbs.reply_markup

    await bot.editMessageText(report.text, {chat_id, message_id, parse_mode: 'HTML', reply_markup: kbb})
  }
}

const ows7 = async (bot, chat_id, lang) => {
  await updateOwner({telegram_id: chat_id}, {step: 5})
  await updateBranch({owner: chat_id, situation: 'wash'}, {situation: ''})
  await omp(bot, chat_id, lang)
}

const ownerWashes = async (bot, chat_id, text, lang) => {
  const owner = await getOwner({telegram_id: chat_id})

  try {
    if (text === kb.owner.pages.uz.washes || text === kb.owner.pages.ru.washes) await ows0(bot, chat_id, lang)

    if (owner) {
      if (owner.step === 17) {
        if (text === kb.main.uz || text === kb.main.ru) await ows7(bot, chat_id, lang)
        if (text !== kb.main.uz || text !== kb.main.uz) await ows1(bot, chat_id, text, lang)
      }

      if (owner.step === 18) {
        const branch = await getBranch({owner: chat_id, situation: 'wash'})

        if (text === kb.options.back.uz || text === kb.options.back.ru) await ows1(bot, chat_id, branch.name, lang)

        if (text !== kb.options.back.uz || text !== kb.options.back.ru) {
          if (text === kb.owner.washes.uz.washed || text === kb.owner.washes.uz.washed) await ows2(bot, chat_id, branch, lang)
          if (text === kb.owner.washes.uz.washing || text === kb.owner.washes.uz.washing) await ows3(bot, chat_id, branch, lang)
        }
      }
    }
  } catch (e) {
    console.log(e)
  }
}

module.exports = {ownerWashes, ows4, ows5, ows6}
