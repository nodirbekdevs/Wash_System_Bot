const kb = require('./../../helpers/keyboard-buttons')
const keyboard = require('./../../helpers/keyboard')
const {getOwners, getOwner, makeOwner, updateOwner, deleteOwner, countOwners} = require('./../../controllers/ownerController')
const {getAdmin} = require('./../../controllers/adminController')
const {owner_pagination, date, report} = require('./../../helpers/utils')
const {amp} = require('./mainPage')

let owner_id

const aos0 = async (bot, chat_id) => {
  await bot.sendMessage(chat_id, "Mo'yka xo'jayinlari bo'limi", {
    reply_markup: {resize_keyboard: true, keyboard: keyboard.admin.owners}
  })
}

const aos1 = async (bot, chat_id) => {
  const owners = await countOwners({author: chat_id})

  const message = (owners > 0)
    ? `Hozirda siz tomoningizdan ${owners} mo'yka xo'jayinlari qo'shilgan`
    : `Hozircha mo'yka xo'jayinlari qo'shilmagan`

  await bot.sendMessage(chat_id, message, {reply_markup: {resize_keyboard: true, keyboard: keyboard.admin.owners}})
}

const aos2 = async (bot, chat_id) => {
  const owners = await getOwners({status: 'active'})

  const report = owner_pagination(1, 10, owners)

  await bot.sendMessage(chat_id, report.text, {parse_mode: 'HTML', reply_markup: {inline_keyboard: report.kbb}})
}

const aos3 = async (bot, chat_id, query_id, message_id, phrase, _id) => {
  let message

  const owners = await getOwners({status: 'active'}), data = phrase.split('#')

  if ((data[0] === 'left' || data[0] === 'right') && data[1] === 'owner') {
    const current_page = parseInt(data[2])

    const report = await owner_pagination(current_page, 10, owners)

    await bot.editMessageText(report.text, {
      chat_id, message_id, parse_mode: 'HTML', reply_markup: {inline_keyboard: report.kbb}
    })

    await bot.answerCallbackQuery(query_id, '')
  }

  if (phrase === 'owner') {
    const owner = await getOwner({_id}), started_at = date(owner.created_at)

    const data = {
      name: owner.name,
      username: owner.username,
      number: owner.number,
      total_branches: owner.total_branches,
      total_managers: owner.total_managers,
      is_paid: owner.is_paid,
      balance: owner.balance,
      lang: owner.lang,
      status: owner.status,
      created_at: started_at
    }

    message = report(data, 'ADMIN_OWNER', kb.language.uz)

    await bot.sendMessage(chat_id, message)

    await bot.answerCallbackQuery(query_id, '')
  }
}

const aos4 = async (bot, chat_id) => {
  const new_owner = await makeOwner({})

  owner_id = new_owner._id

  await bot.sendMessage(chat_id, "Mo'yka xo'jayinini telegram_id sini kiriting", {
    reply_markup: {resize_keyboard: true, keyboard: keyboard.options.back.uz}
  })
}

const aos5 = async (bot, chat_id, _id, text) => {
  await updateOwner({_id}, {telegram_id: parseInt(text), step: 1})

  await bot.sendMessage(chat_id, "Mo'yka xo'jayinini ismini kiriting", {
    reply_markup: {resize_keyboard: true, keyboard: keyboard.options.back.uz}
  })
}

const aos6 = async (bot, chat_id, _id, text) => {
  await updateOwner({_id}, {name: text, step: 2})

  await bot.sendMessage(chat_id, "Mo'yka xo'jayinini telefon raqamini kiriting", {
    reply_markup: {resize_keyboard: true, keyboard: keyboard.options.back.uz}
  })
}

const aos7 = async (bot, chat_id, _id, text) => {
  await updateOwner({_id}, {number: text, step: 3})

  await bot.sendMessage(chat_id, "Mo'yka xo'jayinini platformadagi tilini kiriting", {
    reply_markup: {resize_keyboard: true, keyboard: keyboard.language}
  })
}

const aos8 = async (bot, chat_id, _id, text) => {
  await updateOwner({_id}, {lang: text, step: 4})

  const owner = await getOwner({_id})

  const data = {
    name: owner.name,
    username: owner.username,
    number: owner.number,
    total_branches: owner.total_branches,
    total_managers: owner.total_managers,
    is_paid: owner.is_paid,
    balance: owner.balance,
    lang: owner.lang,
    status: owner.status,
    created_at: started_at
  }

  let message = report(data, 'ADMIN_OWNER', kb.language.uz)

  message += '\nTugaganini tasdiqlaysizmi?'

  await bot.sendMessage(chat_id, message, {
    reply_markup: {resize_keyboard: true, keyboard: keyboard.options.confirmation.uz}
  })
}

const aos9 = async (bot, chat_id, _id, text) => {
  let message


  if (text === kb.options.confirmation.uz) {
    await updateOwner({_id}, {step: 5, status: 'active'})

    const admin = await getAdmin({telegram_id: chat_id}), owner = await getOwner({_id})

    admin.owners.push(owner._id)
    admin.total_owners += 1
    await admin.save()

    message = "Mo'yka xo'jayini muvaffaqqiyati qo'shildi"
  } else if (text === kb.options.not_to_confirmation.uz) {
    await deleteCar({_id})

    message = "Mo'yka xo'jayini qo'shilmadi"
  }

  await bot.sendMessage(chat_id, message, {reply_markup: {resize_keyboard: true, keyboard: keyboard.admin.owners}})
}

const aos10 = async (bot, chat_id, _id) => {
  await deleteOwner({_id})

  await bot.sendMessage(chat_id, "Mo'yka xo'jayini qo'shilmadi",
    {reply_markup: {resize_keyboard: true, keyboard: keyboard.admin.owners}}
  )
}

const adminOwners = async (bot, chat_id, text) => {

  const owner = await getOwner({_id: owner_id, status: 'process'})
    ? await getOwner({_id: owner_id, status: 'process'})
    : (await getOwners({status: 'process'}))[0]

  if (text === kb.admin.pages.owners) await aos0(bot, chat_id)
  if (text === kb.admin.owners.number) await aos1(bot, chat_id)
  if (text === kb.admin.owners.all) await aos2(bot, chat_id)
  if (text === kb.admin.owners.add) await aos4(bot, chat_id)

  if (owner) {
    if (text === kb.options.back.uz) {
      await aos10(bot, chat_id, owner._id)
    } else if (text !== kb.options.back.uz) {
      if (owner.step === 0) await aos5(bot, chat_id, owner._id, text)
      if (owner.step === 1) await aos6(bot, chat_id, owner._id, text)
      if (owner.step === 2) await aos7(bot, chat_id, owner._id, text)
      if (owner.step === 3) await aos8(bot, chat_id, owner._id, text)
      if (owner.step === 4) await aos9(bot, chat_id, owner._id, text)
    }
  }
}

module.exports = {adminOwners, aos3}
