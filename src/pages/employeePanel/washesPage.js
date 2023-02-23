const kb = require('./../../helpers/keyboard-buttons')
const keyboard = require('./../../helpers/keyboard')
const {getWash} = require('./../../controllers/washController')
const {getEmployee} = require('./../../controllers/employeeController')

const {wash_pagination, employee_wash_pagination} = require('./../../helpers/utils')

const ews0 = async (bot, chat_id, lang) => {
  let message, kbb

  if (lang === kb.language.uz) {
    message = 'Yuvishlar sahifasi'
    kbb = keyboard.employee.washes.uz
  } else if (lang === kb.language.ru) {
    message = 'Страница мойок'
    kbb = keyboard.employee.washes.ru
  }

  await bot.sendMessage(chat_id, message, {
    reply_markup: {resize_keyboard: true, keyboard: kbb, one_time_keyboard: true}
  })
}

const ews1 = async (bot, chat_id, lang) => {
  const employee = await getEmployee({telegram_id: chat_id})

  const query = {employee: employee.name, branch: employee.branch, status: 'washed'}

  const report = await wash_pagination(1, 6, query, 'EMPLOYEE', lang)

  await bot.sendMessage(chat_id, report.text, report.kbs)
}


const ews2 = async (bot, chat_id, query_id, message_id, data, _id, lang) => {
  const employee = await getEmployee({telegram_id: chat_id}), phrase = data.split('#')

  const query = {employee: employee.name, branch: employee.branch, status: 'washed'}

  if ((phrase[0] === 'left' || phrase[0] === 'right') && phrase[1] === 'wash') {
    const report = await wash_pagination(parseInt(data.split('#')[2]), 6, query, 'EMPLOYEE', lang)

    const kbb = report.kbs.reply_markup

    await bot.editMessageText(report.text, {chat_id, message_id, parse_mode: 'HTML', reply_markup: kbb})
  }
}

const ews3 = async (bot, chat_id, lang) => {
  const employee = await getEmployee({telegram_id: chat_id})

  const query = {
    employee: employee.name, branch: employee.branch, status: 'washed',
    created_at: {
      $gte: new Date(new Date().setHours(0o0, 0o0, 0o0)),
      $lt: new Date(new Date().setHours(23, 59, 59))
    }
  }

  const report = await wash_pagination(1, 6, query, 'EMPLOYEE', lang)

  await bot.sendMessage(chat_id, report.text, {parse_mode: 'HTML', reply_markup: report.kbs.reply_markup})
}

const ews4 = async (bot, chat_id, query_id, message_id, data, _id, lang) => {
  const employee = await getEmployee({telegram_id: chat_id}), phrase = data.split('#')

  const query = {
    employee: employee.name, branch: employee.branch, status: 'washed',
    created_at: {
      $gte: new Date(new Date().setHours(0o0, 0o0, 0o0)),
      $lt: new Date(new Date().setHours(23, 59, 59))
    }
  }

  if ((phrase[0] === 'left' || phrase[0] === 'right') && phrase[1] === 'wash' && phrase[2] === 'today') {
    const report = await wash_pagination(parseInt(data.split('#')[3]), 6, query, 'EMPLOYEE', lang)

    const kbb = report.kbs.reply_markup

    await bot.editMessageText(report.text, {chat_id, message_id, parse_mode: 'HTML', reply_markup: kbb})
  }
}

const ews5 = async (bot, chat_id, query_id, message_id, _id, lang) => {
  const wash = await getWash({_id})

  const started_at = date(wash.washed_time.started_at), ended_at = date(wash.washed_time.washed_at)

  const data = {
    employee: wash.employee, branch: wash.branch, fee: wash.fee, car: wash.car, car_type: wash.car_type,
    car_number: wash.car_number, price: wash.price, cash: wash.cash, benefit: wash.price - wash.cash,
    washing_time_started: started_at, washing_time_ended: ended_at
  }

  const message = report(data, 'WASH', lang)

  await bot.sendMessage(chat_id, message)

  await bot.answerCallbackQuery(query_id, '')
}

const employeeWashes = async (bot, chat_id, text, lang) => {
  if (text === kb.employee.pages.uz.washes || text === kb.employee.pages.ru.washes) await ews0(bot, chat_id, lang)
  if (text === kb.employee.washes.uz.all || text === kb.employee.washes.ru.all) await ews1(bot, chat_id, lang)
  if (text === kb.employee.washes.uz.today || text === kb.employee.washes.ru.today) await ews3(bot, chat_id, lang)
}

module.exports = {employeeWashes, ews2, ews4, ews5}
