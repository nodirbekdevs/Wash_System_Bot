const {adminMainPage} = require('./mainPage')
const {adminSettings} = require('./settingsPage')
const {adminAdvertising} = require('./advertisingPage')
const {adminCars} = require('./carsPage')
const {adminOwners} = require('./ownersPage')
const {getAdmin} = require('./../../controllers/adminController')
const {adminPanelQuery} = require('./adminPanelQuery')

const adminPanel = async (bot, message, admin) => {
  const chat_id = message.chat.id, username = message.from.username,
    text = message.photo ? message.photo[0].file_id : message.text

  try {
    await adminMainPage(bot, chat_id, text)
    await adminSettings(bot, admin, text)
    await adminAdvertising(bot, chat_id, text)
    await adminCars(bot, chat_id, text)
    await adminOwners(bot, chat_id, text)
  } catch (e) {
    console.log(e)
  }
}

module.exports = {adminPanel, adminPanelQuery, getAdmin}
