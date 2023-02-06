const keyboard = require('./../../helpers/keyboard')
const kb = require('./../../helpers/keyboard-buttons')
const {getEmployee, updateEmployee} = require('../../controllers/employeeController')
const {bio} = require('./../../helpers/utils')

let type

const ess0 = async (bot, employee, lang) => {
  const message = bio(employee, 'EMPLOYEE_SETTINGS', lang), kbb = (lang === kb.language.uz)
    ? keyboard.employee.settings.uz : keyboard.employee.settings.ru

  await updateEmployee({telegram_id: employee.telegram_id}, {step: 6})

  await bot.sendMessage(employee.telegram_id, message, {reply_markup: {resize_keyboard: true, keyboard: kbb}})

}

const ess1 = async (bot, chat_id, lang) => {
  const message = (lang === kb.language.uz)
    ? "O'zgartirmoqchi bo'lgan ismingizni kiriting"
    : "Введите имя, которое хотите изменить"

  await updateEmployee({telegram_id: chat_id}, {step: 7})

  await bot.sendMessage(chat_id, message)
}

const ess2 = async (bot, chat_id, text, lang) => {
  let clause, kbb

  await updateEmployee({telegram_id: chat_id}, {name: text, step: 6})

  const employee = await getEmployee({telegram_id: chat_id}), message = bio(employee, 'EMPLOYEE_SETTINGS', lang)

  if (lang === kb.language.uz) {
    clause = "Ismingiz muvaffaqiyatli o'zgartirildi"
    kbb = keyboard.manager.settings.uz
  } else if (lang === kb.language.ru) {
    clause = "Ваше имя успешно изменено"
    kbb = keyboard.manager.settings.ru
  }

  await bot.sendMessage(chat_id, clause, {reply_markup: {resize_keyboard: true, keyboard: kbb}})

  await bot.sendMessage(chat_id, message)
}

const ess3 = async (bot, chat_id, lang) => {
  const message = (lang === kb.language.uz)
    ? "O'zgartirmoqchi bo'lgan raqamingizni kiriting"
    : "Введите номер, который хотите изменить"

  await updateEmployee({telegram_id: chat_id}, {step: 7})

  await bot.sendMessage(chat_id, message)
}

const ess4 = async (bot, chat_id, text, lang) => {
  let clause, kbb

  await updateEmployee({telegram_id: chat_id}, {number: text, step: 6})

  const employee = await getEmployee({telegram_id: chat_id}), message = bio(employee, 'EMPLOYEE_SETTINGS', lang)

  if (lang === kb.language.uz) {
    clause = "Raqamingiz muvaffaqiyatli o'zgartirildi"
    kbb = keyboard.manager.settings.uz
  } else if (lang === kb.language.ru) {
    clause = "Ваш номер успешно изменен"
    kbb = keyboard.manager.settings.ru
  }

  await bot.sendMessage(chat_id, clause, {reply_markup: {resize_keyboard: true, keyboard: kbb}})

  await bot.sendMessage(chat_id, message)
}

const ess5 = async (bot, chat_id, lang) => {
  await updateEmployee({telegram_id: chat_id}, {step: 7})

  const message = (lang === kb.language.uz) ? "Qaysi tilni tanlaysiz" : "Какой язык вы выбираете"

  await bot.sendMessage(chat_id, message, {reply_markup: {resize_keyboard: true, keyboard: keyboard.language}})
}

const ess6 = async (bot, chat_id, text, lang) => {
  let message, kbb

  await updateEmployee({telegram_id: chat_id}, {lang: text, step: 6})

  const employee = await getEmployee({telegram_id: chat_id}), report = bio(employee, 'EMPLOYEE_SETTINGS', lang)

  if (lang === kb.language.uz) {
    message = "Platformadagi tilingiz muvaffaqiyatli o'zgartirildi"
    kbb = keyboard.manager.settings.uz
  } else if (lang === kb.language.ru) {
    message = "Язык вашей платформы успешно изменен"
    kbb = keyboard.manager.settings.ru
  }

  await bot.sendMessage(chat_id, message, {reply_markup: {resize_keyboard: true, keyboard: kbb}})

  await bot.sendMessage(chat_id, report)
}

const employeeSettings = async (bot, employee, text, lang) => {
  try {
    if (text === kb.manager.pages.uz.settings || text === kb.manager.pages.ru.settings) await ess0(bot, employee, lang)

    if (employee.step === 6 && (text === kb.main.uz || text === kb.main.ru))
      await updateEmployee({telegram_id: employee.telegram_id}, {step: 5})

    if (employee.step === 6) {
      if (text === kb.employee.settings.uz.name || text === kb.employee.settings.ru.name) await ess1(bot, employee.telegram_id, lang)

      if (text === kb.employee.settings.uz.number || text === kb.employee.settings.ru.number) await ess3(bot, employee.telegram_id, lang)

      if (text === kb.employee.settings.uz.language || text === kb.employee.settings.ru.language) await ess5(bot, employee.telegram_id, lang)
      type = text
    } else if (employee.step === 7) {
      if (text === kb.employee.settings.uz.name || text === kb.employee.settings.ru.name) await ess2(bot, employee.telegram_id, text, lang)

      if (text === kb.employee.settings.uz.number || text === kb.employee.settings.ru.number) await ess4(bot, employee.telegram_id, text, lang)

      if (text === kb.employee.settings.uz.language || text === kb.employee.settings.ru.language) await ess6(bot, employee.telegram_id, text, lang)
    }
  } catch (e) {
    console.log(e)
  }
}

module.exports = {employeeSettings}
