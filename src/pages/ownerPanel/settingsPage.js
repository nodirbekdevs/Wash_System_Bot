const keyboard = require('./../../helpers/keyboard')
const kb = require('./../../helpers/keyboard-buttons')
const {genSalt, hash} = require('bcrypt')
const {getOwner, updateOwner} = require('../../controllers/ownerController')
const {report} = require('./../../helpers/utils')

let type

const ost0 = async (bot, owner, lang) => {
  let message, kbb

  if (lang === kb.language.uz) {
    message = 'Sozlamalar sahifasi'
    kbb = keyboard.owner.settings.uz
  } else if (lang === kb.language.ru) {
    message = 'Страница настроек'
    kbb = keyboard.owner.settings.ru
  }

  await updateOwner({telegram_id: owner.telegram_id}, {step: 6})

  const clause = report(owner, "OWNER", lang)

  await bot.sendMessage(owner.telegram_id, clause)

  await bot.sendMessage(owner.telegram_id, message, {reply_markup: {resize_keyboard: true, keyboard: kbb}})
}

const ost1 = async (bot, chat_id, lang) => {
  const message = (lang === kb.language.uz)
    ? "O'zgartirmoqchi bo'lgan ismingizni kiriting"
    : "Введите имя, которое хотите изменить"

  await updateOwner({telegram_id: chat_id}, {step: 7})

  await bot.sendMessage(chat_id, message)
}

const ost2 = async (bot, chat_id, text, lang) => {
  let clause, kbb

  await updateOwner({telegram_id: chat_id}, {name: text, step: 6})

  const owner = await getOwner({telegram_id: chat_id}), message = report(owner, 'OWNER', lang)

  if (lang === kb.language.uz) {
    clause = "Ismingiz muvaffaqiyatli o'zgartirildi"
    kbb = keyboard.owner.settings.uz
  } else if (lang === kb.language.ru) {
    clause = "Ваше имя успешно изменено"
    kbb = keyboard.owner.settings.ru
  }

  await bot.sendMessage(chat_id, message)

  await bot.sendMessage(chat_id, clause, {reply_markup: {resize_keyboard: true, keyboard: kbb, one_time_keyboard: true}})
}

const ost3 = async (bot, chat_id, lang) => {
  const message = (lang === kb.language.uz)
    ? "O'zgartirmoqchi bo'lgan raqamingizni kiriting"
    : "Введите номер, который хотите изменить"

  await updateOwner({telegram_id: chat_id}, {step: 7})

  await bot.sendMessage(chat_id, message)
}

const ost4 = async (bot, chat_id, text, lang) => {
  let clause, kbb

  const salt = await genSalt(), password = await hash(text, salt)

  await updateOwner({telegram_id: chat_id}, {password, number: text, step: 6})

  const owner = await getOwner({telegram_id: chat_id}), message = report(owner, 'OWNER', lang)

  if (lang === kb.language.uz) {
    clause = "Raqamingiz muvaffaqiyatli o'zgartirildi"
    kbb = keyboard.owner.settings.uz
  } else if (lang === kb.language.ru) {
    clause = "Ваш номер успешно изменен"
    kbb = keyboard.owner.settings.ru
  }

  await bot.sendMessage(chat_id, message)

  await bot.sendMessage(chat_id, clause, {reply_markup: {resize_keyboard: true, keyboard: kbb, one_time_keyboard: true}})
}

const ost5 = async (bot, chat_id, lang) => {
  await updateOwner({telegram_id: chat_id}, {step: 7})

  const message = (lang === kb.language.uz) ? "Qaysi tilni tanlaysiz" : "Какой язык вы выбираете"

  await bot.sendMessage(chat_id, message, {reply_markup: {resize_keyboard: true, keyboard: keyboard.language}})
}

const ost6 = async (bot, chat_id, text, lang) => {
  let message, kbb

  await updateOwner({telegram_id: chat_id}, {lang: text, step: 6})

  const owner = await getOwner({telegram_id: chat_id}), report = report(owner, 'OWNER', lang)

  if (lang === kb.language.uz) {
    message = "Platformadagi tilingiz muvaffaqiyatli o'zgartirildi"
    kbb = keyboard.owner.settings.uz
  } else if (lang === kb.language.ru) {
    message = "Язык вашей платформы успешно изменен"
    kbb = keyboard.owner.settings.ru
  }

  await bot.sendMessage(chat_id, report)

  await bot.sendMessage(chat_id, message, {reply_markup: {resize_keyboard: true, keyboard: kbb, one_time_keyboard:true}})
}

const ownerSettings = async (bot, owner, text, lang) => {
  try {
    if (text === kb.owner.pages.uz.settings || text === kb.owner.pages.ru.settings) await ost0(bot, owner, lang)
    if (owner.step === 6 && (text === kb.main.uz || text === kb.main.ru))
      await updateOwner({telegram_id: owner.telegram_id}, {step: 5})
    if (owner.step === 6) {
      if (text === kb.owner.settings.uz.name || text === kb.owner.settings.ru.name) await ost1(bot, owner.telegram_id, lang)
      if (text === kb.owner.settings.uz.number || text === kb.owner.settings.ru.number) await ost3(bot, owner.telegram_id, lang)
      if (text === kb.owner.settings.uz.language || text === kb.owner.settings.ru.language) await ost5(bot, owner.telegram_id, lang)
      type = text
    } else if (owner.step === 7) {
      if (type === kb.owner.settings.uz.name || type === kb.owner.settings.ru.name) await ost2(bot, owner.telegram_id, text, lang)
      if (type === kb.owner.settings.uz.number || type === kb.owner.settings.ru.number) await ost4(bot, owner.telegram_id, text, lang)
      if (type === kb.owner.settings.uz.language || type === kb.owner.settings.ru.language) await ost6(bot, owner.telegram_id, text, lang)
    }
  } catch (e) {
    console.log(e)
  }
}

module.exports = {ownerSettings}
