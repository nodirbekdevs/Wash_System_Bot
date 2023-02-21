const TelegramBot = require('node-telegram-bot-api')
const config = require('./helpers/config')
const db = require('./helpers/db')
const {adminPanel, adminPanelQuery, getAdmin} = require('./pages/adminPanel/adminPanel')
const {ownerPanel, ownerPanelQuery, getOwner} = require('./pages/ownerPanel/ownerPanel')
const {managerPanel, managerPanelQuery, getManager} = require('./pages/managerPanel/managerPanel')
const {employeePanel, employeePanelQuery, getEmployee} = require('./pages/employeePanel/employeePanel')
const {schedule} = require('./pages/schedule')

const bot = new TelegramBot(config.TOKEN, {db, polling: true})

bot.setMyCommands(
  [
    {command: '/start', description: 'Start the bot'},
    {command: '/stop', description: 'Stop the bot'}
  ]
).then()

bot.on('message', async message => {
  const query = {telegram_id: message.from.id, status: 'active'}, admin = await getAdmin(query),
    owner = await getOwner(query), employee = await getEmployee(query)

  const manager = await getManager(query)
    ? await getManager(query)
    : await getManager({telegram_id: message.from.id, status: 'occupied'})

  try {
    if (admin) await adminPanel(bot, message, admin)
    if (owner) await ownerPanel(bot, message, owner)
    if (manager) await managerPanel(bot, message, manager)
    if (employee) await employeePanel(bot, message, employee)
  } catch (e) {
    console.log(e)
  }
})

bot.on('callback_query', async query => {
  const query_id = query.id, telegram_id = query.from.id, message_id = query.message.message_id,
    {phrase, id} = JSON.parse(query.data), request = {telegram_id, status: 'active'}

  const admin = await getAdmin(request), owner = await getOwner(request), employee = await getEmployee(request)

  const manager = await getManager(request)
    ? await getManager(request)
    : await getManager({telegram_id, status: 'occupied'})

  try {
    if (admin) await adminPanelQuery(bot, telegram_id, query_id, message_id, phrase, id)
    if (owner) await ownerPanelQuery(bot, telegram_id, query_id, message_id, phrase, id, owner.lang)
    if (manager) await managerPanelQuery(bot, telegram_id, query_id, message_id, phrase, id, manager.lang)
    if (employee) await employeePanelQuery(bot, telegram_id, query_id, message_id, phrase, id, employee.lang)
  } catch (e) {
    console.log(e)
  }
})

schedule(bot)
