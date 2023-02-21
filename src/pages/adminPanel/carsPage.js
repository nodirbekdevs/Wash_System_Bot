const kb = require('./../../helpers/keyboard-buttons')
const keyboard = require('./../../helpers/keyboard')
const {getCars, getCar, makeCar, updateCar, deleteCar, countCars} = require('./../../controllers/carController')
const {getAdmin} = require('./../../controllers/adminController')
const {car_pagination, date, report} = require('./../../helpers/utils')
const {amp} = require('./mainPage')

let car_id

const acs0 = async (bot, chat_id) => {
  await bot.sendMessage(chat_id, "Mashinalar bo'limi", {
    reply_markup: {resize_keyboard: true, keyboard: keyboard.admin.cars}
  })
}

const acs1 = async (bot, chat_id) => {
  const cars = await countCars({author: chat_id})

  const message = (cars > 0) ? `Hozirda siz tomoningizdan ${cars} xil mashina turi qo'shilgan` : `Hozircha mashina qo'shilmagan`

  await bot.sendMessage(chat_id, message, {reply_markup: {resize_keyboard: true, keyboard: keyboard.admin.cars}})
}

const acs2 = async (bot, chat_id) => {
  const report = await car_pagination(1, 6, {author: chat_id})

  await bot.sendMessage(chat_id, report.text, {parse_mode: 'HTML', reply_markup: {inline_keyboard: report.kbb}})
}

const acs3 = async (bot, chat_id, query_id, message_id, phrase, _id) => {
  if ((phrase.split('#')[0] === 'left' || phrase.split('#')[0] === 'right') && phrase.split('#')[1] === 'car') {
    const current_page = parseInt(phrase.split('#')[2])

    const report = await car_pagination(current_page, 6, {author: chat_id})

    await bot.editMessageText(report.text, {
      chat_id, message_id, parse_mode: 'HTML', reply_markup: {inline_keyboard: report.kbb}
    })

    await bot.answerCallbackQuery(query_id, '')
  }

  if (phrase === 'car') {
    const car = await getCar({_id}), started_at = date(car.created_at)

    const data = {name: car.name, description: car.description, type: car.type, created_at: started_at}

    const message = report(data, 'CAR', kb.language.uz)

    await bot.sendMessage(chat_id, message)

    await bot.answerCallbackQuery(query_id, '')
  }
}

const acs4 = async (bot, chat_id) => {
  const new_car = await makeCar({author: chat_id})

  car_id = new_car._id

  await bot.sendMessage(chat_id, 'Mashinani nomini kiriting', {
    reply_markup: {
      resize_keyboard: true,
      keyboard: keyboard.options.back.uz
    }
  })
}

const acs5 = async (bot, chat_id, _id, text) => {
  await updateCar({_id}, {name: text, step: 1})

  await bot.sendMessage(chat_id, 'Mashinani tavsifini kiriting', {
    reply_markup: {resize_keyboard: true, keyboard: keyboard.options.back.uz}
  })
}

const acs6 = async (bot, chat_id, _id, text) => {
  await updateCar({_id}, {description: text, step: 2})

  await bot.sendMessage(chat_id, 'Mashinani turini kiriting', {
    reply_markup: {resize_keyboard: true, keyboard: keyboard.options.back.uz}
  })
}

const acs7 = async (bot, chat_id, _id, text) => {
  await updateCar({_id}, {type: text, step: 3})

  const car = await getCar({_id}), started_at = date(car.created_at)

  const data = {name: car.name, description: car.description, type: car.type, created_at: started_at}

  let message = report(data, 'CAR', kb.language.uz)

  message += '\nTugaganini tasdiqlaysizmi?'

  await bot.sendMessage(chat_id, message, {
    reply_markup: {resize_keyboard: true, keyboard: keyboard.options.confirmation.uz}
  })
}

const acs8 = async (bot, chat_id, _id, text) => {
  let message

  if (text === kb.options.confirmation.uz) {
    await updateCar({_id}, {step: 4, status: 'active'})

    message = "Mashina muvaffaqqiyati qo'shildi"
  } else if (text === kb.options.not_to_confirmation.uz) {
    await deleteCar({_id})

    message = "Mashina qo'shilmadi"
  }

  await bot.sendMessage(chat_id, message, {reply_markup: {resize_keyboard: true, keyboard: keyboard.admin.cars}})
}

const acs9 = async (bot, chat_id, _id) => {
  await deleteCar({_id})

  await bot.sendMessage(chat_id, "Mashina qo'shilmadi", {reply_markup: {resize_keyboard: true, keyboard: keyboard.admin.cars}})
}

const adminCars = async (bot, chat_id, text) => {

  const car = await getCar({_id: car_id, author: chat_id, status: 'process'})
    ? await getCar({_id: car_id, author: chat_id, status: 'process'})
    : (await getCars({author: chat_id, status: 'process'}))[0]

  if (text === kb.admin.pages.cars) await acs0(bot, chat_id)
  if (text === kb.admin.cars.number) await acs1(bot, chat_id)
  if (text === kb.admin.cars.all) await acs2(bot, chat_id)
  if (text === kb.admin.cars.add) await acs4(bot, chat_id)

  if (car) {
    if (text === kb.options.back.uz) {
      await acs9(bot, chat_id, car._id)
    } else if (text !== kb.options.back.uz) {
      if (car.step === 0) await acs5(bot, chat_id, car._id, text)
      if (car.step === 1) await acs6(bot, chat_id, car._id, text)
      if (car.step === 2) await acs7(bot, chat_id, car._id, text)
      if (car.step === 3) await acs8(bot, chat_id, car._id, text)
    }
  }
}

module.exports = {adminCars, acs3}
