const kb = require('./../../helpers/keyboard-buttons')
const keyboard = require('./../../helpers/keyboard')

const mmp = async (bot, chat_id, lang) => {
  let message, kbb

  if (lang === kb.language.uz) {
    message = 'Bosh sahifa'
    kbb = keyboard.manager.pages.uz
  } else if (lang === kb.language.ru) {
    message = 'Главная страница'
    kbb = keyboard.manager.pages.ru
  }

  await bot.sendMessage(chat_id, message, {reply_markup: {resize_keyboard: true, keyboard: kbb}})
}

const managerMainPage = async (bot, chat_id, text, lang) => {
  if (text === kb.start || (text === kb.main.uz || text === kb.main.ru)) await mmp(bot, chat_id, lang)
}

module.exports = {managerMainPage, mmp}
