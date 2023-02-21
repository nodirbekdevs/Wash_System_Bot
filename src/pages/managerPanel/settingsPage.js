const keyboard = require('./../../helpers/keyboard')
const kb = require('./../../helpers/keyboard-buttons')
const {genSalt, hash} = require('bcrypt')
const {getManager, updateManager} = require('../../controllers/managerController')
const {report} = require('./../../helpers/utils')

let type

const mss0 = async (bot, manager, lang) => {
  const message = report(manager, 'MANAGER', lang), kbb = (lang === kb.language.uz)
    ? keyboard.manager.settings.uz : keyboard.manager.settings.ru

  await updateManager({telegram_id: manager.telegram_id}, {step: 7})

  await bot.sendMessage(manager.telegram_id, message, {reply_markup: {resize_keyboard: true, keyboard: kbb}})
}

const mss1 = async (bot, chat_id, lang) => {
  const message = (lang === kb.language.uz)
    ? "O'zgartirmoqchi bo'lgan ismingizni kiriting"
    : "Введите имя, которое хотите изменить"

  await updateManager({telegram_id: chat_id}, {step: 8})

  await bot.sendMessage(chat_id, message)
}

const mss2 = async (bot, chat_id, text, lang) => {
  let clause, kbb

  const manager = await getManager({telegram_id: chat_id})

  const username = `${text}_MAN_${manager.number}`, salt = await genSalt(), password = await hash(username, salt)

  manager.name = text
  manager.username = username
  manager.password = password
  manager.step = 7
  await manager.save()

  const message = report(manager, 'MANAGER', lang)

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

const mss3 = async (bot, chat_id, lang) => {
  const message = (lang === kb.language.uz)
    ? "O'zgartirmoqchi bo'lgan raqamingizni kiriting"
    : "Введите номер, который хотите изменить"

  await updateManager({telegram_id: chat_id}, {step: 8})

  await bot.sendMessage(chat_id, message)
}

const mss4 = async (bot, chat_id, text, lang) => {
  let clause, kbb

  const manager = await getManager({telegram_id: chat_id})

  const username = `${manager.name}_MAN_${text}`, salt = await genSalt(), password = await hash(username, salt)

  manager.number = text
  manager.username = username
  manager.password = password
  manager.step = 7
  await manager.save()

  const message = report(manager, 'MANAGER', lang)

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

const mss5 = async (bot, chat_id, lang) => {
  await updateManager({telegram_id: chat_id}, {step: 8})

  const message = (lang === kb.language.uz) ? "Qaysi tilni tanlaysiz" : "Какой язык вы выбираете"

  await bot.sendMessage(chat_id, message, {reply_markup: {resize_keyboard: true, keyboard: keyboard.language}})
}

const mss6 = async (bot, chat_id, text, lang) => {
  let message, kbb

  await updateManager({telegram_id: chat_id}, {lang: text, step: 7})

  const manager = await getManager({telegram_id: chat_id}), bio = report(manager, 'MANAGER', lang)

  if (lang === kb.language.uz) {
    message = "Platformadagi tilingiz muvaffaqiyatli o'zgartirildi"
    kbb = keyboard.manager.settings.uz
  } else if (lang === kb.language.ru) {
    message = "Язык вашей платформы успешно изменен"
    kbb = keyboard.manager.settings.ru
  }

  await bot.sendMessage(chat_id, message, {reply_markup: {resize_keyboard: true, keyboard: kbb}})

  await bot.sendMessage(chat_id, bio)
}

const managerSettings = async (bot, manager, text, lang) => {
  try {
    if (text === kb.manager.pages.uz.settings || text === kb.manager.pages.ru.settings) await mss0(bot, manager, lang)
    if (manager.step === 6 && text === kb.main.uz) await updateManager({telegram_id: manager.telegram_id}, {step: 6})
    if (manager.step === 7) {
      if (text === kb.manager.settings.uz.name || text === kb.manager.settings.ru.name) await mss1(bot, manager.telegram_id, lang)
      if (text === kb.manager.settings.uz.number || text === kb.manager.settings.ru.number) await mss3(bot, manager.telegram_id, lang)
      if (text === kb.manager.settings.uz.language || text === kb.manager.settings.ru.language) await mss5(bot, manager.telegram_id, lang)
      type = text
    } else if (manager.step === 8) {
      if (type === kb.manager.settings.uz.name || type === kb.manager.settings.ru.name) await mss2(bot, manager.telegram_id, text, lang)
      if (type === kb.manager.settings.uz.number || type === kb.manager.settings.ru.number) await mss4(bot, manager.telegram_id, text, lang)
      if (type === kb.manager.settings.uz.language || type === kb.manager.settings.ru.language) await mss6(bot, manager.telegram_id, text, lang)
    }
  } catch (e) {
    console.log(e)
  }
}

module.exports = {managerSettings}
