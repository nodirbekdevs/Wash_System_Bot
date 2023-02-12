const TelegramBot = require('node-telegram-bot-api')
const config = require('./helpers/config')
const db = require('./helpers/db')
const kb = require('./helpers/keyboard-buttons')
// const {userPanel, getUser, getOrders, ups4, uos13, uos19} = require('./pages/user_panel/userPanel')
// const {adminPanel, getAdmin, getWorks, aos3, aas8} = require('./pages/admin_panel/adminPanel')
// const {employeePanel, getEmployee, eos2} = require('./pages/employee_panel/employeePanel')

const {adminPanel, getAdmin, amp, acs3, aos3, aas8} = require('./pages/adminPanel/adminPanel')
const {ownerPanel, getOwner, ofs4, ofs14, ofs20} = require('./pages/ownerPanel/ownerPanel')
const {managerPanel, getManager, mmp, mws2, mws3, mws11, mws12, mes2, mes3, mes11, mcs2} = require('./pages/managerPanel/managerPanel')

const bot = new TelegramBot(config.TOKEN, {db, polling: true})

bot.setMyCommands(
  [
    {command: '/start', description: 'Start the bot'}
  ]
).then()


bot.on('message', async message => {
  // const query = {telegram_id: message.from.id, status: 'active'}, admin = await getAdmin(query),
  //   employee = await getEmployee(query), work = (await getWorks({}))[0]

  const query = {telegram_id: message.from.id, status: 'active'}, admin = await getAdmin(query),
    owner = await getOwner(query)


  try {
    if (admin) await adminPanel(bot, message, admin)
    if (owner) await ownerPanel(bot, message, owner)

  } catch (e) {
    console.log(e)
  }
})

bot.on('callback_query', async query => {
  const query_id = query.id, telegram_id = query.from.id, mid = query.message.message_id,
    data = query.data, {phrase, id} = JSON.parse(data)

  const request = {telegram_id, status: 'active'}, admin = await getAdmin(request), owner = await getOwner(request),
    manager = await getManager(request)

  if (admin) {
    if (phrase === "SEND_AD") await aas8(bot, telegram_id, id)

    await aos3(bot, telegram_id, query_id, mid, phrase, id)
    await acs3(bot, telegram_id, query_id, mid, phrase, id)

    if (phrase === 'none') {
      await bot.answerCallbackQuery(query_id, {
        text: "Bu yerda ma'lumotlar yo'q. Siz noto'g'ri betni tanladingiz.", show_alert: true
      })
    }

    if (phrase === 'delete') {
      await bot.deleteMessage(telegram_id, mid)

      await amp(bot, telegram_id)
    }
  }

  if (owner) {
    if (phrase === 'seen' || phrase === 'done') await ofs4(bot, telegram_id, id, phrase, owner.lang)
    if (phrase === 'e_car' || phrase === 'e_e') await ofs14(bot, telegram_id, query_id, mid, phrase, id, owner.lang)
    if (phrase === 's_car' || phrase === 's_e') await ofs20(bot, telegram_id, query_id, mid, phrase, id, owner.lang)
  }

  if (manager) {
    if (data === 'none') {
      const message = (manager.lang === kb.language.uz)
        ? "Bu yerda ma'lumotlar yo'q. Siz noto'g'ri betni tanladingiz."
        : "Здесь нет информации. Вы выбрали не ту страницу."

      await bot.answerCallbackQuery(query_id, {text: message, show_alert: true})
    }

    if (data === 'delete') {
      await bot.deleteMessage(telegram_id, mid)

      await mmp(bot, telegram_id, manager.lang)
    }
  }
})
