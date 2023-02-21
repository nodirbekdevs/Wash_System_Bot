const {amp} = require('./mainPage')
const {aas8} = require('./advertisingPage')
const {acs3} = require('./carsPage')
const {aos3} = require('./ownersPage')

const adminPanelQuery = async (bot, chat_id, query_id, message_id, phrase, id) => {
  try {
    if (phrase === 'none') {
      await bot.answerCallbackQuery(query_id, {
        text: "Bu yerda ma'lumotlar yo'q. Siz noto'g'ri betni tanladingiz.", show_alert: true
      })
    }

    if (phrase === 'delete') {
      await bot.deleteMessage(chat_id, message_id)

      await amp(bot, chat_id)
    }

    if (phrase === "SEND_AD") await aas8(bot, chat_id, id)

    await aos3(bot, chat_id, query_id, message_id, phrase, id)
    await acs3(bot, chat_id, query_id, message_id, phrase, id)
  } catch (e) {
    console.log(e)
  }
}

module.exports = {adminPanelQuery}
