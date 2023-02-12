const kb = require('./../../helpers/keyboard-buttons')
const keyboard = require('./../../helpers/keyboard')
const {getFees, getFee, makeFee, updateFee, deleteFee, countFees} = require('./../../controllers/feeController')
const {getManager} = require('./../../controllers/managerController')
const {getOwner} = require('./../../controllers/ownerController')
const {date, bio, car_pagination, fee_pagination} = require('./../../helpers/utils')

const mfs0 = async (bot, chat_id, lang) => {
  let message, kbb

  if (lang === kb.language.uz) {
    message = "Tariflar sahifasi"
    kbb = keyboard.manager.fees.uz
  } else if (lang === kb.language.ru) {
    message = "Страница тарифов"
    kbb = keyboard.manager.fees.ru
  }

  await bot.sendMessage(chat_id, message, {reply_markup: {resize_keyboard: true, keyboard: kbb}})
}

const mfs1 = async (bot, chat_id, lang) => {
  let report = {}

  const manager = await getManager({telegram_id: chat_id}),
    query = {owner: manager.owner, manager: chat_id, branch: manager.branch, status: 'active'},
  fees = await getFees(query)

  if (fees.length > 0) {
    report = fee_pagination(1, 1, query, lang)
  } else {
    if (lang === kb.language.uz) {
      report.text = "Hali tariflar mavjud emas"
      report.kbb = keyboard.manager.fees.uz
    } else if (lang === kb.language.ru) {
      report.text = "Тарифов пока нет"
      report.kbb = keyboard.manager.fees.ru
    }
  }

  await bot.sendMessage(chat_id, report.text, {parse_mode: 'HTML', reply_markup: {inline_keyboard: report.kbb}})
}

const mfs2 = async (bot, chat_id, query_id, message_id, data, _id, lang) => {
  let message

  const manager = await getManager({telegram_id: chat_id}), btn = data.split('#'),
    query = {owner: manager.owner, manager: chat_id, branch: manager.branch, status: 'active'}

  if ((btn[0] === 'left' || btn[0] === 'right') && btn[1] === 'fee') {
    const current_page = parseInt(btn[2])

    const report = await fee_pagination(current_page, 1, query, lang)

    await bot.editMessageText(report.text, {
      chat_id, message_id, parse_mode: 'HTML', reply_markup: {inline_keyboard: report.kbb}
    })

    await bot.answerCallbackQuery(query_id, '')
  }
}

const managerFees = async (bot, chat_id, text, lang) => {
  if (text === kb.manager.pages.uz.fees || text === kb.manager.pages.ru.fees) await mfs0(bot, chat_id, lang)
  if (text === kb.manager.fees.uz.all || text === kb.manager.fees.ru.all) await mfs1(bot, chat_id, lang)
}

module.exports = {managerFees, mfs2}
