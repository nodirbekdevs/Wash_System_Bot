const kb = require('./../../helpers/keyboard-buttons')
const keyboard = require('./../../helpers/keyboard')
const {getManager} = require('./../../controllers/managerController')
const {fee_pagination} = require('./../../helpers/utils')

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
  const manager = await getManager({telegram_id: chat_id}),
    query = {owner: manager.owner, manager: chat_id, branch: manager.branch, status: 'active'}

  const report = await fee_pagination(1, 1, query, 'MANAGER', lang), kbb = report.kbs.reply_markup

  await bot.sendMessage(chat_id, report.text, {parse_mode: 'HTML', reply_markup: kbb})
}

const mfs2 = async (bot, chat_id, query_id, message_id, data, _id, lang) => {
  const manager = await getManager({telegram_id: chat_id}), phrase = data.split('#'),
    query = {owner: manager.owner, manager: chat_id, branch: manager.branch, status: 'active'}

  if ((phrase[0] === 'left' || phrase[0] === 'right') && phrase[1] === 'fee') {
    const report = await fee_pagination(parseInt(phrase[2]), 1, query, 'MANAGER', lang), kbb = report.kbs.reply_markup

    await bot.editMessageText(report.text, {chat_id, message_id, parse_mode: 'HTML', reply_markup: kbb})
  }
}

const managerFees = async (bot, chat_id, text, lang) => {
  if (text === kb.manager.pages.uz.fees || text === kb.manager.pages.ru.fees) await mfs0(bot, chat_id, lang)
  if (text === kb.manager.fees.uz.all || text === kb.manager.fees.ru.all) await mfs1(bot, chat_id, lang)
}

module.exports = {managerFees, mfs2}
