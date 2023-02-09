const {adminMainPage, amp} = require('./mainPage')
const {adminSettings} = require('./settingsPage')
const {adminAdvertising, aas8} = require('./advertisingPage')
const {adminCars, acs3} = require('./carsPage')
const {adminOwners, aos3} = require('./ownersPage')
const {getAdmin, makeAdmin} = require('./../../controllers/adminController')

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

module.exports = {adminPanel, getAdmin, amp, acs3, aos3, aas8}
