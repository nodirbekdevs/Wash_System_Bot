const keyboard = require('./../../helpers/keyboard')
const kb = require('./../../helpers/keyboard-buttons')
const {genSalt, hash} = require('bcrypt')
const {getManager, updateManager} = require('../../controllers/managerController')
const {report, parse_number} = require('./../../helpers/utils')

let type

const mss0 = async (bot, manager, lang) => {
  const message = report(manager, 'MANAGER', lang), kbb = (lang === kb.language.uz)
    ? keyboard.manager.settings.uz : keyboard.manager.settings.ru

  await updateManager({telegram_id: manager.telegram_id}, {step: 6})

  await bot.sendMessage(manager.telegram_id, message, {reply_markup: {resize_keyboard: true, keyboard: kbb}})
}

const mss1 = async (bot, chat_id, lang) => {
  let message, kbb

  if (lang === kb.language.uz) {
    message = "O'zgartirmoqchi bo'lgan ismingizni kiriting"
    kbb = keyboard.options.back.uz
  } else if (lang === kb.language.ru) {
    message = "Введите имя, которое хотите изменить"
    kbb = keyboard.options.back.ru
  }

  await updateManager({telegram_id: chat_id}, {step: 7})

  await bot.sendMessage(chat_id, message, {reply_markup: {resize_keyboard: true, keyboard: kbb}})
}

const mss2 = async (bot, chat_id, text, lang) => {
  let clause, kbb

  await updateManager({telegram_id: chat_id}, {name: text, step: 6})

  const manager = await getManager({telegram_id: chat_id}), message = report(manager, 'MANAGER', lang)

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

const mss3 = async (bot, chat_id, lang) => {
  let message, kbb

  if (lang === kb.language.uz) {
    message = "O'zgartirmoqchi bo'lgan raqamingizni kiriting"
    kbb = keyboard.options.back.uz
  } else if (lang === kb.language.ru) {
    message = "Введите номер, который хотите изменить"
    kbb = keyboard.options.back.ru
  }

  await updateManager({telegram_id: chat_id}, {step: 7})

  await bot.sendMessage(chat_id, message, {reply_markup: {resize_keyboard: true, keyboard: kbb}})
}

const mss4 = async (bot, chat_id, text, lang) => {
  let clause, kbb

  const parse = parse_number(text)

  console.log(parse)

  if (parse !== 'NaN') {
    const salt = await genSalt(), password = await hash(text, salt)

    await updateManager({telegram_id: chat_id}, {password, number: text, step: 6})

    const manager = await getManager({telegram_id: chat_id}), message = report(manager, 'MANAGER', lang)

    if (lang === kb.language.uz) {
      clause = "Raqamingiz muvaffaqiyatli o'zgartirildi"
      kbb = keyboard.owner.settings.uz
    } else if (lang === kb.language.ru) {
      clause = "Ваш номер успешно изменен"
      kbb = keyboard.owner.settings.ru
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

  await bot.sendMessage(chat_id, clause, {reply_markup: {resize_keyboard: true, keyboard: kbb, one_time_keyboard: true}})
}

const mss5 = async (bot, chat_id, lang) => {
  let message, kbb

  if (lang === kb.language.uz) {
    message = "Qaysi tilni tanlaysiz"
    kbb = keyboard.options.back.uz
  } else if (lang === kb.language.ru) {
    message = "Какой язык вы выбираете"
    kbb = keyboard.options.back.ru
  }

  await updateManager({telegram_id: chat_id}, {step: 7})

  await bot.sendMessage(chat_id, message, {reply_markup: {resize_keyboard: true, keyboard: kbb}})
}

const mss6 = async (bot, chat_id, text) => {
  let clause, kbb

  await updateManager({telegram_id: chat_id}, {lang: text, step: 6})

  const manager = await getManager({telegram_id: chat_id}), message = report(manager, 'MANAGER', manager.lang)

  if (manager.lang === kb.language.uz) {
    clause = "Platformadagi tilingiz muvaffaqiyatli o'zgartirildi"
    kbb = keyboard.manager.settings.uz
  } else if (manager.lang === kb.language.ru) {
    clause = "Язык вашей платформы успешно изменен"
    kbb = keyboard.manager.settings.ru
  }

  await bot.sendMessage(chat_id, message)

  await bot.sendMessage(chat_id, clause, {reply_markup: {resize_keyboard: true, keyboard: kbb}})
}

const managerSettings = async (bot, manager, text, lang) => {
  try {
    if (text === kb.manager.pages.uz.settings || text === kb.manager.pages.ru.settings) await mss0(bot, manager, lang)
    if (manager.step === 6 && text === kb.main.uz) await updateManager({telegram_id: manager.telegram_id}, {step: 6})
    if (manager.step === 6) {
      if (text === kb.manager.settings.uz.name || text === kb.manager.settings.ru.name) await mss1(bot, manager.telegram_id, lang)
      if (text === kb.manager.settings.uz.number || text === kb.manager.settings.ru.number) await mss3(bot, manager.telegram_id, lang)
      if (text === kb.manager.settings.uz.language || text === kb.manager.settings.ru.language) await mss5(bot, manager.telegram_id, lang)
      type = text
    } else if (manager.step === 7) {
      if (text === kb.options.back.uz || text === kb.options.back.ru) {
        await mss0(bot, manager, lang)
      } else if (text !== kb.options.back.uz || text !== kb.options.back.ru) {
        if (type === kb.manager.settings.uz.name || type === kb.manager.settings.ru.name) await mss2(bot, manager.telegram_id, text, lang)
        if (type === kb.manager.settings.uz.number || type === kb.manager.settings.ru.number) await mss4(bot, manager.telegram_id, text, lang)
        if (type === kb.manager.settings.uz.language || type === kb.manager.settings.ru.language) await mss6(bot, manager.telegram_id, text)
      }
    }
  } catch (e) {
    console.log(e)
  }
}

module.exports = {managerSettings}
