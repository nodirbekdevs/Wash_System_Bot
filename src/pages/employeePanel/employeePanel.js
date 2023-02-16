const {employeeMainPage, emp} = require('./mainPage')
const {employeeSettings} = require('./settingsPage')
const {employeeWashes, ews2, ews4, ews5} = require('./washesPage')
const {employeeFeedback} = require('./feedbackPage')
const {employeeFees, efs1} = require('./feesPage')
const {employeeBranch} = require('./branchesPage')
const {getEmployee} = require('./../../controllers/employeeController')

const employeePanel = async (bot, message, employee) => {
  let text
  const chat_id = message.chat.id, lang = employee.lang

  console.log("Kevotti")

  if (message.location) {
    text = message.location
  } else if (message.photo) {
    text = message.photo[0].file_id
  } else if (message.text) {
    text = message.text
  }

  try {
    await employeeMainPage(bot, chat_id, text, lang)
    await employeeSettings(bot, employee, text, lang)
    await employeeFeedback(bot, chat_id, text, lang)
    await employeeWashes(bot, chat_id, text, lang)
    await employeeFees(bot, chat_id, text, lang)
    await employeeBranch(bot, chat_id, text, lang)
  } catch (e) {
    console.log(e)
  }
}

module.exports = {employeePanel, getEmployee, emp, efs1, ews2, ews4, ews5}
