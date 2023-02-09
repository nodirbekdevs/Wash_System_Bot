const Geo = require('node-geocoder')
const config = require('./../../helpers/config')
const kb = require('./../../helpers/keyboard-buttons')
const keyboard = require('./../../helpers/keyboard')
const {genSalt, hash} = require('bcrypt')
const {getBranches, getBranch, updateBranch} = require('./../../controllers/branchController')
const {getManagers, getManager, makeManager, updateManager, deleteManager, countManagers} = require('./../../controllers/managerController')
const {getOwner, updateOwner} = require('./../../controllers/ownerController')
const {getEmployees, updateManyEmployees} = require('./../../controllers/employeeController')
const {universal_keyboard, report} = require('./../../helpers/utils')

let type, manager_id

const oms0 = async (bot, chat_id, lang) => {
  let message, kbb

  if (lang === kb.language.uz) {
    message = 'Menejerlar sahifasi'
    kbb = keyboard.owner.managers.uz
  } else {
    message = 'Страница менеджеров'
    kbb = keyboard.owner.managers.ru
  }

  await bot.sendMessage(chat_id, message, {reply_markup: {resize_keyboard: true, keyboard: kbb}})
}

const oms1 = async (bot, chat_id, lang) => {
  let kbb, message

  const query = {owner: chat_id}, managers = await getManagers(query), count = countManagers(query)

  if (managers.length > 0) {
    await updateOwner({telegram_id: chat_id}, {step: 8})
    kbb = universal_keyboard(managers, lang)
    message = (lang === kb.language.uz) ? `Sizda ${count} menejer mavjud` : `У вас есть ${count} менеджеров`
  } else {
    message = (lang === kb.language.uz) ? `Sizda hali menejerlar mavjud emas` : `У вас еще нет менеджеров`
  }

  await bot.sendMessage(chat_id, message, {reply_markup: {resize_keyboard: true, keyboard: kbb}})
}

const oms2 = async (bot, chat_id, text, lang) => {
  let message, kbb

  const manager = await getManager({name: text})

  if (manager) {
    await updateOwner({telegram_id: chat_id}, {step: 9})

    message = report(manager, 'MANAGER', lang)
    kbb = (lang === kb.language.uz) ? keyboard.options.owner.manager.settings.uz : keyboard.options.owner.manager.settings.ru

    await updateManager({_id: manager._id}, {step: 8, status: 'process'})
  } else {
    if (lang === kb.language.uz) {
      message = "Bunday menedjer topilmadi"
      kbb = keyboard.owner.pages.uz
    } else if (lang === kb.language.ru) {
      message = "Такой менеджер не найдено"
      kbb = keyboard.owner.pages.ru
    }
  }

  await bot.sendMessage(chat_id, message, {reply_markup: {resize_keyboard: true, keyboard: kbb}})
}

const oms3 = async (bot, chat_id, _id, lang) => {
  const message = (lang === kb.language.uz)
    ? "O'zgartirmoqchi bo'lgan nomni kiriting"
    : "Введите название, которое хотите изменить"

  await updateManager({_id}, {step: 9})

  await bot.sendMessage(chat_id, message)
}

const oms4 = async (bot, chat_id, _id, text, lang) => {
  let clause, kbb, manager

  manager = await getManager({_id})

  const username = `${text}_m_${manager.number}`, salt = await genSalt(), password = await hash(username, salt)

  await updateManager({_id}, {name: text, username, password, step: 8})

  manager = await getManager({_id})

  const message = report(manager, 'MANAGER', lang)

  if (lang === kb.language.uz) {
    clause = "Menejer nomi muvaffaqiyatli o'zgartirildi"
    kbb = keyboard.options.owner.manager.settings.uz
  } else if (lang === kb.language.ru) {
    clause = "Имя менеджера успешно изменено"
    kbb = keyboard.options.owner.manager.settings.ru
  }

  await bot.sendMessage(chat_id, clause, {reply_markup: {resize_keyboard: true, keyboard: kbb}})

  await bot.sendMessage(chat_id, message)
}

const oms5 = async (bot, chat_id, _id, lang) => {
  const message = (lang === kb.language.uz)
    ? "O'zgartirmoqchi bo'lgan telefon raqamni yuboring"
    : "Отправьте номер телефона, которое хотите изменить"

  await updateManager({_id}, {step: 9})

  await bot.sendMessage(chat_id, message)
}

const oms6 = async (bot, chat_id, _id, text, lang) => {
  let clause, kbb
  await updateManager({_id}, {number: text, step: 8})

  const manager = await getManager({_id}), message = report(manager, 'MANAGER', lang)

  if (lang === kb.language.uz) {
    clause = "Menejer telefon raqami muvaffaqiyatli o'zgartirildi"
    kbb = keyboard.options.owner.manager.settings.uz
  } else if (lang === kb.language.ru) {
    clause = "Номер телефон менеджера успешно изменено"
    kbb = keyboard.options.owner.manager.settings.ru
  }

  await bot.sendMessage(chat_id, clause, {reply_markup: {resize_keyboard: true, keyboard: kbb}})

  await bot.sendMessage(chat_id, message)
}

const oms7 = async (bot, chat_id, _id, lang) => {
  const message = (lang === kb.language.uz)
    ? "O'zgartirmoqchi bo'lgan username yuboring"
    : "Укажите username, которого хотите изменить"

  await updateBranch({_id}, {step: 9})

  await bot.sendMessage(chat_id, message, {reply_markup: {resize_keyboard: true, keyboard: kbb}})
}

const oms8 = async (bot, chat_id, _id, text, lang) => {
  let clause, kbb

  await updateManager({_id}, {username: text, step: 8})

  const manager = await getManager({_id}), message = report(manager, 'MANAGER', lang)

  if (lang === kb.language.uz) {
    clause = "Menejer usernami muvaffaqiyatli o'zgartirildi"
    kbb = keyboard.options.owner.manager.settings.uz
  } else if (lang === kb.language.ru) {
    clause = "Username менеджера успешно изменено"
    kbb = keyboard.options.owner.manager.settings.ru
  }

  await bot.sendMessage(chat_id, clause, {reply_markup: {resize_keyboard: true, keyboard: kbb}})

  await bot.sendMessage(chat_id, message)
}

const oms9 = async (bot, chat_id, _id, lang) => {
  const message = (lang === kb.language.uz)
    ? "O'zgartirmoqchi bo'lgan filialni yuboring"
    : "Отправьте локацию, которое хотите изменить"

  const branches = await getBranches({owner: chat_id, status: 'active'}), kbb = universal_keyboard(branches, lang)

  await updateManager({_id}, {step: 9})

  await bot.sendMessage(chat_id, message, {reply_markup: {resize_keyboard: true, keyboard: kbb}})
}

const oms10 = async (bot, chat_id, _id, text, lang) => {
  let clause, kbb

  const manager = await getManager({_id}), branch = await getBranch({owner: manager.owner, name: text})

  if (branch) {
    if (branch.total_employees > 0) {
      await updateManyEmployees({manager: branch.manager, branch: branch.name}, {manager: manager.telegram_id})
    }

    if (branch.manager) {
      await updateManager({telegram_id: branch.manager, owner: branch.owner}, {branch: ''})
    }

    if (manager.total_employees > 0) {
      await updateManyEmployees({manager: manager.telegram_id, branch: manager.branch}, {manager: 0})
    }

    if (manager.branch) {
      await updateBranch({owner: manager.owner, manager: manager.telegram_id, name: manager.branch}, {manager: 0})
    }

    await updateBranch({_id: branch._id}, {manager: manager.telegram_id, status: 'provided'})
  }

  await updateManager({_id: manager._id}, {branch: branch.name, total_employees: branch.total_employees})

  manager.branch = branch.name
  manager.total_employees = branch.total_employees
  manager.step = 8

  if (manager.status !== 'occupied') manager.status = 'occupied'

  await manager.save()

  const message = report(manager, 'MANAGER', lang)

  if (lang === kb.language.uz) {
    clause = "Menejer filiali muvaffaqiyatli o'zgartirildi"
    kbb = keyboard.options.owner.manager.settings.uz
  } else if (lang === kb.language.ru) {
    clause = "Филиал менеджера успешно изменено"
    kbb = keyboard.options.owner.manager.settings.ru
  }

  await bot.sendMessage(chat_id, clause, {reply_markup: {resize_keyboard: true, keyboard: kbb}})

  await bot.sendMessage(chat_id, message)
}

const oms11 = async (bot, chat_id, lang) => {
  let message, kbb

  const new_manager = await makeManager({owner: chat_id})

  manager_id = new_manager._id

  if (lang === kb.language.uz) {
    message = 'Menejer telegram idsini kiriting'
    kbb = keyboard.options.back.uz
  } else if (lang === kb.language.ru) {
    message = 'Введите telegram id менеджера'
    kbb = keyboard.options.back.ru
  }

  await bot.sendMessage(chat_id, message, {reply_markup: {resize_keyboard: true, keyboard: kbb}})
}

const oms12 = async (bot, chat_id, _id, text, lang) => {
  let message, kbb

  await updateManager({_id}, {telegram_id: parseInt(text), step: 1})

  if (lang === kb.language.uz) {
    message = 'Menejer ismini kiriting'
    kbb = keyboard.options.back.uz
  } else if (lang === kb.language.ru) {
    message = 'Введите имя менеджера'
    kbb = keyboard.options.back.ru
  }

  await bot.sendMessage(chat_id, message, {reply_markup: {resize_keyboard: true, keyboard: kbb}})
}

const oms13 = async (bot, chat_id, _id, text, lang) => {
  let message, kbb

  await updateManager({_id}, {name: text, step: 2})

  if (lang === kb.language.uz) {
    message = "Menedjer telefon raqamini jo'nating"
    kbb = keyboard.options.back.uz
  } else if (lang === kb.language.ru) {
    message = 'Отправьте номер телефон менеджера'
    kbb = keyboard.options.back.ru
  }

  await bot.sendMessage(chat_id, message, {reply_markup: {resize_keyboard: true, keyboard: kbb}})
}

const oms14 = async (bot, chat_id, _id, text, lang) => {
  let message, obj, kbb

  await updateManager({_id}, {number: text, step: 3})

  const branches = await getBranches({owner: chat_id, status: 'active'})

  kbb = universal_keyboard(branches, lang)

  if (lang === kb.language.uz) {
    message = 'Menejerga filial tanlang'
    obj = [kb.options.skipping.uz]
    kbb.splice(-2, 0, obj)
  } else if (lang === kb.language.ru) {
    message = "Выберите филиал к менеджеру"
    obj = [kb.options.skipping.ru]
    kbb.splice(-2, 0, obj)
  }

  await bot.sendMessage(chat_id, message, {reply_markup: {resize_keyboard: true, keyboard: kbb}})
}

const oms15 = async (bot, chat_id, _id, lang) => {
  let message, kbb

  await updateManager({_id}, {step: 4})

  const manager = await getManager({_id})

  message = report(manager, 'MANAGER', lang)

  if (lang === kb.language.uz) {
    message += '\nTasdiqlaysizmi'
    kbb = keyboard.options.confirmation.uz
  } else if (lang === kb.language.ru) {
    message = '\nВы одобряете ?'
    kbb = keyboard.options.confirmation.ru
  }

  await bot.sendMessage(chat_id, message, {reply_markup: {resize_keyboard: true, keyboard: kbb}})
}

const oms16 = async (bot, chat_id, _id, text, lang) => {
  let message, kbb

  const manager = await getManager({_id})

  await updateManager({_id}, {branch: text, step: 4})

  message = report(manager, 'MANAGER', lang)

  if (lang === kb.language.uz) {
    message += '\nTasdiqlaysizmi'
    kbb = keyboard.options.confirmation.uz
  } else if (lang === kb.language.ru) {
    message = '\nВы одобряете ?'
    kbb = keyboard.options.confirmation.ru
  }

  await bot.sendMessage(chat_id, message, {reply_markup: {resize_keyboard: true, keyboard: kbb}})
}
const oms17 = async (bot, chat_id, _id, text, lang) => {
  let message, data

  const manager = await getManager({_id}), branch = await getBranch({owner: manager.owner, name: manager.branch}),
    kbb = (lang === kb.language.uz) ? keyboard.owner.managers.uz : keyboard.owner.managers.ru

  if (text === kb.options.confirmation.uz || text === kb.options.confirmation.ru) {
    const username = `${manager.name}_m_${manager.number}`, salt = await genSalt(), password = await hash(username, salt)

    data = {branch: '', username, password, step: 5, status: 'active'}

    if (branch) {
      if (branch.total_employees > 0) {
        await updateManyEmployees({manager: branch.manager, branch: branch.name}, {manager: 0})
      }

      if (branch.manager) {
        await updateManager({telegram_id: branch.manager, owner: branch.owner, branch: branch.name}, {branch: ''})
      }

      await updateBranch({_id: branch._id}, {manager: manager.telegram_id, status: 'provided'})

      data = {username, password, total_employees: branch.total_employees, step: 5, status: 'occupied'}
    }

    await updateManager({_id: manager._id}, data)

    message = (lang === kb.language.uz)
      ? "Menejer muvaffaqqiyatli qo'shildi. Filial biriktirildi."
      : "Менеджер успешно добавлен. Филиал прилагается."

  } else if (text === kb.options.not_to_confirmation.uz || text === kb.options.not_to_confirmation.ru) {
    await deleteManager({_id: manager._id})

    message = (lang === kb.language.uz)
      ? "Menejer qo'shilmadi."
      : "Менеджер не добавлен."
  }

  await bot.sendMessage(chat_id, message, {reply_markup: {resize_keyboard: true, keyboard: kbb}})
}

const ownerManager = async (bot, chat_id, text, lang) => {
  const owner = await getOwner({telegram_id: chat_id})

  const manager = await getManager({_id: manager_id, owner: owner.telegram_id, status: 'process'})
    ? await getManager({_id: manager_id, owner: owner.telegram_id, status: 'process'})
    : (await getBranches({owner: owner.telegram_id, status: 'process'}))[0]

  try {
    if (text === kb.owner.pages.uz.branches || text === kb.owner.pages.ru.branches) await oms0(bot, chat_id, lang)
    else if (text === kb.owner.branches.uz.all || text === kb.owner.branches.ru.all) await oms1(bot, chat_id, lang)
    else if (text === kb.owner.branches.uz.add || text === kb.owner.branches.ru.add) await oms11(bot, chat_id, lang)
    else if (text === kb.main.uz || text === kb.main.ru) await updateOwner({telegram_id: chat_id}, {step: 5})

    if (manager) {
      if (text === kb.options.back.uz) {
        await deleteManager({_id: manager._id})
        await oms0(bot, chat_id, lang)
      } else if (text !== kb.options.back.uz) {
        if (manager.step === 0) await oms12(bot, chat_id, manager._id, text, lang)
        if (manager.step === 1) await oms13(bot, chat_id, manager._id, text, lang)
        if (manager.step === 2) await oms14(bot, chat_id, manager._id, text, lang)
        if (manager.step === 3) {
          if (text !== kb.options.skipping.uz || text !== kb.options.skipping.ru) await oms16(bot, chat_id, manager._id, lang)
          if (text === kb.options.skipping.uz || text === kb.options.skipping.ru) await oms15(bot, chat_id, manager._id, text, lang)
        }
        if (manager.step === 4) await oms17(bot, chat_id, manager._id, text, lang)
      }
    }

    if (owner) {
      if (owner.step === 8) {
        await oms2(bot, chat_id, text, lang)
      }

      if (owner.step === 9) {
        const manager = await getManager({owner: owner.telegram_id, step: 5, status: 'process'})

        if (text === kb.options.back.uz || text === kb.options.back.ru) {
          await updateManager({owner: owner.telegram_id, step: 5, status: 'process'}, {status: 'active'})
          await updateOwner({telegram_id: chat_id}, {step: 8})
        } else if (text !== kb.options.back.uz || text !== kb.options.back.ru) {
          if (manager.step === 8) {
            if (text === kb.options.owner.manager.settings.uz.name || text === kb.options.owner.manager.settings.ru.name)
              await oms3(bot, chat_id, manager._id, lang)
            if (text === kb.options.owner.manager.settings.uz.number || text === kb.options.owner.manager.settings.ru.number)
              await oms5(bot, chat_id, manager._id, lang)
            if (text === kb.options.owner.manager.settings.uz.username || text === kb.options.owner.manager.settings.ru.username)
              await oms7(bot, chat_id, manager._id, lang)
            if (text === kb.options.owner.manager.settings.uz.branch || text === kb.options.owner.manager.settings.ru.branch)
              await oms9(bot, chat_id, manager._id, lang)

            type = text
          } else if (manager.step === 9) {
            if (type === kb.options.owner.manager.settings.uz.name || type === kb.options.owner.manager.settings.ru.name)
              await oms4(bot, manager, text, lang)
            if (type === kb.options.owner.manager.settings.uz.manager || type === kb.options.owner.manager.settings.ru.manager)
              await oms6(bot, chat_id, manager._id, text, lang)
            if (type === kb.options.owner.manager.settings.uz.image || type === kb.options.owner.manager.settings.ru.image)
              await oms8(bot, chat_id, manager._id, text, lang)
            if (type === kb.options.owner.manager.settings.uz.location || type === kb.options.owner.manager.settings.ru.location)
              await oms10(bot, chat_id, manager._id, text, lang)
          }
        }
      }
    }

  } catch (e) {
    console.log(e)
  }
}

module.exports = {ownerManager}
