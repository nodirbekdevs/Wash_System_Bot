const keyboard = require('./../../helpers/keyboard')
const kb = require('./../../helpers/keyboard-buttons')
const {genSalt, hash} = require('bcrypt')
const {getEmployee, updateEmployee} = require('../../controllers/employeeController')
const {report, parse_number} = require('./../../helpers/utils')

let type

const ess0 = async (bot, employee, lang) => {
  const message = report(employee, 'EMPLOYEE_SETTINGS', lang), kbb = (lang === kb.language.uz)
    ? keyboard.employee.settings.uz : keyboard.employee.settings.ru

  await updateEmployee({telegram_id: employee.telegram_id}, {step: 6})

  await bot.sendMessage(employee.telegram_id, message, {reply_markup: {resize_keyboard: true, keyboard: kbb}})
}

const ess1 = async (bot, chat_id, lang) => {
  let message, kbb

  if (lang === kb.language.uz) {
    message = "O'zgartirmoqchi bo'lgan ismingizni kiriting"
    kbb = keyboard.options.back.uz
  } else if (lang === kb.language.ru) {
    message = "Введите имя, которое хотите изменить"
    kbb = keyboard.options.back.ru
  }

  await updateEmployee({telegram_id: chat_id}, {step: 7})

  await bot.sendMessage(chat_id, message, {reply_markup: {resize_keyboard: true, keyboard: kbb}})
}

const ess2 = async (bot, chat_id, text, lang) => {
  let clause, kbb

  await updateEmployee({telegram_id: chat_id}, {name: text, step: 6})

  const employee = await getEmployee({telegram_id: chat_id}), message = report(employee, 'EMPLOYEE_SETTINGS', lang)

  if (lang === kb.language.uz) {
    clause = "Ismingiz muvaffaqiyatli o'zgartirildi"
    kbb = keyboard.manager.settings.uz
  } else if (lang === kb.language.ru) {
    clause = "Ваше имя успешно изменено"
    kbb = keyboard.manager.settings.ru
  }

  await bot.sendMessage(chat_id, message)

  await bot.sendMessage(chat_id, clause, {reply_markup: {resize_keyboard: true, keyboard: kbb}})
}

const ess3 = async (bot, chat_id, lang) => {
  let message, kbb

  if (lang === kb.language.uz) {
    message = "O'zgartirmoqchi bo'lgan raqamingizni kiriting"
    kbb = keyboard.options.back.uz
  } else if (lang === kb.language.ru) {
    message = "Введите номер, который хотите изменить"
    kbb = keyboard.options.back.ru
  }

  await updateEmployee({telegram_id: chat_id}, {step: 7})

  await bot.sendMessage(chat_id, message, {reply_markup: {resize_keyboard: true, keyboard: kbb}})
}

const ess4 = async (bot, chat_id, text, lang) => {
  let clause, kbb

  const parse = parse_number()

  if (parse !== 'NaN') {
    const salt = await genSalt(), password = await hash(text, salt)

    await updateEmployee({telegram_id: chat_id}, {password, number: text, step: 6})

    const employee = await getEmployee({telegram_id: chat_id}), message = report(employee, 'EMPLOYEE_SETTINGS', lang)

    if (lang === kb.language.uz) {
      clause = "Raqamingiz muvaffaqiyatli o'zgartirildi"
      kbb = keyboard.employee.settings.uz
    } else if (lang === kb.language.ru) {
      clause = "Ваш номер успешно изменен"
      kbb = keyboard.employee.settings.ru
    }

    await bot.sendMessage(chat_id, message)
  } else if (parse === 'NaN') {
    if (lang === kb.language.uz) {
      clause = "Iltimos to'g'ri raqam yuboring"
      kbb = keyboard.options.back.uz
    } else if (lang === kb.language.ru) {
      clause = "Пожалуйста, пришлите правильный номер"
      kbb = keyboard.options.back.ru
    }
  }

  await bot.sendMessage(chat_id, clause, {reply_markup: {resize_keyboard: true, keyboard: kbb}})
}

const ess5 = async (bot, chat_id, lang) => {
  let message, kbb

  if (lang === kb.language.uz) {
    message = "Qaysi tilni tanlaysiz"
    kbb = keyboard.options.back.uz
  } else if (lang === kb.language.ru) {
    message = "Какой язык вы выбираете"
    kbb = keyboard.options.back.ru
  }

  await updateEmployee({telegram_id: chat_id}, {step: 7})

  await bot.sendMessage(chat_id, message, {reply_markup: {resize_keyboard: true, keyboard: kbb}})
}

const ess6 = async (bot, chat_id, text) => {
  let clause, kbb

  await updateEmployee({telegram_id: chat_id}, {lang: text, step: 6})

  const employee = await getEmployee({telegram_id: chat_id}),
    message = report(employee, 'EMPLOYEE_SETTINGS', employee.lang)

  if (employee.lang === kb.language.uz) {
    clause = "Platformadagi tilingiz muvaffaqiyatli o'zgartirildi"
    kbb = keyboard.manager.settings.uz
  } else if (employee.lang === kb.language.ru) {
    clause = "Язык вашей платформы успешно изменен"
    kbb = keyboard.manager.settings.ru
  }

  await bot.sendMessage(chat_id, message)

  await bot.sendMessage(chat_id, clause, {reply_markup: {resize_keyboard: true, keyboard: kbb}})
}

const employeeSettings = async (bot, employee, text, lang) => {
  try {
    if (text === kb.employee.pages.uz.settings || text === kb.employee.pages.ru.settings) await ess0(bot, employee, lang)
    if (employee.step === 6 && (text === kb.main.uz || text === kb.main.ru)) await updateEmployee({telegram_id: employee.telegram_id}, {step: 5})
    if (employee.step === 6) {
      if (text === kb.employee.settings.uz.name || text === kb.employee.settings.ru.name) await ess1(bot, employee.telegram_id, lang)
      if (text === kb.employee.settings.uz.number || text === kb.employee.settings.ru.number) await ess3(bot, employee.telegram_id, lang)
      if (text === kb.employee.settings.uz.language || text === kb.employee.settings.ru.language) await ess5(bot, employee.telegram_id, lang)
      type = text
    } else if (employee.step === 7) {
      if (text === kb.options.back.uz || text === kb.options.back.ru) {
        await ess0(bot, employee, lang)
      } else if (text !== kb.options.back.uz || text !== kb.options.back.ru) {
        if (type === kb.employee.settings.uz.name || type === kb.employee.settings.ru.name) await ess2(bot, employee.telegram_id, text, lang)
        if (type === kb.employee.settings.uz.number || type === kb.employee.settings.ru.number) await ess4(bot, employee.telegram_id, text, lang)
        if (type === kb.employee.settings.uz.language || type === kb.employee.settings.ru.language) await ess6(bot, employee.telegram_id, text, lang)
      }
    }
  } catch (e) {
    console.log(e)
  }
}

module.exports = {employeeSettings}
