const keyboard = require('./../../helpers/keyboard')
const kb = require('./../../helpers/keyboard-buttons')
const {getOwner, updateOwner} = require('../../controllers/ownerController')
const {bio} = require('./../../helpers/utils')

let type

const osst0 = async (bot, owner, lang) => {
  const message = bio(owner, 'OWNER', lang), kbb = (lang === kb.language.uz)
    ? keyboard.owner.settings.uz : keyboard.owner.settings.ru

  await updateOwner({telegram_id: owner.telegram_id}, {step: 6})

  await bot.sendMessage(owner.telegram_id, message, {reply_markup: {resize_keyboard: true, keyboard: kbb}})

}

const osst1 = async (bot, chat_id, lang) => {
  const message = (lang === kb.language.uz)
    ? "O'zgartirmoqchi bo'lgan ismingizni kiriting"
    : "Введите имя, которое хотите изменить"

  await updateOwner({telegram_id: chat_id}, {step: 7})

  await bot.sendMessage(chat_id, message)
}

const osst2 = async (bot, chat_id, text, lang) => {
  let clause, kbb

  await updateOwner({telegram_id: chat_id}, {name: text, step: 6})

  const owner = await getOwner({telegram_id: chat_id}), message = bio(owner, 'OWNER', lang)

  if (lang === kb.language.uz) {
    clause = "Ismingiz muvaffaqiyatli o'zgartirildi"
    kbb = keyboard.owner.settings.uz
  } else if (lang === kb.language.ru) {
    clause = "Ваше имя успешно изменено"
    kbb = keyboard.owner.settings.ru
  }

  await bot.sendMessage(chat_id, clause, {reply_markup: {resize_keyboard: true, keyboard: kbb}})

  await bot.sendMessage(chat_id, message)
}

const osst3 = async (bot, chat_id, lang) => {
  const message = (lang === kb.language.uz)
    ? "O'zgartirmoqchi bo'lgan raqamingizni kiriting"
    : "Введите номер, который хотите изменить"

  await updateOwner({telegram_id: chat_id}, {step: 7})

  await bot.sendMessage(chat_id, message)
}

const osst4 = async (bot, chat_id, text, lang) => {
  let clause, kbb

  await updateOwner({telegram_id: chat_id}, {number: text, step: 6})

  const owner = await getOwner({telegram_id: chat_id}), message = bio(owner, 'OWNER', lang)

  if (lang === kb.language.uz) {
    clause = "Raqamingiz muvaffaqiyatli o'zgartirildi"
    kbb = keyboard.owner.settings.uz
  } else if (lang === kb.language.ru) {
    clause = "Ваш номер успешно изменен"
    kbb = keyboard.owner.settings.ru
  }

  await bot.sendMessage(chat_id, clause, {reply_markup: {resize_keyboard: true, keyboard: kbb}})

  await bot.sendMessage(chat_id, message)
}

const osst5 = async (bot, chat_id, lang) => {
  await updateOwner({telegram_id: chat_id}, {step: 7})

  const message = (lang === kb.language.uz) ? "Qaysi tilni tanlaysiz" : "Какой язык вы выбираете"

  await bot.sendMessage(chat_id, message, {reply_markup: {resize_keyboard: true, keyboard: keyboard.language}})
}

const osst6 = async (bot, chat_id, text, lang) => {
  let message, kbb

  await updateOwner({telegram_id: chat_id}, {lang: text, step: 6})

  const owner = await getOwner({telegram_id: chat_id}), report = bio(owner, 'OWNER', lang)

  if (lang === kb.language.uz) {
    message = "Platformadagi tilingiz muvaffaqiyatli o'zgartirildi"
    kbb = keyboard.owner.settings.uz
  } else if (lang === kb.language.ru) {
    message = "Язык вашей платформы успешно изменен"
    kbb = keyboard.owner.settings.ru
  }

  await bot.sendMessage(chat_id, message, {reply_markup: {resize_keyboard: true, keyboard: kbb}})

  await bot.sendMessage(chat_id, report)
}

const ownerSettings = async (bot, owner, text, lang) => {
  try {
    if (text === kb.admin.pages.settings) await osst0(bot, owner, lang)

    if (owner.step === 6 && text === kb.main.uz) await updateOwner({telegram_id: owner.telegram_id}, {step: 5})

    if (owner.step === 6) {
      if (text === kb.owner.settings.uz.name || text === kb.owner.settings.ru.name) await osst1(bot, owner.telegram_id, lang)

      if (text === kb.owner.settings.uz.number || text === kb.owner.settings.ru.number) await osst3(bot, owner.telegram_id, lang)

      if (text === kb.owner.settings.uz.language || text === kb.owner.settings.ru.language) await osst5(bot, owner.telegram_id, lang)
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
