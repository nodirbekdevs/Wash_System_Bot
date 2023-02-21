const kb = require('./../../helpers/keyboard-buttons')
const {mmp} = require('./mainPage')
const {mws2, mws11, mws12, mws13} = require('./washesPage')
const {mfs2} = require('./feesPage')
const {mes2, mes3, mes11} = require('./employeesPage')

const managerPanelQuery = async (bot, chat_id, query_id, message_id, phrase, id, lang) => {
  try {
    if (phrase === 'none') {
      const message = (lang === kb.language.uz)
        ? "Bu yerda ma'lumotlar yo'q. Siz noto'g'ri betni tanladingiz."
        : "Здесь нет информации. Вы выбрали не ту страницу."

      await bot.answerCallbackQuery(query_id, {text: message, show_alert: true})
    }

    if (phrase === 'delete') {
      await bot.deleteMessage(chat_id, message_id)

      await mmp(bot, chat_id, lang)
    }

    await mws2(bot, chat_id, query_id, message_id, phrase, id, lang)
    if ((phrase.split('#')[0] === 'left' || phrase.split('#')[0] === 'right') && phrase.split('#')[1] === 'washing')
      await mws11(bot, chat_id, query_id, message_id, phrase, id, lang)
    if (phrase === 'washing') await mws12(bot, chat_id, message_id, phrase, id, lang)
    if (phrase === 'washed' || phrase === 'w_back') await mws13(bot, chat_id, message_id, phrase, id, lang)

    await mes2(bot, chat_id, query_id, message_id, phrase, id, lang)
    if (phrase === 'e_d' || phrase === 'e_b') await mes3(bot, chat_id, query_id, message_id, phrase, id, lang)
    if (phrase === 'e_edit') await mes11(bot, chat_id, query_id, message_id, phrase, id, lang)

    if ((phrase.split('#')[0] === 'left' || phrase.split('#')[0] === 'right') && phrase.split('#')[1] === 'fee')
      await mfs2(bot, chat_id, query_id, message_id, phrase, id, lang)
  } catch (e) {
    console.log(e)
  }
}

module.exports = {managerPanelQuery}
