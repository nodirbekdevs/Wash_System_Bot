const {ownerMainPage} = require('./mainPage')
const {ownerSettings} = require('./settingsPage')
const {ownerBranch} = require('./branchesPage')
const {ownerManager} = require('./managersPage')
const {ownerFeedback, ofs4} = require('./feedbackPage')
const {getOwner} = require('./../../controllers/ownerController')

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
    await ownerMainPage(bot, chat_id, text, lang)
    await ownerSettings(bot, owner, text)
    await ownerBranch(bot, chat_id, text, lang)
    await ownerManager(bot, chat_id, text, lang)
    await ownerFeedback(bot, chat_id, text, lang)
  } catch (e) {
    console.log(e)
  }
}

module.exports = {ownerPanel, getOwner, ofs4}
