const kb = require('./../../helpers/keyboard-buttons')
const {emp} = require('./mainPage')
const {ews2, ews4, ews5} = require('./washesPage')
const {efs1} = require('./feesPage')

const employeePanelQuery = async (bot, chat_id, query_id, message_id, phrase, id, lang) => {
  try {
    if (phrase === 'none') {
      const message = (lang === kb.language.uz)
        ? "Bu yerda ma'lumotlar yo'q. Siz noto'g'ri betni tanladingiz."
        : "Здесь нет информации. Вы выбрали не ту страницу."

      await bot.answerCallbackQuery(query_id, {text: message, show_alert: true})
    }

    if (phrase === 'delete') {
      await bot.deleteMessage(chat_id, message_id)

      await emp(bot, chat_id, lang)
    }

    await ews2(bot, chat_id, query_id, message_id, phrase, id, lang)
    await ews4(bot, chat_id, query_id, message_id, phrase, id, lang)

    if (phrase === 'wash') await ews5(bot, chat_id, query_id, message_id, id, lang)
    await efs1(bot, chat_id, query_id, message_id, phrase, id, lang)
  } catch (e) {
    console.log(e)
  }
}

module.exports = {employeePanelQuery}
