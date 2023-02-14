const kb = require('./../../helpers/keyboard-buttons')
const keyboard = require('./../../helpers/keyboard')
const {getEmployees, getEmployee, makeEmployee, updateEmployee, deleteEmployee, countEmployees} = require('./../../controllers/employeeController')
const {getManager} = require('./../../controllers/managerController')
const {getBranch} = require('./../../controllers/branchController')
const {report, date, employee_pagination, employee_attendance} = require('./../../helpers/utils')

let employee_id

const mes0 = async (bot, chat_id, lang) => {
  let message, kbb

  if (lang === kb.language.uz) {
    message = "Xodimlar sahifasi"
    kbb = keyboard.manager.employees.uz
  } else if (lang === kb.language.ru) {
    message = "Страница сотрудников"
    kbb = keyboard.manager.employees.ru
  }

  await bot.sendMessage(chat_id, message, {reply_markup: {resize_keyboard: true, keyboard: kbb}})
}

const mes1 = async (bot, chat_id, lang) => {
  const manager = await getManager({telegram_id: chat_id}),
    query = {manager: manager.telegram_id, branch: manager.branch, status: 'active'}

  const report = await employee_pagination(1, 6, query, lang)

  await bot.sendMessage(chat_id, report.text, {
    parse_mode: 'HTML',
    reply_markup: {inline_keyboard: report.kbb}
  })
}

const mes2 = async (bot, chat_id, query_id, message_id, data, _id, lang) => {
  let message, back, clause

  const manager = await getManager({telegram_id: chat_id}),
    query = {manager: manager.telegram_id, branch: manager.branch, status: 'active'}

  if ((data.split('#')[0] === 'left' || data.split('#')[0] === 'right') && data.split('#')[1] === 'employee') {

    const report = await employee_pagination(data.split('#')[2], 6, query, lang)

    await bot.editMessageText(report.text, {
      chat_id, message_id, parse_mode: 'HTML', reply_markup: {inline_keyboard: report.kbb}
    })

    await bot.answerCallbackQuery(query_id, '')
  }

  if (data === 'employee') {
    const employee = await getEmployee({_id})

    const started_at = date(employee.created_at)

    const data = {
      manager: manager.name,
      branch: employee.branch,
      name: employee.name,
      number: employee.number,
      total_washes: employee.total_washes,
      is_idler: employee.is_idler,
      lang: employee.lang,
      status: employee.status,
      created_at: started_at
    }

    message = report(data, 'EMPLOYEE', lang)

    if (lang === kb.language.uz) {
      clause = kb.options.dismissal.uz
      back = kb.options.back.uz
    } else if (lang === kb.language.ru) {
      clause = kb.options.dismissal.ru
      back = kb.options.back.ru
    }

    await bot.editMessageText(message, {
      chat_id, message_id, parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [
          [{text: clause, callback_data: JSON.stringify({phrase: "e_delete", id: employee._id})}],
          [{text: back, callback_data: JSON.stringify({phrase: "e_back", id: ''})}],
        ]
      }
    })

    await bot.answerCallbackQuery(query_id, '')
  }
}

const mes3 = async (bot, chat_id, query_id, message_id, data, _id, lang) => {
  let message

  const manager = await getManager({telegram_id: chat_id}), employee = await getEmployee({_id}),
    branch = await getBranch({manager: employee.manager, name: employee.branch})

  if (data === 'e_delete') {
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
    } else if (employee.is_idler) {
      message = (lang === kb.language.uz)
        ? "Xodim hozir ishlayapti. Iltimos ishini tugatgandan so'ng bo'shating."
        : "В настоящее время сотрудник работает. Пожалуйста, отпустите, когда закончите."
    }

    await bot.sendMessage(chat_id, message)
  }

  const query = {manager: manager.telegram_id, branch: manager.branch, status: 'active'}

  const report = await employee_pagination(1, 6, query, lang)

  await bot.editMessageText(report.text, {
    chat_id, message_id, parse_mode: 'HTML', reply_markup: {inline_keyboard: report.kbb}
  })
}

const mes4 = async (bot, chat_id, lang) => {
  let message, kbb

  const manager = await getManager({telegram_id: chat_id})

  const new_employee = await makeEmployee({manager: manager.telegram_id, branch: manager.branch})
  employee_id = new_employee._id

  if (lang === kb.language.uz) {
    message = "Xodimni telegram id sini kiriting."
    kbb = keyboard.options.back.uz
  } else if (lang === kb.language.ru) {
    message = "Введите telegram id сотрудника."
    kbb = keyboard.options.back.ru
  }

  await bot.sendMessage(chat_id, message, {reply_markup: {resize_keyboard: true, keyboard: kbb}})
}

const mes5 = async (bot, chat_id, _id, text, lang) => {
  let message, kbb

  await updateEmployee({_id}, {telegram_id: parseInt(text), step: 1})

  if (lang === kb.language.uz) {
    message = "Xodimni ismini kiriting."
    kbb = keyboard.options.back.uz
  } else if (lang === kb.language.ru) {
    message = "Введите имя сотрудника."
    kbb = keyboard.options.back.ru
  }

  await bot.sendMessage(chat_id, message, {reply_markup: {resize_keyboard: true, keyboard: kbb}})
}

const mes6 = async (bot, chat_id, _id, text, lang) => {
  let message, kbb

  await updateEmployee({_id}, {name: text, step: 2})

  if (lang === kb.language.uz) {
    message = "Xodimni telefon raqamini kiriting."
    kbb = keyboard.options.back.uz
  } else if (lang === kb.language.ru) {
    message = "Введите номер телефона сотрудника."
    kbb = keyboard.options.back.ru
  }

  await bot.sendMessage(chat_id, message, {reply_markup: {resize_keyboard: true, keyboard: kbb}})
}

const mes7 = async (bot, chat_id, _id, text, lang) => {
  await updateEmployee({_id}, {number: text, step: 3})

  const kbb = keyboard.language, message = (lang === kb.language.uz)
    ? "Xodimni platformada ishlatadigan tilni kiriting."
    : "Введите язык, который сотрудник использует на платформе."


  await bot.sendMessage(chat_id, message, {reply_markup: {resize_keyboard: true, keyboard: kbb}})
}

const mes8 = async (bot, chat_id, _id, text, lang) => {
  let message, kbb
  await updateEmployee({_id}, {lang: text, step: 4})

  const employee = await getEmployee({_id}), manager = await getManager({_id}), started_at = date(employee.created_at)

  const data = {
    manager: manager.name,
    branch: employee.branch,
    name: employee.name,
    number: employee.number,
    total_washes: employee.total_washes,
    is_idler: employee.is_idler,
    lang: employee.lang,
    status: employee.status,
    created_at: started_at
  }

  message = report(data, 'EMPLOYEE', lang)

  if (lang === kb.language.uz) {
    message = "\nTugatilganini tasdiqlaysizmi?"
    kbb = keyboard.options.confirmation.uz
  } else if (lang === kb.language.ru) {
    message = "\n Подтвердить завершение?"
    kbb = keyboard.options.confirmation.ru
  }

  await bot.sendMessage(chat_id, message, {reply_markup: {resize_keyboard: true, keyboard: kbb}})
}

const mes9 = async (bot, chat_id, _id, text, lang) => {
  let message

  const kbb = (lang === kb.language.uz) ? keyboard.manager.employees.uz : keyboard.manager.employees.ru

  const employee = await getEmployee({_id}), manager = await getManager({telegram_id: chat_id}),
    branch = await getBranch({manager: employee.manager, branch: employee.branch})

  if (text === kb.options.confirmation.uz || text === kb.options.confirmation.ru) {
    employee.step = 5
    employee.status = 'active'
    await employee.save()

    manager.total_employees += 1
    manager.save()

    branch.total_employees += 1
    await branch.save()

    message = (lang === kb.language.uz) ? "Yangi xodim isha qabul qilindi." : "На работу принят новый сотрудник."
  } else if (text === kb.options.not_to_confirmation.uz || text === kb.options.not_to_confirmation.ru) {
    await deleteEmployee({_id})

    message = (lang === kb.language.uz) ? "Yangi xodim ishga qabul qilinmadi." : "Новый сотрудник не был принят на работу."
  }

  await bot.sendMessage(chat_id, message, {reply_markup: {resize_keyboard: true, keyboard: kbb}})
}

const mes10 = async (bot, chat_id, lang) => {
  let workers = []

  const manager = await getManager({telegram_id: chat_id}),
    employees = await getEmployees({manager: manager.telegram_id, branch: manager.branch})

  for (let i = 0; i < employees.length; i++) {
    if (employees[i].status !== 'process' || employees[i].status !== 'unemployed') {
      workers.push(employees[i])
    }
  }

  const report = employee_attendance(workers, lang)

  await bot.sendMessage(chat_id, report.text, {parse_mode: 'HTML', reply_markup: {inline_keyboard: report.kbb}})
}

const mes11 = async (bot, chat_id, query_id, message_id, data, _id, lang) => {
  let message, workers = []

  const manager = await getManager({telegram_id: chat_id}), employee = await getEmployee({_id})

  if (data === 'e_edit') {
    if (!employee.is_idler) {

      if (employee.status === 'active') {
        employee.status = 'inactive'
      } else if (employee.status === 'inactive') {
        employee.status = 'active'
      }

      await employee.save()

      message = (lang === kb.language.uz)
        ? `${employee.name} - ${manager.name} - ${employee.branch} - ${employee.number}. Xodim ishdan bo'shatildi.`
        : `${employee.name} - ${manager.name} - ${employee.branch} - ${employee.number}. Сотрудник был уволен.`
    } else if (employee.is_idler) {
      message = (lang === kb.language.uz)
        ? "Xodim hozir ishlayapti. Iltimos ishini tugatgandan so'ng uni ketishiga ruxsat bering."
        : "В настоящее время сотрудник работает. Пожалуйста, отпустите его, когда он закончит."
    }

    await bot.sendMessage(chat_id, message)
  }

  const employees = await getEmployees({manager: manager.telegram_id, branch: manager.branch})

  for (let i = 0; i < employees.length; i++) {
    if (employees[i].status !== 'process' || employees[i] !== 'unemployed') {
      workers.push(employees[i])
    }
  }

  const report = await employee_attendance(workers, lang)

  await bot.editMessageText(report.text, {
    chat_id, message_id, parse_mode: 'HTML', reply_markup: {inline_keyboard: report.kbb}
  })
}

const managerEmployee = async (bot, chat_id, text, lang) => {
  const manager = await getManager({telegram_id: chat_id})

  const employee = await getEmployee({_id: employee_id, manager: manager.telegram_id, branch: manager.branch, status: 'process'})
    ? await getEmployee({_id: employee_id, manager: manager.telegram_id, branch: manager.branch, status: 'process'})
    : (await getEmployees({manager: manager.telegram_id, branch: manager.branch, status: 'process'}))[0]

  if (text === kb.manager.pages.uz.employees || text === kb.manager.pages.ru.employees) await mes0(bot, chat_id, lang)
  if (text === kb.manager.employees.uz.all || text === kb.manager.employees.ru.all) await mes1(bot, chat_id, lang)
  if (text === kb.manager.employees.uz.add || text === kb.manager.employees.ru.add) await mes4(bot, chat_id, lang)
  if (text === kb.manager.employees.uz.attendance || text === kb.manager.employees.ru.attendance) await mes10(bot, chat_id, lang)

  if (employee) {
    if (employee.step === 0) await mes5(bot, chat_id, employee._id, text, lang)
    if (employee.step === 1) await mes6(bot, chat_id, employee._id, text, lang)
    if (employee.step === 2) await mes7(bot, chat_id, employee._id, text, lang)
    if (employee.step === 3) await mes8(bot, chat_id, employee._id, text, lang)
    if (employee.step === 4) await mes9(bot, chat_id, employee._id, text, lang)
  }
}

module.exports = {managerEmployee, mes2, mes3, mes11}
