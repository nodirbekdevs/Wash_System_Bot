const kb = require('./../../helpers/keyboard-buttons')
const keyboard = require('./../../helpers/keyboard')

const omp = async (bot, chat_id, lang) => {
  let message, kbb

  if (lang === kb.language.uz) {
    message = 'Bosh sahifa'
    kbb = keyboard.owner.pages.uz
  } else if (lang === kb.language.ru) {
    message = 'Главная страница'
    kbb = keyboard.owner.pages.ru
  }

  await bot.sendMessage(chat_id, message, {reply_markup: {resize_keyboard: true, keyboard: kbb}})
}

const ownerMainPage = async (bot, chat_id, text, lang) => {
  if (text === kb.start || text === kb.main.uz) await omp(bot, chat_id, lang)
}

module.exports = {ownerMainPage}
