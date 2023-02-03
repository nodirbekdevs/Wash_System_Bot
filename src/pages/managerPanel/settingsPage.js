const keyboard = require('./../../helpers/keyboard')
const kb = require('./../../helpers/keyboard-buttons')
const {getManager, updateManager} = require('../../controllers/managerController')
const {bio} = require('./../../helpers/utils')

let type

const mss0 = async (bot, manager, lang) => {
  const message = bio(manager, 'MANAGER', lang), kbb = (lang === kb.language.uz)
    ? keyboard.manager.settings.uz : keyboard.manager.settings.ru

  await updateManager({telegram_id: manager.telegram_id}, {step: 6})

  await bot.sendMessage(manager.telegram_id, message, {reply_markup: {resize_keyboard: true, keyboard: kbb}})

}

const mss1 = async (bot, chat_id, lang) => {
  const message = (lang === kb.language.uz)
    ? "O'zgartirmoqchi bo'lgan ismingizni kiriting"
    : "Введите имя, которое хотите изменить"

  await updateManager({telegram_id: chat_id}, {step: 7})

  await bot.sendMessage(chat_id, message)
}

const mss2 = async (bot, chat_id, text, lang) => {
  let clause, kbb

  await updateManager({telegram_id: chat_id}, {name: text, step: 6})

  const manager = await getManager({telegram_id: chat_id}), message = bio(manager, 'MANAGER', lang)

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

  await updateManager({telegram_id: chat_id}, {step: 7})

  await bot.sendMessage(chat_id, message)
}

const mss4 = async (bot, chat_id, text, lang) => {
  let clause, kbb

  await updateManager({telegram_id: chat_id}, {number: text, step: 6})

  const manager = await getManager({telegram_id: chat_id}), message = bio(manager, 'MANAGER', lang)

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
  await updateManager({telegram_id: chat_id}, {step: 7})

  const message = (lang === kb.language.uz) ? "Qaysi tilni tanlaysiz" : "Какой язык вы выбираете"

  await bot.sendMessage(chat_id, message, {reply_markup: {resize_keyboard: true, keyboard: keyboard.language}})
}

const mss6 = async (bot, chat_id, text, lang) => {
  let message, kbb

  await updateManager({telegram_id: chat_id}, {lang: text, step: 6})

  const manager = await getManager({telegram_id: chat_id}), report = bio(manager, 'MANAGER', lang)

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

const managerSettings = async (bot, manager, text, lang) => {
  try {
    if (text === kb.manager.pages.uz.settings || text === kb.manager.pages.ru.settings) await mss0(bot, manager, lang)

    if (manager.step === 6 && text === kb.main.uz) await updateManager({telegram_id: manager.telegram_id}, {step: 5})

    if (manager.step === 6) {
      if (text === kb.manager.settings.uz.name || text === kb.manager.settings.ru.name) await mss1(bot, manager.telegram_id, lang)

      if (text === kb.manager.settings.uz.number || text === kb.manager.settings.ru.number) await mss3(bot, manager.telegram_id, lang)

      if (text === kb.manager.settings.uz.language || text === kb.manager.settings.ru.language) await mss5(bot, manager.telegram_id, lang)
      type = text
    } else if (owner.step === 7) {
      if (text === kb.owner.settings.uz.name || text === kb.owner.settings.ru.name) await osst2(bot, owner.telegram_id, text, lang)

      if (text === kb.owner.settings.uz.number || text === kb.owner.settings.ru.number) await osst4(bot, owner.telegram_id, text, lang)

      if (text === kb.owner.settings.uz.language || text === kb.owner.settings.ru.language) await osst6(bot, owner.telegram_id, text, lang)
    }
  } catch (e) {
    console.log(e)
  }
}

module.exports = {ownerSettings}
