const Geo = require('node-geocoder')
const {mkdir, rename} = require('fs/promises')
const {join} = require("path")
const config = require('./../../helpers/config')
const kb = require('./../../helpers/keyboard-buttons')
const keyboard = require('./../../helpers/keyboard')
const {getBranches, getBranch, makeBranch, updateBranch, deleteBranch, countBranches} = require('./../../controllers/branchController')
const {getOwner, updateOwner} = require('./../../controllers/ownerController')
const {getManagers, getManager, updateManager} = require('./../../controllers/managerController')
const {getEmployees, updateManyEmployees} = require('./../../controllers/employeeController')
const {branch_manager_keyboard, bio} = require('./../../helpers/utils')
const {} = require('./../../../uploads/reports/branches')

let type, branch_id

const obs0 = async (bot, chat_id, lang) => {
  let message, kbb

  if (lang === kb.language.uz) {
    message = 'Filiallar sahifasi'
    kbb = keyboard.owner.branches.uz
  } else {
    message = 'Страница филиалов'
    kbb = keyboard.owner.branches.ru
  }

  await bot.sendMessage(chat_id, message, {reply_markup: {resize_keyboard: true, keyboard: kbb}})
}

const obs1 = async (bot, chat_id, lang) => {
  let kbb, message

  const query = {owner: chat_id}, branches = await getBranches(query), count = countBranches(query)

  if (branches.length > 0) {
    await updateOwner({telegram_id: chat_id}, {step: 8})
    kbb = branch_manager_keyboard(branches, lang)
    message = (lang === kb.language.uz) ? `Sizda ${count} filial mavjud` : `У вас есть ${count} филиалов`
  } else {
    message = (lang === kb.language.uz) ? `Sizda hali filiallar mavjud emas` : `У вас еще нет филиалов`
  }

  await bot.sendMessage(chat_id, message, {reply_markup: {resize_keyboard: true, keyboard: kbb}})
}

const obs2 = async (bot, chat_id, text, lang) => {
  let message, kbb

  const branch = await getBranch({name: text})

  if (branch) {
    await updateOwner({telegram_id: chat_id}, {step: 9})

    await updateBranch({_id: branch._id}, {step: 6, status: 'process'})

    message = bio(branch, 'BRANCH', lang)
    kbb = (lang === kb.language.uz) ? keyboard.options.owner.branch.settings.uz : keyboard.options.owner.branch.settings.ru
  } else {
    if (lang === kb.language.uz) {
      message = "Bunday filial topilmadi"
      kbb = keyboard.owner.pages.uz
    } else if (lang === kb.language.ru) {
      message = "Такой филиал не найдено"
      kbb = keyboard.owner.pages.ru
    }
  }

  if (branch.location) {
    await bot.sendLocation(chat_id, branch.location.latitude, branch.location.longitude)
  }

  await bot.sendPhoto(chat_id, branch.image, {caption: message, reply_markup: {resize_keyboard: true, keyboard: kbb}})
}

const obs3 = async (bot, chat_id, _id, lang) => {
  const message = (lang === kb.language.uz)
    ? "O'zgartirmoqchi bo'lgan nomni kiriting"
    : "Введите название, которое хотите изменить"

  await updateBranch({_id}, {step: 7})

  await bot.sendMessage(chat_id, message)
}

const obs4 = async (bot, chat_id, _id, text, lang) => {
  let clause, kbb

  const exits_branch = await getBranch({_id}),
    old_path =  join(__dirname, `./../../../uploads/reports/branches/${exits_branch.name}`)

  await updateBranch({_id}, {name: text, step: 6})

  const branch = await getBranch({_id}), message = bio(branch, 'BRANCH', lang)

  const new_path = join(__dirname, `./../../../uploads/reports/branches/${branch.name}`)

  await rename(old_path, new_path)

  if (lang === kb.language.uz) {
    clause = "Filial nomi muvaffaqiyatli o'zgartirildi"
    kbb = keyboard.options.owner.branch.settings.uz
  } else if (lang === kb.language.ru) {
    clause = "Название филиала успешно изменено"
    kbb = keyboard.options.owner.branch.settings.ru
  }

  await bot.sendMessage(chat_id, clause, {reply_markup: {resize_keyboard: true, keyboard: kbb}})

  await bot.sendPhoto(chat_id, branch.image, {caption: message})
}

const obs5 = async (bot, chat_id, _id, lang) => {
  const message = (lang === kb.language.uz)
    ? "O'zgartirmoqchi bo'lgan rasmi yuboring"
    : "Отправьте изображение, которое хотите изменить"

  await updateBranch({_id}, {step: 7})

  await bot.sendMessage(chat_id, message)
}

const obs6 = async (bot, chat_id, _id, text, lang) => {
  let clause, kbb
  await updateBranch({_id}, {image: text, step: 6})

  const branch = await getBranch({_id}), message = bio(branch, 'BRANCH', lang)

  if (lang === kb.language.uz) {
    clause = "Filial rasmi muvaffaqiyatli o'zgartirildi"
    kbb = keyboard.options.owner.branch.settings.uz
  } else if (lang === kb.language.ru) {
    clause = "Изображение филиала успешно изменено"
    kbb = keyboard.options.owner.branch.settings.ru
  }

  await bot.sendMessage(chat_id, clause, {reply_markup: {resize_keyboard: true, keyboard: kbb}})

  await bot.sendPhoto(chat_id, branch.image, {caption: message})
}

const obs7 = async (bot, chat_id, _id, lang) => {
  const message = (lang === kb.language.uz)
    ? "O'zgartirmoqchi bo'lgan menejerni yuboring"
    : "Укажите менеджера, которого хотите изменить"

  const managers = await getManagers({owner: chat_id, status: 'active'}), kbb = branch_manager_keyboard(managers, lang)

  await updateBranch({_id}, {step: 7})

  await bot.sendMessage(chat_id, message, {reply_markup: {resize_keyboard: true, keyboard: kbb}})
}

const obs8 = async (bot, chat_id, _id, text, lang) => {
  let clause, kbb

  const manager = await getManager({name: text}), branch = await getBranch({_id})

  if (manager) {
    if (manager.total_employees > 0) {
      await updateManyEmployees({manager: manager.telegram_id, branch: manager.branch}, {manager: 0})
    }

    if (manager.branch) {
      await updateBranch({name: manager.branch}, {manager: ''})
    }

    if (branch.total_employees > 0) {
      await updateManyEmployees({branch: branch.name, manager: branch.manager}, {manager: manager.telegram_id})
    }

    if (branch.manager) {
      await updateManager({telegram_id: branch.manager, owner: branch.owner, branch: branch.name}, {branch: ''})
    }

    await updateManager({_id: manager._id}, {branch: branch.name, total_employees: branch.total_employees, status: 'occupied'})
  }

  branch.manager = manager.telegram_id
  branch.step = 6

  if (branch.status !== 'provided') branch.status = 'provided'

  await branch.save()

  if (lang === kb.language.uz) {
    clause = "Filial menejeri muvaffaqiyatli o'zgartirildi"
    kbb = keyboard.options.owner.branch.settings.uz
  } else if (lang === kb.language.ru) {
    clause = "Менеджер филиала успешно изменено"
    kbb = keyboard.options.owner.branch.settings.ru
  }

  await bot.sendMessage(chat_id, clause, {reply_markup: {resize_keyboard: true, keyboard: kbb}})

  await bot.sendPhoto(chat_id, branch.image, {caption: message})
}

const obs9 = async (bot, chat_id, _id, lang) => {
  const message = (lang === kb.language.uz)
    ? "O'zgartirmoqchi bo'lgan manzilingizni yuboring"
    : "Отправьте локацию, которое хотите изменить"

  await updateBranch({_id}, {step: 8})

  await bot.sendMessage(chat_id, message)
}

const obs10 = async (bot, chat_id, _id, text, lang) => {
  let clause, place_name = '', kbb

  const branch = await getBranch({_id}), geo = Geo(config.MAP_OPTIONS),
    place_geo = await geo.reverse({lat: text.latitude, lon: text.longitude})

  place_geo.map(place => place_name = `${place.country} ${place.city} ${place.county}`)

  if (branch) {
    branch.location.name = place_name
    branch.location.latitude = text.latitude
    branch.location.longitude = text.longitude
    branch.step = 7
    await branch.save()
  }

  const message = bio(branch, 'BRANCH', lang)

  if (lang === kb.language.uz) {
    clause = "Filial manzili muvaffaqiyatli o'zgartirildi"
    kbb = keyboard.options.owner.branch.settings.uz
  } else if (lang === kb.language.ru) {
    clause = "Локация филиала успешно изменено"
    kbb = keyboard.options.owner.branch.settings.ru
  }

  await bot.sendMessage(chat_id, clause, {reply_markup: {resize_keyboard: true, keyboard: kbb}})

  await bot.sendPhoto(chat_id, branch.image, {caption: message})
}

const obs11 = async (bot, chat_id, lang) => {
  let message, kbb

  const new_branch = await makeBranch({owner: chat_id})

  branch_id = new_branch._id

  if (lang === kb.language.uz) {
    message = 'Filialni nomini kiriting'
    kbb = keyboard.options.back.uz
  } else if (lang === kb.language.ru) {
    message = 'Введите название филиала'
    kbb = keyboard.options.back.ru
  }

  await bot.sendMessage(chat_id, message, {reply_markup: {resize_keyboard: true, keyboard: kbb}})
}

const obs12 = async (bot, chat_id, _id, text, lang) => {
  let message, kbb

  await updateBranch({_id}, {name: text, step: 1})

  if (lang === kb.language.uz) {
    message = "Filialni rasmini jo'nating"
    kbb = keyboard.options.back.uz
  } else if (lang === kb.language.ru) {
    message = 'Отправить фото филиала'
    kbb = keyboard.options.back.ru
  }

  await bot.sendMessage(chat_id, message, {reply_markup: {resize_keyboard: true, keyboard: kbb}})
}

const obs13 = async (bot, chat_id, _id, text, lang) => {
  let message, obj, kbb

  await updateBranch({_id}, {image: text, step: 2})

  const managers = await getManagers({owner: chat_id, status: 'active'})

  kbb = branch_manager_keyboard(managers, lang)

  if (lang === kb.language.uz) {
    message = 'Filial menejerini tanlang'
    obj = [kb.options.skipping.uz]
    kbb.splice(-2, 0, obj)
  } else if (lang === kb.language.ru) {
    message = 'Выбрать управляющего филиалом'
    obj = [kb.options.skipping.ru]
    kbb.splice(-2, 0, obj)
  }

  await bot.sendMessage(chat_id, message, {reply_markup: {resize_keyboard: true, keyboard: kbb}})
}

const obs14 = async (bot, chat_id, _id, text, lang) => {
  let message, kbb

  await updateBranch({_id}, {manager: text, step: 3})

  if (lang === kb.language.uz) {
    message = "Filialni manzilini jo'nating"
    kbb = keyboard.options.back.uz
  } else if (lang === kb.language.ru) {
    message = 'Отправить локацию филиала'
    kbb = keyboard.options.back.ru
  }

  await bot.sendMessage(chat_id, message, {reply_markup: {resize_keyboard: true, keyboard: kbb}})
}

const obs15 = async (bot, chat_id, branch, text, lang) => {
  let message, kbb, place_name = ''

  if (text.latitude && text.longitude) {
    const geo = Geo(config.MAP_OPTIONS), place_geo = await geo.reverse({lat: text.latitude, lon: text.longitude})

    place_geo.map(place => place_name = `${place.country} ${place.city} ${place.county}`)

    if (branch) {
      branch.location.name = place_name
      branch.location.latitude = text.latitude
      branch.location.longitude = text.longitude
      branch.step = 4
      await branch.save()
    }

    message = bio(branch, 'BRANCH', lang)

    if (lang === kb.language.uz) {
      message += '\nTasdiqlaysizmi ?'
      kbb = keyboard.options.confirmation.uz
    } else if (lang === kb.language.ru) {
      message = '\nВы одобряете ?'
      kbb = keyboard.options.confirmation.ru
    }

    await bot.sendPhoto(chat_id, branch.image, {caption: message, reply_markup: {resize_keyboard: true, keyboard: kbb}})

  } else if (!text.latitude && !text.longitude) {
    if (lang === kb.language.uz) {
      message = "Iltimos lokatsiya yuboring"
      kbb = keyboard.options.back.uz
    } else if (lang === kb.language.ru) {
      message = "Пожалуйста, пришлите местоположение"
      kbb = keyboard.options.back.ru
    }

    await bot.sendMessage(chat_id, message, {reply_markup: {resize_keyboard: true, keyboard: kbb}})
  }
}

const obs16 = async (bot, chat_id, _id, text, lang) => {
  let message, data

  const branch = await getBranch({_id}), manager = await getManager({telegram_id: branch.manager}),
    kbb = (lang === kb.language.uz) ? keyboard.owner.branches.uz : keyboard.owner.branches.ru

  if (text === kb.options.confirmation.uz || text === kb.options.confirmation.ru) {

    if (manager) {
      if (manager.total_employees > 0) {
        await updateManyEmployees({manager: manager.telegram_id, branch: manager.branch}, {manager: 0})
      }

      if (manager.branch) {
        await updateBranch({owner: manager.owner, name: manager.branch}, {manager: 0})
      }

      await updateManager({_id: manager._id}, {branch: branch.name, total_employees: branch.total_employees, status: 'occupied'})

      data = {step: 5, status: 'provided'}
    }

    data = {step: 5, status: 'active'}

    await mkdir(join(__dirname, './../../../uploads/reports/branches', `/${branch.name}`))

    await updateBranch({_id: branch._id}, data)

    message = (lang === kb.language.uz)
      ? `Filial muvaffaqqiyatli qo'shildi. ${branch.manager ? "Menejer biriktirildi." : "Menejer birikirilmadi."}`
      : `"Филиал успешно добавлен. ${branch.manager ? "Менеджер прилагается." : "Менеджер не прилагается."}"`

  } else if (text === kb.options.not_to_confirmation.uz || text === kb.options.not_to_confirmation.ru) {
    await deleteBranch({_id: branch._id})

    message = (lang === kb.language.uz)
      ? "Filial qo'shilmadi."
      : "Филиал не добавлен."
  }

  await bot.sendMessage(chat_id, message, {reply_markup: {resize_keyboard: true, keyboard: kbb}})
}

const ownerBranch = async (bot, chat_id, text, lang) => {
  const owner = await getOwner({telegram_id: chat_id})

  const branch = await getBranch({_id: branch_id, owner: owner.telegram_id, status: 'process'})
    ? await getBranch({_id: branch_id, owner: owner.telegram_id, status: 'process'})
    : (await getBranches({owner: owner.telegram_id, status: 'process'}))[0]

  try {
    if (text === kb.owner.pages.uz.branches || text === kb.owner.pages.ru.branches) await obs0(bot, chat_id, lang)
    else if (text === kb.owner.branches.uz.all || text === kb.owner.branches.ru.all) await obs1(bot, chat_id, lang)
    else if (text === kb.owner.branches.uz.add || text === kb.owner.branches.ru.add) await obs11(bot, chat_id, lang)
    else if (text === kb.main.uz || text === kb.main.ru) await updateOwner({telegram_id: chat_id}, {step: 5})

    if (branch) {
      if (text === kb.options.back.uz) {
        await updateBranch({_id: branch._id}, {step: 6, status: 'inactive'})
        await obs0(bot, chat_id, lang)
      } else if (text !== kb.options.back.uz) {
        if (branch.step === 0) await obs12(bot, chat_id, branch._id, text, lang)
        if (branch.step === 1) await obs13(bot, chat_id, branch._id, text, lang)
        if (branch.step === 2) {
          if (text === kb.options.skipping.uz || text === kb.options.skipping.ru) await updateBranch({_id: branch._id}, {step: 3})
          if (text !== kb.options.skipping.uz || text !== kb.options.skipping.ru) await obs14(bot, chat_id, branch._id, text, lang)
        }
        if (branch.step === 3) await obs15(bot, chat_id, branch, text, lang)
        if (branch.step === 4) await obs16(bot, chat_id, branch._id, text, lang)
      }
    }

    if (owner) {
      if (owner.step === 8) {
        await obs2(bot, chat_id, text, lang)
      }

      if (owner.step === 9) {
        const branch = await getBranch({owner: owner.telegram_id, step: 5, status: 'process'})

        if (text === kb.options.back.uz || text === kb.options.back.ru) {
          await updateOwner({telegram_id: chat_id}, {step: 8})

          const data = branch.manager ? {status: 'provided'} : {status: 'active'}

          await updateBranch({owner: owner.telegram_id, step: 5, status: 'process'}, data)
        } else if (text !== kb.options.back.uz || text !== kb.options.back.ru) {
          if (branch.step === 6) {
            if (text === kb.options.owner.branch.settings.uz.name || text === kb.options.owner.branch.settings.ru.name)
              await obs3(bot, chat_id, branch._id, lang)
            if (text === kb.options.owner.branch.settings.uz.manager || text === kb.options.owner.branch.settings.ru.manager)
              await obs5(bot, chat_id, branch._id, lang)
            if (text === kb.options.owner.branch.settings.uz.image || text === kb.options.owner.branch.settings.ru.image)
              await obs7(bot, chat_id, branch._id, lang)
            if (text === kb.options.owner.branch.settings.uz.location || text === kb.options.owner.branch.settings.ru.location)
              await obs9(bot, chat_id, branch._id, lang)

            type = text
          } else if (branch.step === 7) {
            if (type === kb.options.owner.branch.settings.uz.name || type === kb.options.owner.branch.settings.ru.name)
              await obs4(bot, chat_id, branch._id, text, lang)
            if (type === kb.options.owner.branch.settings.uz.manager || type === kb.options.owner.branch.settings.ru.manager)
              await obs6(bot, chat_id, branch._id, text, lang)
            if (type === kb.options.owner.branch.settings.uz.image || type === kb.options.owner.branch.settings.ru.image)
              await obs8(bot, chat_id, branch._id, text, lang)
            if (type === kb.options.owner.branch.settings.uz.location || type === kb.options.owner.branch.settings.ru.location)
              await obs10(bot, chat_id, branch._id, text, lang)
          }
        }
      }
    }

  } catch (e) {
    console.log(e)
  }
}

module.exports = {ownerBranch}
