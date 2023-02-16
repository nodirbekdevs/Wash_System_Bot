const kb = require('./../../helpers/keyboard-buttons')
const {getEmployee} = require('./../../controllers/employeeController')
const {getManager} = require('./../../controllers/managerController')
const {fee_pagination} = require('./../../helpers/utils')

const efs0 = async (bot, chat_id, lang) => {
  const employee = await getEmployee({telegram_id: chat_id}),
    manager = await getManager({telegram_id: employee.manager}),
    query = {owner: manager.owner, manager: chat_id, branch: manager.branch, status: 'active'}

  const report = await fee_pagination(1, 1, query, 'EMPLOYEE', lang)

  const kbb = report.kbs.reply_markup

  await bot.sendMessage(chat_id, report.text, {parse_mode: 'HTML', kbb})
}

const efs1 = async (bot, chat_id, query_id, message_id, data, _id, lang) => {
  const manager = await getManager({telegram_id: chat_id}),
    query = {owner: manager.owner, manager: chat_id, branch: manager.branch, status: 'active'}

  if ((data.split('#')[0] === 'left' || data.split('#')[0] === 'right') && data.split('#')[1] === 'fee') {
    const report = await fee_pagination(parseInt(data.split('#')[2]), 1, query, 'EMPLOYEE', lang)

    const kbs = report.kbs.reply_markup

    await bot.editMessageText(report.text, {chat_id, message_id, parse_mode: 'HTML', kbs})
  }
}

const employeeFees = async (bot, chat_id, text, lang) => {
  if (text === kb.employee.pages.uz.fees || text === kb.employee.pages.ru.fees) await efs0(bot, chat_id, lang)
}

module.exports = {employeeFees, efs1}
