const kb = require('./../../helpers/keyboard-buttons')
const {managerMainPage} = require('./mainPage')
const {managerSettings} = require('./settingsPage')
const {managerWashes} = require('./washesPage')
const {managerEmployee} = require('./employeesPage')
const {managerFees} = require('./feesPage')
const {managerBranch} = require('./branchPage')
const {getManager} = require('./../../controllers/managerController')
const {managerPanelQuery} = require('./managerPanelQuery')
const {getOwner} = require('./../../controllers/ownerController')

const managerPanel = async (bot, message, manager) => {
  let text
  const chat_id = message.chat.id, lang = manager.lang, owner = await getOwner({telegram_id: manager.owner})

  if (message.location) {
    text = message.location
  } else if (message.photo) {
    text = message.photo[0].file_id
  } else if (message.text) {
    text = message.text
  }

  try {
    if (owner.is_paid) {
      await managerMainPage(bot, chat_id, text, lang)
      await managerSettings(bot, manager, text, lang)
      await managerEmployee(bot, chat_id, text, lang)
      await managerWashes(bot, chat_id, text, lang)
      await managerFees(bot, chat_id, text, lang)
      await managerBranch(bot, chat_id, text, lang)
    } else if (!owner.is_paid) {
      const message = manager.lang === kb.language.uz
        ? "Xo'jayinigiz bu oy uchun ro'yxatdan o'tmaganligi sababli platformani ishlata olmaysiz"
        : "Вы не можете использовать платформу, потому что ваш хост не зарегистрирован в этом месяце."

      await bot.sendMessage(manager.telegram_id, message)
    }

  } catch (e) {
    console.log(e)
  }
}

module.exports = {managerPanel, managerPanelQuery, getManager}
