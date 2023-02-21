const {ofs4} = require('./feedbackPage')
const {ofs14, ofs20} = require('./feePage')

const ownerPanelQuery = async (bot, chat_id, query_id, message_id, phrase, id, lang) => {
  try {
    if (phrase === 'seen' || phrase === 'done') await ofs4(bot, chat_id, message_id, phrase, id, lang)
    if (phrase === 'e_car' || phrase === 'e_e') await ofs14(bot, chat_id, query_id, message_id, phrase, id, lang)
    if (phrase === 's_car' || phrase === 's_e') await ofs20(bot, chat_id, query_id, message_id, phrase, id, lang)
  } catch (e) {
    console.log(e)
  }
}

module.exports = {ownerPanelQuery}
