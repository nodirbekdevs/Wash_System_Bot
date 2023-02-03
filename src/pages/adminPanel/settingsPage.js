const keyboard = require('./../../helpers/keyboard')
const kb = require('./../../helpers/keyboard-buttons')
const {getAdmin, updateAdmin} = require('../../controllers/adminController')
const {bio} = require('./../../helpers/utils')

let type

const asst0 = async (bot, admin) => {
  const message = bio(admin, 'ADMIN', '')

  await updateAdmin({telegram_id: admin.telegram_id}, {step: 1})

  await bot.sendMessage(admin.telegram_id, message, {
    reply_markup: {resize_keyboard: true, keyboard: keyboard.admin.settings}
  })

}

const asst1 = async (bot, chat_id) => {
  await updateAdmin({telegram_id: chat_id}, {step: 2})
  await bot.sendMessage(chat_id, "O'zgartirmoqchi bo'lgan ismingizni kiriting")
}

const asst2 = async (bot, chat_id, text) => {
  await updateAdmin({telegram_id: chat_id}, {name: text, step: 1})

  const admin = await getAdmin({telegram_id: chat_id}), message = bio(admin, 'ADMIN', '')

  await bot.sendMessage(chat_id, "Ismingiz muvaffaqiyatli o'zgartirildi", {
    reply_markup: {resize_keyboard: true, keyboard: keyboard.admin.settings}
  })

  await bot.sendMessage(chat_id, message)
}

const asst3 = async (bot, chat_id) => {
  await updateAdmin({telegram_id: chat_id}, {step: 2})

  await bot.sendMessage(chat_id, "O'zgartirmoqchi bo'lgan raqamingizni kiriting")
}

const asst4 = async (bot, chat_id, text) => {
  await updateAdmin({telegram_id: chat_id}, {number: text, step: 1})

  const admin = await getAdmin({telegram_id: chat_id}), message = bio(admin, 'ADMIN', '')

  await bot.sendMessage(chat_id, "Raqamingiz muvaffaqiyatli o'zgartirildi", {
    reply_markup: {resize_keyboard: true, keyboard: keyboard.admin.settings}
  })

  await bot.sendMessage(chat_id, message)
}

const adminSettings = async (bot, admin, text) => {
  try {
    if (text === kb.admin.pages.settings) await asst0(bot, admin)

    if (admin.step === 1 && text === kb.main.uz) await updateAdmin({telegram_id: admin.telegram_id}, {step: 0})

    if (admin.step === 1) {
      if (text === kb.admin.settings.name) await asst1(bot, admin.telegram_id)

      if (text === kb.admin.settings.number) await asst3(bot, admin.telegram_id)
      type = text
    } else if (admin.step === 2) {
      if (type === kb.admin.settings.name) await asst2(bot, admin.telegram_id, text)

      if (type === kb.admin.settings.number) await asst4(bot, admin.telegram_id, text)
    }
  } catch (e) {
    console.log(e)
  }
}

module.exports = {adminSettings}
