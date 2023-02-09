const kb = require('./../../helpers/keyboard-buttons')
const keyboard = require('./../../helpers/keyboard')
const {getCars, getCar, makeCar, updateCar, deleteCar, countCars} = require('./../../controllers/carController')
const {getOwner} = require('./../../controllers/ownerController')
const {branch_manager_keyboard} = require('./../../helpers/utils')
const {getBranches, getBranch} = require('./../../controllers/branchController')

let car_id

const ocs0 = async (bot, chat_id, lang) => {
  let message, kbb

  if (lang === kb.language.uz) {
    message = "Mashinalar sahifasi"
    kbb = keyboard.owner.cars.uz
  } else if (lang === kb.language.ru) {
    message = "Страница машин"
    kbb = keyboard.owner.cars.ru
  }

  await bot.sendMessage(chat_id, message, {reply_markup: {resize_keyboard: true, keyboard: kbb}})
}

const ocs1 = async (bot, chat_id, lang) => {
  const new_car = await makeCar({owner: chat_id})

  car_id = new_car._id

  const branches = await getBranches({owner: chat_id}), kbb = branch_manager_keyboard(branches, lang)

  const message = (lang === kb.language.uz)
    ? "Bu tarif qaysi filial uchunligini tanlang."
    : "Выберите, для какого филиала этот тариф."

  await bot.sendMessage(chat_id, message, {reply_markup: {resize_keyboard: true, keyboard: kbb}})
}

const ocs2 = async (bot, chat_id, _id, text, lang) => {
  let message, kbb

  const branch = await getBranch({owner: chat_id, name: text})

  await updateCar({_id}, {manager: branch.manager, branch: branch.name, step: 1})

  if (lang === kb.language.uz) {
    message = "Mashinani tipini kiriting"
    kbb = keyboard.options.back.uz
  } else if (lang === kb.language.ru) {
    message = "Введите тип машины"
    kbb = keyboard.options.back.ru
  }

  await bot.sendMessage(chat_id, message, {reply_markup: {resize_keyboard: true, keyboard: kbb}})
}

const ocs3 = async (bot, chat_id, _id, text, lang) => {
  let message, kbb

  await updateCar({_id}, {type: text, step: 2})

  if (lang === kb.language.uz) {
    message = `Shu ${text} haqida tavsif yozing.`
    kbb = keyboard.options.back.uz
  } else if (lang === kb.language.ru) {
    message = `Напишите описание этого ${text}.`
    kbb = keyboard.options.back.ru
  }

  await bot.sendMessage(chat_id, message, {reply_markup: {resize_keyboard: true, keyboard: kbb}})
}

const ocs4 = async (bot, chat_id, _id, text, lang) => {
  let message, kbb

  await updateCar({_id}, {description: text, step: 2})

  if (lang === kb.language.uz) {
    message = `Shu ${text} haqida tavsif yozing.`
    kbb = keyboard.options.back.uz
  } else if (lang === kb.language.ru) {
    message = `Напишите описание этого ${text}.`
    kbb = keyboard.options.back.ru
  }

  await bot.sendMessage(chat_id, message, {reply_markup: {resize_keyboard: true, keyboard: kbb}})
}
