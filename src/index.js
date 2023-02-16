const TelegramBot = require('node-telegram-bot-api')
const config = require('./helpers/config')
const db = require('./helpers/db')
const kb = require('./helpers/keyboard-buttons')
// const {userPanel, getUser, getOrders, ups4, uos13, uos19} = require('./pages/user_panel/userPanel')
// const {adminPanel, getAdmin, getWorks, aos3, aas8} = require('./pages/admin_panel/adminPanel')
// const {employeePanel, getEmployee, eos2} = require('./pages/employee_panel/employeePanel')

const {adminPanel, getAdmin, amp, acs3, aos3, aas8} = require('./pages/adminPanel/adminPanel')
const {ownerPanel, getOwner, ofs4, ofs14, ofs20} = require('./pages/ownerPanel/ownerPanel')
const {managerPanel, getManager, mmp, mws2, mws11, mws12, mws13, mes2, mes3, mes11, mfs2} = require('./pages/managerPanel/managerPanel')
const {employeePanel, getEmployee, emp, ews2, efs1} = require('./pages/employeePanel/employeePanel')

const bot = new TelegramBot(config.TOKEN, {db, polling: true})

bot.setMyCommands(
  [
    {command: '/start', description: 'Start the bot'}
  ]
).then()


bot.on('message', async message => {
  const query = {telegram_id: message.from.id, status: 'active'}, admin = await getAdmin(query),
    owner = await getOwner(query), employee = await getEmployee(query)

  const manager = await getManager({telegram_id: message.from.id, status: 'active'})
    ? await getManager({telegram_id: message.from.id, status: 'active'})
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
  const query_id = query.id, telegram_id = query.from.id, mid = query.message.message_id,
    data = query.data, {phrase, id} = JSON.parse(data), request = {telegram_id, status: 'active'}

  const admin = await getAdmin(request), owner = await getOwner(request), employee = await getEmployee(request)

  const manager = await getManager({telegram_id, status: 'active'})
    ? await getManager({telegram_id, status: 'active'})
    : await getManager({telegram_id, status: 'occupied'})

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
    if (phrase === 'none') {
      const message = (manager.lang === kb.language.uz)
        ? "Bu yerda ma'lumotlar yo'q. Siz noto'g'ri betni tanladingiz."
        : "Здесь нет информации. Вы выбрали не ту страницу."

      await bot.answerCallbackQuery(query_id, {text: message, show_alert: true})
    }

    if (phrase === 'delete') {
      await bot.deleteMessage(telegram_id, mid)

      await mmp(bot, telegram_id, manager.lang)
    }

    if (((phrase.split('#')[0] === 'left' || phrase.split('#')[0] === 'right') && phrase.split('#')[1] === 'wash') || phrase === 'wash') {
      await mws2(bot, telegram_id, query_id, mid, phrase, id, manager.lang)
    }
    if ((phrase.split('#')[0] === 'left' || phrase.split('#')[0] === 'right') && phrase.split('#')[1] === 'washing')
      await mws11(bot, telegram_id, query_id, mid, phrase, id, manager.lang)
    if (phrase === 'washing') await mws12(bot, telegram_id, mid, phrase, id, manager.lang)
    if (phrase === 'washed' || phrase === 'w_back') await mws13(bot, telegram_id, mid, phrase, id, manager.lang)

    if (((phrase.split('#')[0] === 'left' || phrase.split('#')[0] === 'right') && phrase.split('#')[1] === 'employee') || phrase === 'emp')
      await mes2(bot, telegram_id, query_id, mid, phrase, id, manager.lang)

    if (phrase === 'e_d' || phrase === 'e_b') await mes3(bot, telegram_id, query_id, mid, phrase, id, manager.lang)
    if (phrase === 'e_edit') await mes11(bot, telegram_id, query_id, mid, phrase, id, manager.lang)

    if ((phrase.split('#')[0] === 'left' || phrase.split('#')[0] === 'right') && phrase.split('#')[1] === 'fee')
      await mfs2(bot, telegram_id, query_id, mid, phrase, id, manager.lang)
  }

  if (employee) {
    if (phrase === 'none') {
      const message = (employee.lang === kb.language.uz)
        ? "Bu yerda ma'lumotlar yo'q. Siz noto'g'ri betni tanladingiz."
        : "Здесь нет информации. Вы выбрали не ту страницу."

      await bot.answerCallbackQuery(query_id, {text: message, show_alert: true})
    }

    if (phrase === 'delete') {
      await bot.deleteMessage(telegram_id, mid)

      await emp(bot, telegram_id, employee.lang)
    }

    await mws2(bot, telegram_id, query_id, mid, phrase, id, employee.lang)
    await efs1(bot, telegram_id, query_id, mid, phrase, id, employee.lang)

  }
})
