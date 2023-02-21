const kb = require('./../../helpers/keyboard-buttons')
const {ownerMainPage} = require('./mainPage')
const {ownerSettings} = require('./settingsPage')
const {ownerBranch} = require('./branchesPage')
const {ownerManager} = require('./managersPage')
const {ownerFeedback} = require('./feedbackPage')
const {ownerFee} = require('./feePage')
const {ownerReports} = require('./reportPage')
const {getOwner} = require('./../../controllers/ownerController')
const {ownerPanelQuery} = require('./ownerPanelQuery')

const ownerPanel = async (bot, message, owner) => {
  let text
  const chat_id = message.chat.id, lang = owner.lang

  if (message.location) {
    text = message.location
  } else if (message.photo) {
    text = message.photo[0].file_id
  } else if (message.text) {
    text = message.text
  }

  try {
    if (owner.is_paid) {
      await ownerMainPage(bot, chat_id, text, lang)
      await ownerSettings(bot, owner, text, lang)
      await ownerBranch(bot, chat_id, text, lang)
      await ownerManager(bot, chat_id, text, lang)
      await ownerFee(bot, chat_id, text, lang)
      await ownerFeedback(bot, chat_id, text, lang)
      await ownerReports(bot, chat_id, text, lang)
    } else if (!owner.is_paid) {
      const message = owner.lang === kb.language.uz
        ? "Bu oy uchun pul to'lanmagan. Platformani ishlatish uchun admin bilan bog'laning"
        : "Не оплачен в этом месяце. Свяжитесь с администратором, чтобы использовать платформу"

      await bot.sendMessage(owner.telegram_id, message)
    }

  } catch (e) {
    console.log(e)
  }
}

module.exports = {ownerPanel, ownerPanelQuery, getOwner}
