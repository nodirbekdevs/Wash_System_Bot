const kb = require('./../../helpers/keyboard-buttons')
const keyboard = require('./../../helpers/keyboard')
const fs = require('fs/promises')
const path = require('node:path')
const xlsx = require('xlsx')
const {getWashes, getWash, makeWash, updateWash, deleteWash, countWashes} = require('./../../controllers/washController')
const {getOwner, updateOwner} = require('./../../controllers/ownerController')
const {getBranches} = require('./../../controllers/branchController')
const {universal_keyboard} = require('./../../helpers/utils')

const ors0 = async (bot, chat_id, lang) => {
  let message, kbb

  if (lang === kb.language.uz) {
    message = "Hisobotlar sahifasi."
    kbb = keyboard.owner.reports.uz
  } else if (lang === kb.language.ru) {
    message = "Страница отчетов."
    kbb = keyboard.owner.reports.ru
  }

  await bot.sendMessage(chat_id, message, {reply_markup: {resize_keyboard: true, keyboard: kbb}})
}

const ors1 = async (bot, chat_id, lang) => {
  c
}
