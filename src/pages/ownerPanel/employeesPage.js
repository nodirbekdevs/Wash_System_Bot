const kb = require('./../../helpers/keyboard-buttons')
const keyboard = require('./../../helpers/keyboard')
const {omp} = require('./mainPage')
const {getBranches, getBranch, updateBranch} = require('./../../controllers/branchController')
const {getOwner, updateOwner} = require('./../../controllers/ownerController')
const {getEmployees, getEmployee} = require('./../../controllers/employeeController')
const {getManager} = require('./../../controllers/managerController')
const {report, branch_report_keyboard, owner_employee_pagination, date} = require('./../../helpers/utils')

const oes0 = async (bot, chat_id, lang) => {
  let message = '', clause, kbb

  const branches = await getBranches({owner: chat_id, status: 'provided'})

  if (branches.length > 0) {
    clause = (lang === kb.language.uz)
      ? "Qaysi filialdagi xodimlarni ko'rmoqchisiz ?"
      : "Из какого филиала вы хотите видеть сотрудников ?"

    kbb = branch_report_keyboard(branches, lang)

    message = (lang === kb.language.uz) ? "Xodimlar sahifasi." : "Страница сотрудников."

    await updateOwner({telegram_id: chat_id}, {step: 19})

  } else if (branches.length <= 0) {
    if (lang === kb.language.uz) {
      clause = "Hali filiallar mavjud bo'lmaganligi sababli bugungi yuvishlarni ko'ra olmaysiz"
      kbb = keyboard.owner.pages.uz
    } else if (lang === kb.language.ru) {
      clause = "Вы не можете видеть сегодняшние мойки, потому что еще нет филталов"
      kbb = keyboard.owner.pages.ru
    }
  }

  if (message !== '') {
    await bot.sendMessage(chat_id, message)
  }

  await bot.sendMessage(chat_id, clause, {reply_markup: {resize_keyboard: true, keyboard: kbb}})
}

const oes1 = async (bot, chat_id, text, lang) => {
  let message, kbb

  const branch = await getBranch({name: text}) ? await getBranch({name: text}) : await getBranch({_id: text})

  if (branch) {
    await updateOwner({telegram_id: chat_id}, {step: 20})

    await updateBranch({_id: branch._id}, {situation: 'employee'})

    if (lang === kb.language.uz) {
      message = "Barcha xodimlarni ko'rmoqchimisiz yoki bugun ishga kelganlarinimi ?"
      kbb = keyboard.owner.employees.uz
    } else if (lang === kb.language.ru) {
      message = "Хотите увидеть всех сотрудников или только тех, кто сегодня пришел на работу ?"
      kbb = keyboard.owner.washes.ru
    }
  } else if (!branch) {
    await updateOwner({telegram_id: chat_id}, {step: 5})

    if (lang === kb.language.uz) {
      message = "Bunday filial topilmadi"
      kbb = keyboard.owner.pages.uz
    } else if (lang === kb.language.ru) {
      message = "Такой филиал не найдено"
      kbb = keyboard.owner.pages.ru
    }
  }

  await bot.sendMessage(chat_id, message, {reply_markup: {resize_keyboard: true, keyboard: kbb}})
}

const oes2 = async (bot, chat_id, branch, lang) => {
  const manager = await getManager({telegram_id: branch.manager}),
    query = {manager: manager.telegram_id, branch: manager.branch, status: {$in: ['active', 'inactive']}}

  const report = await owner_employee_pagination(1, 6, query, 'ALL', lang)

  await bot.sendMessage(chat_id, report.text, {parse_mode: 'HTML', reply_markup: report.kbs.reply_markup})
}

const oes3 = async (bot, chat_id, branch, lang) => {
  const manager = await getManager({telegram_id: branch.manager}),
    query = {manager: manager.telegram_id, branch: manager.branch, status: 'active'}

  const report = await owner_employee_pagination(1, 6, query, 'ACTIVE', lang)

  await bot.sendMessage(chat_id, report.text, {parse_mode: 'HTML', reply_markup: report.kbs.reply_markup})
}

const oes4 = async (bot, chat_id, branch, lang) => {
  const manager = await getManager({telegram_id: branch.manager}),
    query = {manager: manager.telegram_id, branch: manager.branch, status: 'inactive'}

  const report = await owner_employee_pagination(1, 6, query, 'INACTIVE', lang)

  await bot.sendMessage(chat_id, report.text, {parse_mode: 'HTML', reply_markup: report.kbs.reply_markup})
}

const oes5 = async (bot, chat_id, message_id, data, _id, lang) => {
  let clause, back, kbb

    const employee = await getEmployee({_id}), manager = await getManager({telegram_id: employee.manager}),
      started_at = date(employee.created_at)

    if (lang === kb.language.uz) {
      clause = kb.options.dismissal.uz
      back = kb.options.back.uz
    } else if (lang === kb.language.ru) {
      clause = kb.options.dismissal.ru
      back = kb.options.back.ru
    }

    if (data === 'e_all') {
      kbb = [
        [{text: clause, callback_data: JSON.stringify({phrase: "e_a_d", id: employee._id})}],
        [{text: back, callback_data: JSON.stringify({phrase: "e_a_b", id: ''})}],
      ]
    } else if (data === 'e_act') {
      kbb = [
        [{text: clause, callback_data: JSON.stringify({phrase: "e_ac_d", id: employee._id})}],
        [{text: back, callback_data: JSON.stringify({phrase: "e_ac_b", id: ''})}],
      ]
    } else if (data === 'e_inact') {
      kbb = [
        [{text: clause, callback_data: JSON.stringify({phrase: "e_in_d", id: employee._id})}],
        [{text: back, callback_data: JSON.stringify({phrase: "e_in_b", id: ''})}],
      ]
    }

    const employee_data = {
      manager: manager.name, branch: employee.branch, name: employee.name, number: employee.number,
      total_washes: employee.total_washes, is_idler: employee.is_idler, lang: employee.lang,
      status: employee.status, created_at: started_at
    }

    const message = report(employee_data, 'EMPLOYEE', lang)

    await bot.editMessageText(message, {chat_id, message_id, parse_mode: 'HTML', reply_markup: {inline_keyboard: kbb}})
}

const oes6 = async (bot, chat_id, message_id, data, lang) => {
  let query, type

  const branch = await getBranch({owner: chat_id, situation: 'employee'})


  if (branch) {
    const manager = await getManager({telegram_id: branch.manager})

    if ((data[0] === 'left' || data[0] === 'right') && data[1] === 'all_e') {
      query = {manager: manager.telegram_id, branch: manager.branch, status: {$in: ['active', 'inactive']}}
      type = 'ALL'
    } else if ((data[0] === 'left' || data[0] === 'right') && data[1] === 'act_e') {
      query = {manager: manager.telegram_id, branch: manager.branch, status: 'active'}
      type = 'ACTIVE'
    } else if ((data[0] === 'left' || data[0] === 'right') && data[1] === 'inact_e') {
      query = {manager: manager.telegram_id, branch: manager.branch, status: 'inactive'}
      type = 'INACTIVE'
    }

    const report = await owner_employee_pagination(parseInt(data[2]), 6, query, type, lang), kbb = report.kbs.reply_markup

    await bot.editMessageText(report.text, {chat_id, message_id, parse_mode: 'HTML', reply_markup: kbb})
  }
}

const oes7 = async (bot, chat_id, message_id, data, _id, lang) => {
  let message, query, type

  const branch = await getBranch({owner: chat_id, situation: 'employee'}),
    manager = await getManager({telegram_id: branch.manager})

  if (data === 'e_a_d' || data === 'e_ac_d' || data === 'e_in_d') {
    const employee = await getEmployee({_id})

    if (!employee.is_idler) {
      employee.status = 'unemployed'
      employee.step = 6
      employee.dismissal_at = new Date()
      await employee.save()

      branch.total_employees -= 1
      await branch.save()

      manager.total_employees -= 1
      await manager.save()

      message = (lang === kb.language.uz)
        ? `${employee.name} - ${manager.name} - ${employee.branch} - ${employee.number}. Xodim ishdan bo'shatildi.`
        : `${employee.name} - ${manager.name} - ${employee.branch} - ${employee.number}. Сотрудник был уволен.`

      // await bot.sendMessage(employee.telegram_id, "Siz ishdan bo'shatildingiz.")
    } else if (employee.is_idler) {
      message = (lang === kb.language.uz)
        ? "Xodim hozir ishlayapti. Iltimos ishini tugatgandan so'ng bo'shating."
        : "В настоящее время сотрудник работает. Пожалуйста, отпустите, когда закончите."
    }

    await bot.sendMessage(chat_id, message)

    if (data === 'e_a_d') {
      query = {manager: manager.telegram_id, branch: manager.branch, status: {$in: ['active', 'inactive']}}
      type = 'ALL'
    } else if (data === 'e_ac_d') {
      query = {manager: manager.telegram_id, branch: manager.branch, status: 'active'}
      type = 'ACTIVE'
    } else if (data === 'e_in_d') {
      query = {manager: manager.telegram_id, branch: manager.branch, status: 'inactive'}
      type = 'INACTIVE'
    }
  }

  if (data === 'e_a_b') {
    query = {manager: manager.telegram_id, branch: manager.branch, status: {$in: ['active', 'inactive']}}
    type = 'ALL'
  } else if (data === 'e_ac_b') {
    query = {manager: manager.telegram_id, branch: manager.branch, status: 'active'}
    type = 'ACTIVE'
  } else if (data === 'e_in_b') {
    query = {manager: manager.telegram_id, branch: manager.branch, status: 'inactive'}
    type = 'INACTIVE'
  }

  const report = await owner_employee_pagination(1, 6, query, type, lang)

  await bot.editMessageText(report.text, {
    chat_id, message_id, parse_mode: 'HTML', reply_markup: report.kbs.reply_markup
  })
}

const oes8 = async (bot, chat_id, lang) => {
  await updateOwner({telegram_id: chat_id}, {step: 5})
  await updateBranch({owner: chat_id, situation: 'employee'}, {situation: ''})
  await omp(bot, chat_id, lang)
}

const ownerEmployees = async (bot, chat_id, text, lang) => {
  const owner = await getOwner({telegram_id: chat_id})

  try {
    console.log("Kevotti")
    if (text === kb.owner.pages.uz.employees || text === kb.owner.pages.ru.employees) await oes0(bot, chat_id, lang)

    if (owner) {
      if (owner.step === 19) {
        if (text === kb.main.uz || text === kb.main.ru) await oes8(bot, chat_id, lang)
        if (text !== kb.main.uz || text !== kb.main.uz) await oes1(bot, chat_id, text, lang)
      }

      if (owner.step === 20) {
        const branch = await getBranch({owner: chat_id, situation: 'employee'})

        if (text === kb.options.back.uz || text === kb.options.back.ru) await oes1(bot, chat_id, branch.name, lang)

        if (text !== kb.options.back.uz || text !== kb.options.back.ru) {
          if (text === kb.owner.employees.uz.all || text === kb.owner.employees.uz.all) await oes2(bot, chat_id, branch, lang)
          if (text === kb.owner.employees.uz.working || text === kb.owner.employees.uz.working) await oes3(bot, chat_id, branch, lang)
          if (text === kb.owner.employees.uz.do_not_work || text === kb.owner.employees.uz.do_not_work) await oes4(bot, chat_id, branch, lang)
        }
      }
    }
  } catch (e) {
    console.log(e)
  }
}

module.exports = {ownerEmployees, oes5, oes6, oes7}
