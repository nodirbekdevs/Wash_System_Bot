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

  if (message.location) {
    text = message.location
  } else if (message.photo) {
    text = message.photo[0].file_id
  } else if (message.text) {
    text = message.text
  }

  try {
    if (owner.is_paid && !employee.is_idler) {
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


    } else if (employee.is_idler) {
      const message = employee.lang === kb.language.uz
        ? "Siz avval ishingizni tugating, keyin platformani ishlaa olasiz"
        : "Вы можете сначала закончить свою работу, а затем запустить платформу"

      await bot.sendMessage(employee.telegram_id, message)
    }

  } catch (e) {
    console.log(e)
  }
}

module.exports = {employeePanel, employeePanelQuery, getEmployee}
