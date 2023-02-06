const kb = require('./../../helpers/keyboard-buttons')
const keyboard = require('./../../helpers/keyboard')

const emp = async (bot, chat_id, lang) => {
  let message, kbb

  if (lang === kb.language.uz) {
    message = 'Bosh sahifa'
    kbb = keyboard.employee.pages.uz
  } else if (lang === kb.language.ru) {
    message = 'Главная страница'
    kbb = keyboard.employee.pages.ru
  }

  await bot.sendMessage(chat_id, message, {reply_markup: {resize_keyboard: true, keyboard: kbb}})
}

const employeeMainPage = async (bot, chat_id, text, lang) => {
  if (text === kb.start || (text === kb.main.uz || text === kb.main.ru)) await emp(bot, chat_id, lang)
}

module.exports = {employeeMainPage, emp}
