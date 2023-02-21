const kb = require('./../../helpers/keyboard-buttons')
const {employeeMainPage} = require('./mainPage')
const {employeeSettings} = require('./settingsPage')
const {employeeWashes} = require('./washesPage')
const {employeeFeedback} = require('./feedbackPage')
const {employeeFees} = require('./feesPage')
const {employeeBranch} = require('./branchesPage')
const {getEmployee} = require('./../../controllers/employeeController')
const {employeePanelQuery} = require('./employeePanelQuery')
const {getManager} = require('./../../controllers/managerController')
const {getOwner} = require('./../../controllers/ownerController')

const employeePanel = async (bot, message, employee) => {
  let text
  const chat_id = message.chat.id, lang = employee.lang, manager = await getManager({telegram_id: employee.manager}),
  owner = await getOwner({telegram_id: manager.owner})

  console.log("Kevotti")

  if (message.location) {
    text = message.location
  } else if (message.photo) {
    text = message.photo[0].file_id
  } else if (message.text) {
    text = message.text
  }

  try {
    if (owner.is_paid) {
      await employeeMainPage(bot, chat_id, text, lang)
      await employeeSettings(bot, employee, text, lang)
      await employeeFeedback(bot, chat_id, text, lang)
      await employeeWashes(bot, chat_id, text, lang)
      await employeeFees(bot, chat_id, text, lang)
      await employeeBranch(bot, chat_id, text, lang)
    } else if (!owner.is_paid) {
      const message = employee.lang === kb.language.uz
        ? "Xo'jayinigiz bu oy uchun ro'yxatdan o'tmaganligi sababli platformani ishlata olmaysiz"
        : "Вы не можете использовать платформу, потому что ваш хост не зарегистрирован в этом месяце."

      await bot.sendMessage(employee.telegram_id, message)
    }

  } catch (e) {
    console.log(e)
  }
}

module.exports = {employeePanel, employeePanelQuery, getEmployee}
