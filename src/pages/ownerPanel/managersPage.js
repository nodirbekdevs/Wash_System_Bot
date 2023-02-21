const Geo = require('node-geocoder')
const config = require('./../../helpers/config')
const kb = require('./../../helpers/keyboard-buttons')
const keyboard = require('./../../helpers/keyboard')
const {genSalt, hash} = require('bcrypt')
const {getBranches, getBranch, updateBranch} = require('./../../controllers/branchController')
const {getManagers, getManager, makeManager, updateManager, deleteManager, countManagers} = require('./../../controllers/managerController')
const {getOwner, updateOwner} = require('./../../controllers/ownerController')
const {getEmployees, updateManyEmployees} = require('./../../controllers/employeeController')
const {updateManyFees} = require('./../../controllers/feeController')
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

  const managers = await getManagers({owner: chat_id})

  if (managers.length > 0) {
    await updateOwner({telegram_id: chat_id}, {step: 10})
    kbb = universal_keyboard(managers, lang)
    message = (lang === kb.language.uz) ? `Sizda ${managers.length} menejer mavjud` : `У вас есть ${managers.length} менеджеров`
  } else {
    message = (lang === kb.language.uz) ? `Sizda hali menejerlar mavjud emas` : `У вас еще нет менеджеров`
  }

  await bot.sendMessage(chat_id, message, {reply_markup: {resize_keyboard: true, keyboard: kbb}})
}

const oms2 = async (bot, chat_id, text, lang, kw) => {
  let message, kbb

  const manager = await getManager({name: text})

  if (manager) {
    await updateOwner({telegram_id: chat_id}, {step: 11})

    console.log(manager)

    message = report(manager, 'MANAGER', lang)

    kbb = (lang === kb.language.uz) ? keyboard.options.owner.manager.settings.uz : keyboard.options.owner.manager.settings.ru

    await updateManager({_id: manager._id}, {step: 9, status: 'process'})

    await bot.sendMessage(chat_id, message, {reply_markup: {resize_keyboard: true, keyboard: kbb}})
  } else if (!manager && !kw) {
    if (lang === kb.language.uz) {
      message = "Bunday menedjer topilmadi"
      kbb = keyboard.owner.pages.uz
    } else if (lang === kb.language.ru) {
      message = "Такой менеджер не найдено"
      kbb = keyboard.owner.pages.ru
    }

    await bot.sendMessage(chat_id, message, {reply_markup: {resize_keyboard: true, keyboard: kbb}})
  }
}

const oms3 = async (bot, chat_id, _id, lang) => {
  let message, kbb

  if (lang === kb.language.uz) {
    message = "O'zgartirmoqchi bo'lgan nomni kiriting"
    kbb = keyboard.options.back.uz
  } else if (lang === kb.language.ru) {
    message = "Введите название, которое хотите изменить"
    kbb = keyboard.options.back.ru
  }

  await updateManager({_id}, {step: 10})

  await bot.sendMessage(chat_id, message, {reply_markup: {resize_keyboard: true, keyboard: kbb}})
}

const oms4 = async (bot, chat_id, _id, text, lang) => {
  let clause, kbb, manager

  manager = await getManager({_id})

  const username = `${text}_MAN_${manager.number}`, salt = await genSalt(), password = await hash(username, salt)

  await updateManager({_id}, {name: text, username, password, step: 9})

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
  let message, kbb

  if (lang === kb.language.uz) {
    message = "O'zgartirmoqchi bo'lgan telefon raqamni yuboring"
    kbb = keyboard.options.back.uz
  } else if (lang === kb.language.ru) {
    message = "Отправьте номер телефона, которое хотите изменить"
    kbb = keyboard.options.back.uz
  }

  await updateManager({_id}, {step: 10})

  await bot.sendMessage(chat_id, message, {reply_markup: {resize_keyboard: true, keyboard: kbb}})
}

const oms6 = async (bot, chat_id, _id, text, lang) => {
  let clause, kbb, manager

  manager = await getManager({_id})

  const username = `${manager.name}_MAN_${text}`, salt = await genSalt(), password = await hash(username, salt)

  await updateManager({_id}, {username, password, number: text, step: 9})

  manager = await getManager({_id})

  const message = report(manager, 'MANAGER', lang)

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
  let message, kbb

  if (lang === kb.language.uz) {
    message = "O'zgartirmoqchi bo'lgan username yuboring"
    kbb = keyboard.options.back.uz
  } else if (lang === kb.language.ru) {
    message = "Укажите username, которого хотите изменить"
    kbb = keyboard.options.back.uz
  }

  await updateBranch({_id}, {step: 10})

  await bot.sendMessage(chat_id, message, {reply_markup: {resize_keyboard: true, keyboard: kbb}})
}

const oms8 = async (bot, chat_id, _id, text, lang) => {
  let clause, kbb

  const salt = await genSalt(), password = await hash(text, salt)

  await updateManager({_id}, {username: text, password, step: 9})

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
  let message, kbb

  const branches = await getBranches({owner: chat_id})

  if (branches.length > 0) {
    await updateManager({_id}, {step: 10})

    kbb = universal_keyboard(branches, lang)

    message = (lang === kb.language.uz)
      ? "O'zgartirmoqchi bo'lgan filialni yuboring"
      : "Отправьте локацию, которое хотите изменить"
  } else if (branches <= 0) {
    if (lang === kb.language.uz) {
      message = "Hali filiallar qo'shilmagan"
      kbb = keyboard.options.owner.branch.settings.uz
    } else if (lang === kb.language.ru) {
      message = "Филиалы еще не добавлены"
      kbb = keyboard.options.owner.branch.settings.ru
    }
  }

  await bot.sendMessage(chat_id, message, {reply_markup: {resize_keyboard: true, keyboard: kbb}})
}

const oms10 = async (bot, chat_id, _id, text, lang) => {
  let clause, kbb

  const manager = await getManager({_id}), branch = await getBranch({owner: manager.owner, name: text})

  if (branch) {
    if (branch.total_employees > 0) {
      await updateManyEmployees({manager: branch.manager, branch: branch.name}, {manager: manager.telegram_id})
    }

    if (branch.total_fees > 0) {
      await updateManyFees({
        owner: branch.owner,
        manager: branch.manager,
        branch: branch.name
      }, {manager: manager.telegram_id})
    }

    if (branch.manager) {
      await updateManager({telegram_id: branch.manager, owner: branch.owner}, {branch: '', status: 'active'})
    }

    if (manager.total_employees > 0) {
      await updateManyEmployees({manager: manager.telegram_id, branch: manager.branch}, {manager: 0})
    }

    if (manager.branch) {
      await updateBranch({owner: manager.owner, manager: manager.telegram_id, name: manager.branch}, {
        manager: 0,
        status: 'active'
      })
    }

    await updateBranch({_id: branch._id}, {manager: manager.telegram_id, status: 'provided'})
  }

  await updateManager({_id: manager._id}, {branch: branch.name, total_employees: branch.total_employees})

  manager.branch = branch.name
  manager.total_employees = branch.total_employees
  manager.step = 9


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

  if (branches.length > 0) {
    kbb = universal_keyboard(branches, lang)

    if (lang === kb.language.uz) {
      message = 'Menejerga filial tanlang'
      obj = [kb.options.skipping.uz]
      kbb.splice(-1, 0, obj)
    } else if (lang === kb.language.ru) {
      message = "Выберите филиал к менеджеру"
      obj = [kb.options.skipping.ru]
      kbb.splice(-1, 0, obj)
    }

    await bot.sendMessage(chat_id, message, {reply_markup: {resize_keyboard: true, keyboard: kbb}})
  } else if (branches <= 0) {
    await oms15(bot, chat_id, _id, lang)
  }
}

const oms15 = async (bot, chat_id, _id, lang) => {

  console.log("Kevotti1")

  await updateManager({_id}, {step: 4})

  const message = (lang === kb.language.uz) ? 'Menejerni platformadagi tilini kiriting' : 'Введите язык платформы менеджера',
    kbb = keyboard.language

  await bot.sendMessage(chat_id, message, {reply_markup: {resize_keyboard: true, keyboard: kbb}})
}

const oms16 = async (bot, chat_id, _id, text, lang) => {
  console.log("Kevotti2")

  await updateManager({_id}, {branch: text, step: 4})

  console.log(lang)

  const message = (lang === kb.language.uz) ? 'Menejerni platformadagi tilini kiriting' : 'Введите язык платформы менеджера'

  await bot.sendMessage(chat_id, message, {reply_markup: {resize_keyboard: true, keyboard: keyboard.language}})
}

const oms17 = async (bot, chat_id, _id, text, lang) => {
  let message, kbb

  await updateManager({_id}, {lang: text, step: 5})

  const manager = await getManager({_id})

  console.log(manager.branch)

  message = report(manager, 'MANAGER', lang)

  if (lang === kb.language.uz) {
    message += '\nTasdiqlaysizmi'
    kbb = keyboard.options.confirmation.uz
  } else if (lang === kb.language.ru) {
    message += '\nВы одобряете ?'
    kbb = keyboard.options.confirmation.ru
  }

  await bot.sendMessage(chat_id, message, {reply_markup: {resize_keyboard: true, keyboard: kbb}})
}

const oms18 = async (bot, chat_id, _id, text, lang) => {
  let message, data, manager

  manager = await getManager({_id})

  const branch = await getBranch({owner: manager.owner, name: manager.branch}),
  kbb = (lang === kb.language.uz) ? keyboard.owner.managers.uz : keyboard.owner.managers.ru

  if (text === kb.options.confirmation.uz || text === kb.options.confirmation.ru) {
    const username = `${manager.name}_MAN_${manager.number}`, salt = await genSalt(),
      password = await hash(username, salt)

    data = {branch: '', username, password, step: 6, status: 'active'}

    if (branch) {
      if (branch.total_employees > 0) {
        await updateManyEmployees({manager: branch.manager, branch: branch.name}, {manager: 0})
      }

      if (branch.total_fees > 0) {
        await updateManyFees({owner: branch.owner, manager: branch.manager, branch: branch.name}, {manager: 0})
      }

      if (branch.manager) {
        await updateManager({telegram_id: branch.manager, owner: branch.owner, branch: branch.name}, {branch: ''})
      }

      await updateBranch({_id: branch._id}, {manager: manager.telegram_id, status: 'provided'})

      data = {username, password, total_employees: branch.total_employees, step: 6, status: 'occupied'}
    }

    await updateManager({_id: manager._id}, data)

    await updateOwner({telegram_id: chat_id}, {$inc: {total_managers: 1}})

    manager = await getManager({_id})

    message = (lang === kb.language.uz)
      ? `Menejer muvaffaqqiyatli qo'shildi. ${manager.branch ? 'Filial biriktirildi.' : 'Filial biriktirildi.'}`
      : `Менеджер успешно добавлен. ${manager.branch ? 'Филиал прилагается.' : 'Филиал не прилагается.'} `

  } else if (text === kb.options.not_to_confirmation.uz || text === kb.options.not_to_confirmation.ru) {
    await deleteManager({_id: manager._id})

    message = (lang === kb.language.uz)
      ? "Menejer qo'shilmadi."
      : "Менеджер не добавлен."
  }

  await bot.sendMessage(chat_id, message, {reply_markup: {resize_keyboard: true, keyboard: kbb}})
}

const oms19 = async (bot, chat_id, _id, lang) => {
  await deleteManager({_id})
  await oms0(bot, chat_id, lang)
}

const ownerManager = async (bot, chat_id, text, lang) => {
  const owner = await getOwner({telegram_id: chat_id})

  const manager = await getManager({_id: manager_id, owner: owner.telegram_id, status: 'process'})
    ? await getManager({_id: manager_id, owner: owner.telegram_id, status: 'process'})
    : (await getManagers({owner: owner.telegram_id, status: 'process'}))[0]

  try {
    if (text === kb.owner.pages.uz.managers || text === kb.owner.pages.ru.managers) await oms0(bot, chat_id, lang)
    else if (text === kb.owner.managers.uz.all || text === kb.owner.managers.ru.all) await oms1(bot, chat_id, lang)
    else if (text === kb.owner.managers.uz.add || text === kb.owner.managers.ru.add) await oms11(bot, chat_id, lang)
    else if (text === kb.main.uz || text === kb.main.ru) await updateOwner({telegram_id: chat_id}, {step: 5})

    if (owner.step === 5) {
      if (manager) {
        if (text === kb.options.back.uz) {
          await oms19(bot, chat_id, manager._id, lang)
        } else if (text !== kb.options.back.uz) {
          if (manager.step === 0) await oms12(bot, chat_id, manager._id, text, lang)
          if (manager.step === 1) await oms13(bot, chat_id, manager._id, text, lang)
          if (manager.step === 2) await oms14(bot, chat_id, manager._id, text, lang)
          if (manager.step === 3) {
            if (text !== kb.options.skipping.uz || text !== kb.options.skipping.ru) await oms16(bot, chat_id, manager._id, text, lang)
            if (text === kb.options.skipping.uz || text === kb.options.skipping.ru) await oms15(bot, chat_id, manager._id, lang)
          }
          if (manager.step === 4) await oms17(bot, chat_id, manager._id, text, lang)
          if (manager.step === 5) await oms18(bot, chat_id, manager._id, text, lang)
        }
      }
    }

    if (owner.step === 10) {
      if (text === kb.options.back.uz || text === kb.options.back.ru) {
        console.log("Kevotti")
        await updateOwner({telegram_id: chat_id}, {step: 5})
        await oms0(bot, chat_id, lang)
      }
      if (text !== kb.options.back.uz || text !== kb.options.back.ru) {
        console.log("Kevotti_back")
        await oms2(bot, chat_id, text, lang, 'back')
      }
    }

    if (owner.step === 11) {
      const manager = await getManager({owner: owner.telegram_id, status: 'process'})

      if (text === kb.options.back.uz || text === kb.options.back.ru) {
        const data = manager.branch ? {step: 6, status: 'occupied'} : {step: 6, status: 'active'}
        await updateManager({owner: owner.telegram_id, step: 9, status: 'process'}, data)
        await updateOwner({telegram_id: chat_id}, {step: 10})
        await oms1(bot, chat_id, lang)
      } else if (text !== kb.options.back.uz || text !== kb.options.back.ru) {
        if (manager.step === 9) {
          if (text === kb.options.owner.manager.settings.uz.name || text === kb.options.owner.manager.settings.ru.name)
            await oms3(bot, chat_id, manager._id, lang)
          if (text === kb.options.owner.manager.settings.uz.number || text === kb.options.owner.manager.settings.ru.number)
            await oms5(bot, chat_id, manager._id, lang)
          if (text === kb.options.owner.manager.settings.uz.username || text === kb.options.owner.manager.settings.ru.username)
            await oms7(bot, chat_id, manager._id, lang)
          if (text === kb.options.owner.manager.settings.uz.branch || text === kb.options.owner.manager.settings.ru.branch)
            await oms9(bot, chat_id, manager._id, lang)

          type = text
        } else if (manager.step === 10) {
          if (type === kb.options.owner.manager.settings.uz.name || type === kb.options.owner.manager.settings.ru.name)
            await oms4(bot, chat_id, manager._id, text, lang)
          if (type === kb.options.owner.manager.settings.uz.number || type === kb.options.owner.manager.settings.ru.number)
            await oms6(bot, chat_id, manager._id, text, lang)
          if (type === kb.options.owner.manager.settings.uz.username || type === kb.options.owner.manager.settings.ru.username)
            await oms8(bot, chat_id, manager._id, text, lang)
          if (type === kb.options.owner.manager.settings.uz.branch || type === kb.options.owner.manager.settings.ru.branch)
            await oms10(bot, chat_id, manager._id, text, lang)
        }
      }
    }


  } catch
    (e) {
    console.log(e)
  }
}

module.exports = {ownerManager}
