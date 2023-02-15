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
  let message, kbb

  const manager = await getManager({telegram_id: chat_id}),
    query = {owner: manager.owner, manager: chat_id, branch: manager.branch, status: 'active'},
  fees = await getFees(query)

  if (fees.length > 0) {
    const report = await fee_pagination(1, 1, query, lang)

    console.log("Kevotti1")

    message = report.text
    kbb = report.kbb

    await bot.sendMessage(chat_id, message, {parse_mode: 'HTML', reply_markup: {inline_keyboard: kbb}})
  } else {

    console.log("Kevotti2")

    if (lang === kb.language.uz) {
      message = "Hali tariflar mavjud emas"
      kbb = keyboard.manager.fees.uz
    } else if (lang === kb.language.ru) {
      message = "Тарифов пока нет"
      kbb = keyboard.manager.fees.ru
    }

    await bot.sendMessage(chat_id, message, {parse_mode: 'HTML', reply_markup: {resize_keyboard: true, keyboard: kbb}})
  }
}

const mfs2 = async (bot, chat_id, query_id, message_id, data, _id, lang) => {
  const manager = await getManager({telegram_id: chat_id}),
    query = {owner: manager.owner, manager: chat_id, branch: manager.branch, status: 'active'}

  if ((data.split('#')[0] === 'left' || data.split('#')[0] === 'right') && data.split('#')[1] === 'fee') {
    const report = await fee_pagination(parseInt(data.split('#')[2]), 1, query, lang)

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
