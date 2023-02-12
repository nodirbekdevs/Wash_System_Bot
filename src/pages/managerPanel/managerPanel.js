const {managerMainPage, mmp} = require('./mainPage')
const {managerSettings} = require('./settingsPage')
const {managerWashes, mws2, mws10, mws11} = require('./washesPage')
const {managerEmployee, mes2, mes3, mes11} = require('./employeesPage')
const {managerFees, mfs2} = require('./feesPage')
const {managerBranch} = require('./branchPage')
const {getManager} = require('./../../controllers/managerController')

const managerPanel = async (bot, message, manager) => {
  let text
  const chat_id = message.chat.id, lang = manager.lang

  if (message.location) {
    text = message.location
  } else if (message.photo) {
    text = message.photo[0].file_id
  } else if (message.text) {
    text = message.text
  }

  try {
    await managerMainPage(bot, chat_id, text, lang)
    await managerSettings(bot, manager, text, lang)
    await managerEmployee(bot, chat_id, text, lang)
    await managerWashes(bot, chat_id, text, lang)
    await managerFees(bot, chat_id, text, lang)
    await managerBranch(bot, chat_id, text, lang)
  } catch (e) {
    console.log(e)
  }
}

module.exports = {managerPanel, getManager, mmp, mws2, mws10, mws11, mes2, mes3, mes11, mfs2}
