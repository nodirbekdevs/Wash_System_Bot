const kb = require('./../../helpers/keyboard-buttons')
const {omp} = require('./mainPage')
const {ofs4, ofs5, ofs6, ofs7} = require('./feedbackPage')
const {ofs14, ofs20} = require('./feePage')
const {ows4, ows5, ows6} = require('./washesPage')
const {oes5, oes6, oes7} = require('./employeesPage')
const {updateOwner} = require('./../../controllers/ownerController')
const {updateBranch} = require('./../../controllers/branchController')

const ownerPanelQuery = async (bot, chat_id, query_id, message_id, phrase, id, lang) => {
  try {
    const splitted = phrase.split('#')

    if (phrase === 'none') {
      const message = (lang === kb.language.uz)
        ? "Bu yerda ma'lumotlar yo'q. Siz noto'g'ri betni tanladingiz."
        : "Здесь нет информации. Вы выбрали не ту страницу."

      await bot.answerCallbackQuery(query_id, {text: message, show_alert: true})
    }

    if (phrase === 'delete') {
      await bot.deleteMessage(chat_id, message_id)

      await updateOwner({telegram_id: chat_id}, {step: 5})

      await updateBranch({owner: chat_id, situation: {$in: ['wash', 'employee']}}, {situation: ''})

      await omp(bot, chat_id, lang)
    }

    if (splitted && splitted.length === 3) {
      await ofs4(bot, chat_id, query_id, message_id, splitted, lang)
      await ows6(bot, chat_id, message_id, splitted, lang)
      await oes6(bot, chat_id, message_id, splitted, lang)
    }

    if (phrase === 'se_feed' || phrase === 'do_feed') await ofs5(bot, chat_id, query_id, message_id, phrase, id, lang)
    if (phrase === 'seen' || phrase === 'fsb') await ofs6(bot, chat_id, query_id, message_id, phrase, id, lang)
    if (phrase === 'done' || phrase === 'fdb') await ofs7(bot, chat_id, query_id, message_id, phrase, id, lang)
    if (phrase === 'e_car' || phrase === 'e_e') await ofs14(bot, chat_id, query_id, message_id, phrase, id, lang)
    if (phrase === 's_car' || phrase === 's_e') await ofs20(bot, chat_id, query_id, message_id, phrase, id, lang)

    if (phrase === 'wash' || phrase === 'washing')await ows4(bot, chat_id, message_id, phrase, id, lang)
    if (phrase === 'wash_back' || phrase === 'wing_back') await ows5(bot, chat_id, message_id, phrase, lang)

    if (phrase === 'e_all' || phrase === 'e_act' || phrase === 'e_inact') await oes5(bot, chat_id, message_id, phrase, id, lang)
    if (
      (phrase === 'e_a_d' || phrase === 'e_ac_d' || phrase === 'e_in_d') ||
      (phrase === 'e_a_b' || phrase === 'e_ac_b' || phrase === 'e_in_b')
    ) await oes7(bot, chat_id, message_id, phrase, id, lang)




  } catch (e) {
    console.log(e)
  }
}

module.exports = {ownerPanelQuery}
