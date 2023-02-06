const kb = require('./../../helpers/keyboard-buttons')
const keyboard = require('./../../helpers/keyboard')
const {getCars, getCar, makeCar, updateCar, deleteCar, countCars} = require('./../../controllers/carController')
const {getManager} = require('./../../controllers/managerController')
const {getOwner} = require('./../../controllers/ownerController')
const {date, bio, car_pagination} = require('./../../helpers/utils')

const mcs0 = async (bot, chat_id, lang) => {
  let message, kbb

  if (lang === kb.language.uz) {
    message = "Mashinalar sahifasi"
    kbb = keyboard.manager.cars.uz
  } else if (lang === kb.language.ru) {
    message = "Страница автомобилей"
    kbb = keyboard.manager.cars.ru
  }

  await bot.sendMessage(chat_id, message, {reply_markup: {resize_keyboard: true, keyboard: kbb}})
}

const mcs1 = async (bot, chat_id, lang) => {
  const manager = await getManager({telegram_id: chat_id}),
    cars = await getCars({owner: manager.owner, branch: manager.branch, status: 'active'})

  const report = car_pagination(1, 10, cars, lang)

  await bot.sendMessage(chat_id, report.text, {parse_mode: 'HTML', reply_markup: {inline_keyboard: report.kbb}})
}

const mcs2 = async (bot, chat_id, query_id, message_id, data, _id, lang) => {
  let message

  const manager = await getManager({telegram_id: chat_id}), btn = data.split('#'),
    cars = await getCars({owner: manager.owner, branch: manager.branch, status: 'active'})

  if ((btn[0] === 'left' || btn[0] === 'right') && btn[1] === 'car') {
    const current_page = parseInt(btn[2])

    const report = await car_pagination(current_page, 10, cars, lang)

    await bot.editMessageText(report.text, {
      chat_id, message_id, parse_mode: 'HTML', reply_markup: {inline_keyboard: report.kbb}
    })

    await bot.answerCallbackQuery(query_id, '')
  }

  if (data === 'car') {
    const car = await getCar({_id}), owner = await getOwner({telegram_id: car.owner}),
      manager = await getManager({telegram_id: car.manager})

    const started_at = date(car.created_at)

    const data = {
      owner: owner.name,
      manager: manager.name,
      branch: car.branch,
      type: car.type,
      description: car.description,
      cars: car.cars,
      cash: car.cash,
      price: car.price,
      total_washes: car.total_washes,
      created_at: started_at
    }

    message = bio(data, 'CAR', lang)

    await bot.sendMessage(chat_id, message)

    await bot.answerCallbackQuery(query_id, '')
  }
}

const managerCars = async (bot, chat_id, text, lang) => {
  if (text === kb.manager.pages.uz.washes || text === kb.manager.pages.ru.washes) await mcs0(bot, chat_id, lang)
  if (text === kb.manager.cars.uz.all || text === kb.manager.cars.ru.all) await mcs1(bot, chat_id, lang)
}

module.exports = {managerCars, mcs2}
