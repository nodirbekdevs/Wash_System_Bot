const kb = require('./../../helpers/keyboard-buttons')
const keyboard = require('./../../helpers/keyboard')
const {getFees, getFee, makeFee, updateFee, deleteFee, countFees} = require('./../../controllers/feeController')
const {getOwner, updateOwner} = require('./../../controllers/ownerController')
const {getManager} = require('./../../controllers/managerController')
const {getCars, getCar, updateCar} = require('./../../controllers/carController')
const {universal_keyboard, car_attendance, report, date} = require('./../../helpers/utils')
const {getBranches, getBranch} = require('./../../controllers/branchController')

let type, fee_id

const ofs0 = async (bot, chat_id, lang) => {
  let message, kbb

  if (lang === kb.language.uz) {
    message = "Tariflar sahifasi"
    kbb = keyboard.owner.fees.uz
  } else if (lang === kb.language.ru) {
    message = "Страница тарифов"
    kbb = keyboard.owner.fees.ru
  }

  await bot.sendMessage(chat_id, message, {reply_markup: {resize_keyboard: true, keyboard: kbb}})
}

const ofs1 = async (bot, chat_id, lang) => {
  let kbb, message

  const query = {owner: chat_id, status: 'active'}, fees = await getFees(query), count = countFees(query)

  if (fees.length > 0) {
    await updateOwner({telegram_id: chat_id}, {step: 10})
    kbb = universal_keyboard(fees, lang)
    message = (lang === kb.language.uz) ? `Sizda ${count} tarif mavjud` : `У вас есть ${count} тарифов`
  } else {
    message = (lang === kb.language.uz) ? `Sizda hali tariflar mavjud emas` : `У вас еще нет тарифов`
  }

  await bot.sendMessage(chat_id, message, {reply_markup: {resize_keyboard: true, keyboard: kbb}})
}

const ofs2 = async (bot, chat_id, text, lang) => {
  let message, kbb

  const fee = await getFee({name: text})

  if (fee) {
    await updateOwner({telegram_id: chat_id}, {step: 11})

    await updateFee({_id: fee._id}, {step: 8, status: 'process'})

    const data = {
      name: fee.name,
      description: fee.description,
      cars: fee.cars,
      cash: fee.cash,
      price: fee.price,
    }

    message = report(data, 'FEE_SETTINGS', lang)

    kbb = (lang === kb.language.uz) ? keyboard.options.owner.fee.settings.uz : keyboard.options.owner.fee.settings.ru
  } else {
    if (lang === kb.language.uz) {
      message = "Bunday tarif topilmadi"
      kbb = keyboard.owner.fees.uz
    } else if (lang === kb.language.ru) {
      message = "Такой тариф не найдено"
      kbb = keyboard.owner.fees.ru
    }
  }

  if (fee.image !== '') {
    await bot.sendPhoto(chat_id, fee.image, {caption: message, reply_markup: {resize_keyboard: true, keyboard: kbb}})
  } else {
    await bot.sendMessage(chat_id, message, {reply_markup: {resize_keyboard: true, keyboard: kbb}})
  }
}

const ofs3 = async (bot, chat_id, _id, lang) => {
  const message = (lang === kb.language.uz)
    ? "O'zgartirmoqchi bo'lgan nomni yozing"
    : "Введите название, которое хотите изменить"

  await updateFee({_id}, {step: 9})

  await bot.sendMessage(chat_id, message)
}

const ofs4 = async (bot, chat_id, _id, text, lang) => {
  let clause, kbb

  await updateFee({_id}, {name: text, step: 8})

  const fee = await getFee({_id})

  const data = {
    name: fee.name,
    description: fee.description,
    cars: fee.cars,
    cash: fee.cash,
    price: fee.price,
  }

  const message = report(data, 'FEE_SETTINGS', lang)

  if (lang === kb.language.uz) {
    clause = "Tarif nomi muvaffaqiyatli o'zgartirildi"
    kbb = keyboard.options.owner.fee.settings.uz
  } else if (lang === kb.language.ru) {
    clause = "Название тарифа успешно изменено"
    kbb = keyboard.options.owner.fee.settings.ru
  }

  await bot.sendMessage(chat_id, clause, {reply_markup: {resize_keyboard: true, keyboard: kbb}})

  if (fee.image !== '') {
    await bot.sendPhoto(chat_id, fee.image, {caption: message})
  } else {
    await bot.sendMessage(chat_id, message)
  }
}

const ofs5 = async (bot, chat_id, _id, lang) => {
  const message = (lang === kb.language.uz)
    ? "O'zgartirmoqchi bo'lgan tavsifni yozing"
    : "Введите описание, которое хотите изменить"

  await updateFee({_id}, {step: 9})

  await bot.sendMessage(chat_id, message)
}

const ofs6 = async (bot, chat_id, _id, text, lang) => {
  let clause, kbb

  await updateFee({_id}, {description: text, step: 8})

  const fee = await getFee({_id})

  const data = {
    name: fee.name,
    description: fee.description,
    cars: fee.cars,
    cash: fee.cash,
    price: fee.price,
  }

  const message = report(data, 'FEE_SETTINGS', lang)

  if (lang === kb.language.uz) {
    clause = "Tarif tavsifi muvaffaqiyatli o'zgartirildi"
    kbb = keyboard.options.owner.fee.settings.uz
  } else if (lang === kb.language.ru) {
    clause = "Описание тарифа успешно изменено"
    kbb = keyboard.options.owner.fee.settings.ru
  }

  await bot.sendMessage(chat_id, clause, {reply_markup: {resize_keyboard: true, keyboard: kbb}})

  if (fee.image !== '') {
    await bot.sendPhoto(chat_id, fee.image, {caption: message})
  } else {
    await bot.sendMessage(chat_id, message)
  }
}

const ofs7 = async (bot, chat_id, _id, lang) => {
  const message = (lang === kb.language.uz)
    ? "O'zgartirmoqchi bo'lgan rasmni jo'nating"
    : "Отправьте изображение, которое хотите изменить"

  await updateFee({_id}, {step: 9})

  await bot.sendMessage(chat_id, message)
}

const ofs8 = async (bot, chat_id, _id, text, lang) => {
  let clause, kbb

  await updateFee({_id}, {image: text, step: 8})

  const fee = await getFee({_id})

  const data = {
    name: fee.name,
    description: fee.description,
    cars: fee.cars,
    cash: fee.cash,
    price: fee.price,
  }

  const message = report(data, 'FEE_SETTINGS', lang)

  if (lang === kb.language.uz) {
    clause = "Tarif rasmi muvaffaqiyatli o'zgartirildi"
    kbb = keyboard.options.owner.fee.settings.uz
  } else if (lang === kb.language.ru) {
    clause = "Изображение тарифа успешно изменено"
    kbb = keyboard.options.owner.fee.settings.ru
  }

  await bot.sendMessage(chat_id, clause, {reply_markup: {resize_keyboard: true, keyboard: kbb}})

  if (fee.image !== '') {
    await bot.sendPhoto(chat_id, fee.image, {caption: message})
  } else {
    await bot.sendMessage(chat_id, message)
  }
}

const ofs9 = async (bot, chat_id, _id, lang) => {
  const message = (lang === kb.language.uz)
    ? "O'zgartirmoqchi bo'lgan tarif kassa narxini yozing"
    : "Введите расчетную цену тарифа, которую вы хотите изменить"

  await updateFee({_id}, {step: 9})

  await bot.sendMessage(chat_id, message)
}

const ofs10 = async (bot, chat_id, _id, text, lang) => {
  let clause, kbb

  await updateFee({_id}, {cash: parseInt(text), step: 8})

  const fee = await getFee({_id})

  const data = {
    name: fee.name,
    description: fee.description,
    cars: fee.cars,
    cash: fee.cash,
    price: fee.price,
  }

  const message = report(data, 'FEE_SETTINGS', lang)

  if (lang === kb.language.uz) {
    clause = "Tarif kassa narxi muvaffaqiyatli o'zgartirildi"
    kbb = keyboard.options.owner.fee.settings.uz
  } else if (lang === kb.language.ru) {
    clause = "Расчетная цена тарифа успешно изменено"
    kbb = keyboard.options.owner.fee.settings.ru
  }

  await bot.sendMessage(chat_id, clause, {reply_markup: {resize_keyboard: true, keyboard: kbb}})

  if (fee.image !== '') {
    await bot.sendPhoto(chat_id, fee.image, {caption: message})
  } else {
    await bot.sendMessage(chat_id, message)
  }
}

const ofs11 = async (bot, chat_id, _id, lang) => {
  const message = (lang === kb.language.uz)
    ? "O'zgartirmoqchi bo'lgan tarif narxini yozing"
    : "Введите цену тарифа, которую вы хотите изменить"

  await updateFee({_id}, {step: 9})

  await bot.sendMessage(chat_id, message)
}

const ofs12 = async (bot, chat_id, _id, text, lang) => {
  let clause, kbb

  await updateFee({_id}, {price: parseInt(text), step: 8})

  const fee = await getFee({_id})

  const data = {
    name: fee.name,
    description: fee.description,
    cars: fee.cars,
    cash: fee.cash,
    price: fee.price,
  }

  const message = report(data, 'FEE_SETTINGS', lang)

  if (lang === kb.language.uz) {
    clause = "Tarif narxi muvaffaqiyatli o'zgartirildi"
    kbb = keyboard.options.owner.fee.settings.uz
  } else if (lang === kb.language.ru) {
    clause = "Цена тарифа успешно изменено"
    kbb = keyboard.options.owner.fee.settings.ru
  }

  await bot.sendMessage(chat_id, clause, {reply_markup: {resize_keyboard: true, keyboard: kbb}})

  if (fee.image !== '') {
    await bot.sendPhoto(chat_id, fee.image, {caption: message})
  } else {
    await bot.sendMessage(chat_id, message)
  }
}

const ofs13 = async (bot, chat_id, _id, lang) => {
  await updateFee({_id}, {step: 9})

  const fee = await getFee({_id})

  const cars = await getCars({status: 'active'}), report = car_attendance(cars, fee.cars, lang, 'edit'),
    message = (lang === kb.language.uz) ? `Tarif uchun mashinalarni tanlang.` : `Выберите автомобили для тарифа.`

  await bot.sendMessage(chat_id, message)

  await bot.sendMessage(chat_id, report.text, {parse_mode: 'HTML', reply_markup: {inline_keyboard: report.kbb}})
}

const ofs14 = async (bot, chat_id, query_id, message_id, phrase, _id, lang) => {
  const fee = await getFee({owner: chat_id, step: 9, status: 'process'})

  if (phrase === 'e_car') {
    const car = await getCar({_id})

    const index = fee.cars.indexOf(car.name)

    if (index > -1) {
      fee.cars.splice(car.name)
    } else if (index < -1) {
      fee.cars.push(car.name)
    }

    await fee.save()

    const cars = await getCars({status: 'active'}), report = await car_attendance(cars, fee.cars, lang, 'edit')

    await bot.editMessageText(report.text, {
      chat_id, message_id, parse_mode: 'HTML', reply_markup: {inline_keyboard: report.kbb}
    })
  }

  if (phrase === 'e_e') {
    let clause, kbb

    await updateFee({_id: fee._id}, {step: 8})

    const data = {
      name: fee.name,
      description: fee.description,
      cars: fee.cars,
      cash: fee.cash,
      price: fee.price,
    }

    const message = report(data, 'FEE_SETTINGS', lang)

    if (lang === kb.language.uz) {
      clause = "Tarif mashinalari o'zgartirildi"
      kbb = keyboard.options.owner.fee.settings.uz
    } else if (lang === kb.language.ru) {
      clause = "Цена тарифа успешно изменено"
      kbb = keyboard.options.owner.fee.settings.ru
    }

    await bot.sendMessage(chat_id, clause, {reply_markup: {resize_keyboard: true, keyboard: kbb}})

    if (fee.image !== '') {
      await bot.sendPhoto(chat_id, fee.image, {caption: message})
    } else {
      await bot.sendMessage(chat_id, message)
    }
  }
}

const ofs15 = async (bot, chat_id, _id) => {
  await updateOwner({telegram_id: chat_id}, {step: 10})

  await updateFee({_id, owner: chat_id, step: 8, status: 'process'}, {step: 7, status: 'active'})
}

const ofs16 = async (bot, chat_id, lang) => {
  const new_fee = await makeFee({owner: chat_id})

  fee_id = new_fee._id

  const branches = await getBranches({owner: chat_id}), kbb = universal_keyboard(branches, lang)

  const message = (lang === kb.language.uz)
    ? "Bu tarif qaysi filial uchunligini tanlang."
    : "Выберите, для какого филиала этот тариф."

  await bot.sendMessage(chat_id, message, {reply_markup: {resize_keyboard: true, keyboard: kbb}})
}

const ofs17 = async (bot, chat_id, _id, text, lang) => {
  let message, kbb

  const branch = await getBranch({owner: chat_id, name: text})

  await updateFee({_id}, {manager: branch.manager, branch: branch.name, step: 1})

  if (lang === kb.language.uz) {
    message = "Tarifni nomini kiriting"
    kbb = keyboard.options.back.uz
  } else if (lang === kb.language.ru) {
    message = "Введите название тарифа"
    kbb = keyboard.options.back.ru
  }

  await bot.sendMessage(chat_id, message, {reply_markup: {resize_keyboard: true, keyboard: kbb}})
}

const ofs18 = async (bot, chat_id, _id, text, lang) => {
  let message, kbb

  await updateFee({_id}, {name: text, step: 2})

  if (lang === kb.language.uz) {
    message = `Shu ${text} haqida tavsif yozing.`
    kbb = keyboard.options.back.uz
  } else if (lang === kb.language.ru) {
    message = `Напишите описание этого ${text}.`
    kbb = keyboard.options.back.ru
  }

  await bot.sendMessage(chat_id, message, {reply_markup: {resize_keyboard: true, keyboard: kbb}})
}

const ofs19 = async (bot, chat_id, _id, text, lang) => {
  await updateFee({_id}, {description: text, step: 3})

  const fee = await getFee({_id})

  const cars = await getCars({status: 'active'}), report = car_attendance(cars, fee.cars, lang, 'select'),
    message = (lang === kb.language.uz) ? `Tarif uchun mashinalarni tanlang.` : `Выберите автомобили для тарифа.`

  await bot.sendMessage(chat_id, message)

  await bot.sendMessage(chat_id, report.text, {parse_mode: 'HTML', reply_markup: {inline_keyboard: report.kbb}})
}

const ofs20 = async (bot, chat_id, query_id, message_id, phrase, _id, lang) => {
  const fee = await getFee({owner: chat_id, status: 'process'})

  if (phrase === 's_car') {
    const car = await getCar({_id})

    const index = fee.cars.indexOf(car.name)

    if (index > -1) {
      fee.cars.splice(car.name)
    } else if (index < -1) {
      fee.cars.push(car.name)
    }

    await fee.save()

    const cars = await getCars({status: 'active'}), report = await car_attendance(cars, fee.cars, lang, 'select')

    await bot.editMessageText(report.text, {
      chat_id, message_id, parse_mode: 'HTML', reply_markup: {inline_keyboard: report.kbb}
    })
  }

  if (phrase === 's_e') {
    let message, kbb

    await updateFee({_id: fee._id}, {step: 4})

    if (lang === kb.language.uz) {
      message = 'Tarif kassa narxini kiriting'
      kbb = keyboard.options.back.uz
    } else if (lang === kb.language.ru) {
      message = 'Введите расчетную цену тарифа'
      kbb = keyboard.options.back.ru
    }

    await bot.editMessageText(message, {chat_id, message_id, reply_markup: {resize_keyboard: true, keyboard: kbb}})
  }
}

const ofs21 = async (bot, chat_id, _id, text, lang) => {
  let message, kbb

  await updateFee({_id}, {cash: parseInt(text), step: 5})

  if (lang === kb.language.uz) {
    message = 'Tarif narxini kiriting'
    kbb = keyboard.options.back.uz
  } else if (lang === kb.language.ru) {
    message = 'Введите цену тарифа'
    kbb = keyboard.options.back.ru
  }

  await bot.sendMessage(chat_id, message, {reply_markup: {resize_keyboard: true, keyboard: kbb}})
}

const ofs22 = async (bot, chat_id, _id, text, lang) => {
  let message, kbb

  await updateFee({_id}, {price: parseInt(text), step: 6})

  const fee = await getFee({_id}), manager = await getManager({telegram_id: fee.manager, owner: chat_id}),
    owner = await getOwner({telegram_id: chat_id}), started_at = date(fee.created_at)

  const data = {
    owner: owner.name,
    manager: manager.name,
    branch: fee.branch,
    name: fee.name,
    description: fee.description,
    cars: fee.cars,
    cash: fee.cash,
    price: fee.price,
    created_at: started_at
  }

  message = report(data, 'FEE', lang)

  if (lang === kb.language.uz) {
    message += '\nTasdiqlaysizmi'
    kbb = keyboard.options.confirmation.uz
  } else if (lang === kb.language.ru) {
    message = '\n Вы можете подтвердить?'
    kbb = keyboard.options.confirmation.ru
  }

  await bot.sendMessage(chat_id, message, {reply_markup: {resize_keyboard: true, keyboard: kbb}})
}

const ofs23 = async (bot, chat_id, _id, text, lang) => {
  let message

  const kbb = (lang === kb.language.uz) ? keyboard.owner.fees.uz : keyboard.owner.fees.ru

  if (text === kb.options.confirmation.uz || text === kb.options.confirmation.ru) {
    await updateFee({_id}, {status: 'active', step: 7})

    const fee = await getFee({_id}), branch = await getBranch({manager: fee.manager, name: fee.branch})

    if (branch) {
      branch.total_fees += 1
      await branch.save()
    }

    for (let i = 0; i < fee.cars.length; i++) {
      await updateCar({name: fee.cars[i], status: 'active'}, {$inc: {total_fees: 1}})
    }

    message = (lang === kb.language.uz) ? "Yangi tarif qo'shildi." : "Добавлен новый тариф."
  } else if (text === kb.options.not_to_confirmation.uz || text === kb.options.not_to_confirmation.ru) {
    await deleteFee({_id})

    message = (lang === kb.language.uz) ? "Yangi tarif qo'shilmadi." : "Новый тариф не добавлен."
  }

  await bot.sendMessage(chat_id, message, {reply_markup: {resize_keyboard: true, keyboard: kbb}})
}

const ofs24 = async (bot, chat_id, _id, lang) => {
  await deleteFee({_id})

  const message = (lang === kb.language.uz) ? "Yangi tarif qo'shilmadi." : "Новый тариф не добавлен.",
    kbb = (lang === kb.language.uz) ? keyboard.owner.fees.uz : keyboard.owner.fees.ru

  await bot.sendMessage(chat_id, message, {reply_markup: {resize_keyboard: true, keyboard: kbb}})
}

const ownerFee = async (bot, chat_id, text, lang) => {
  const owner = await getOwner({telegram_id: chat_id})

  const fee = await getFee({_id: fee_id, owner: owner.telegram_id, status: 'process'})
    ? await getFee({_id: fee_id, owner: owner.telegram_id, status: 'process'})
    : (await getFees({owner: owner.telegram_id, status: 'process'}))[0]

  try {
    if (text === kb.owner.pages.uz.fees || text === kb.owner.pages.ru.fees) await ofs0(bot, chat_id, lang)
    else if (text === kb.owner.fees.uz.all || text === kb.owner.fees.ru.all) await ofs1(bot, chat_id, lang)
    else if (text === kb.owner.fees.uz.add || text === kb.owner.fees.ru.add) await ofs16(bot, chat_id, lang)
    else if (text === kb.main.uz || text === kb.main.ru) await updateOwner({telegram_id: chat_id}, {step: 5})

    if (fee) {
      if (text === kb.options.back.uz) {
        await ofs24(bot, chat_id, fee._id, lang)
      } else if (text !== kb.options.back.uz) {
        if (fee.step === 0) await ofs17(bot, chat_id, fee._id, text, lang)
        if (fee.step === 1) await ofs18(bot, chat_id, fee._id, text, lang)
        if (fee.step === 2) await ofs19(bot, chat_id, fee._id, text, lang)
        if (fee.step === 4) await ofs21(bot, chat_id, fee._id, text, lang)
        if (fee.step === 5) await ofs22(bot, chat_id, fee._id, text, lang)
        if (fee.step === 6) await ofs23(bot, chat_id, fee._id, text, lang)
      }
    }

    if (owner) {
      if (owner.step === 10) {
        await ofs2(bot, chat_id, text, lang)
      }

      if (owner.step === 11) {
        const fee = await getFee({owner: owner.telegram_id, step: 8, status: 'process'})

        if (text === kb.options.back.uz || text === kb.options.back.ru) {
          await ofs15(bot, chat_id, fee._id)
        } else if (text !== kb.options.back.uz || text !== kb.options.back.ru) {
          if (fee.step === 8) {
            if (text === kb.options.owner.fee.settings.uz.name || text === kb.options.owner.branch.settings.ru.name)
              await ofs3(bot, chat_id, fee._id, lang)
            if (text === kb.options.owner.fee.settings.uz.description || text === kb.options.owner.fee.settings.ru.description)
              await ofs5(bot, chat_id, fee._id, lang)
            if (text === kb.options.owner.fee.settings.uz.image || text === kb.options.owner.fee.settings.ru.image)
              await ofs7(bot, chat_id, fee._id, lang)
            if (text === kb.options.owner.fee.settings.uz.cash || text === kb.options.owner.fee.settings.ru.cash)
              await ofs9(bot, chat_id, fee._id, lang)
            if (text === kb.options.owner.fee.settings.uz.price || text === kb.options.owner.fee.settings.ru.price)
              await ofs11(bot, chat_id, fee._id, lang)
            if (text === kb.options.owner.fee.settings.uz.car || text === kb.options.owner.fee.settings.ru.cash)
              await ofs13(bot, chat_id, fee._id, lang)

            type = text
          } else if (fee.step === 7) {
            if (type === kb.options.owner.fee.settings.uz.name || type === kb.options.owner.fee.settings.ru.name)
              await ofs4(bot, chat_id, fee._id, text, lang)
            if (type === kb.options.owner.fee.settings.uz.description || type === kb.options.owner.fee.settings.ru.description)
              await ofs6(bot, chat_id, fee._id, text, lang)
            if (type === kb.options.owner.fee.settings.uz.image || type === kb.options.owner.fee.settings.ru.image)
              await ofs8(bot, chat_id, fee._id, text, lang)
            if (type === kb.options.owner.fee.settings.uz.cash || type === kb.options.owner.fee.settings.ru.cash)
              await ofs10(bot, chat_id, fee._id, text, lang)
            if (type === kb.options.owner.fee.settings.uz.price || type === kb.options.owner.fee.settings.ru.price)
              await ofs12(bot, chat_id, fee._id, text, lang)
          }
        }
      }
    }

  } catch (e) {
    console.log(e)
  }
}

module.exports = {ownerFee, ofs14, ofs20}
