const kb = require('./../../helpers/keyboard-buttons')
const keyboard = require('./../../helpers/keyboard')
const fs = require('fs/promises')
const path = require('node:path')
const xlsx = require('xlsx')
const {getWashes, getWash, makeWash, updateWash, deleteWash, countWashes} = require('./../../controllers/washController')
const {getOwner, updateOwner} = require('./../../controllers/ownerController')
const {getBranches, updateBranch} = require('./../../controllers/branchController')
const {universal_keyboard} = require('./../../helpers/utils')

const ors0 = async (bot, chat_id, lang) => {
  let message = '', clause, kbb

  const branches = await getBranches({owner: chat_id, status: {$in: ["active", "inactive"]}})

  message = (lang === kb.language.uz) ? "Hisobotlar sahifasi." : "Страница отчетов."

  if (branches.length > 0) {

    clause = (lang === kb.language.uz) ? "Qaysi filialni hisobotini ko'rmoqchisiz" : "Какой партнерский отчет вы хотите видеть?"

    kbb = universal_keyboard(branches, lang)

    await updateOwner({telegram_id: chat_id}, {step: 14})
  } else if (branches.length <= 0) {
    if (lang === kb.language.uz) {
      clause = "Hali filiallar mavjud bo'lmaganligi sababli hisobotlarni ko'ra olmaysiz"
      kbb = keyboard.main.uz
    } else if (lang === kb.language.ru) {
      clause = "Вы не можете видеть отчеты, потому что еще нет филталов"
      kbb = keyboard.main.ru
    }
  }

  if (message !== '') {
    await bot.sendMessage(chat_id, message)
  }

  await bot.sendMessage(chat_id, clause, {reply_markup: {resize_keyboard: true, keyboard: kbb}})
}

const ors1 = async (bot, chat_id, text, lang) => {
  let message, kbb

  const branch = await getBranch({name: text})

  if (branch) {
    await updateOwner({telegram_id: chat_id}, {step: 15})

    await updateBranch({_id: branch._id}, {status: 'process'})

    if (lang === kb.language.uz) {
      message = "Qaysi vaqtdagi hisobotlarni ko'rmoqchisiz"
      kbb = keyboard.owner.reports.uz
    } else if (lang === kb.language.ru) {
      message = "В какое время вы хотите видеть отчеты?"
      kbb = keyboard.owner.reports.ru
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

const ors2 = async () => {

}
