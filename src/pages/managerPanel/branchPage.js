const kb = require('./../../helpers/keyboard-buttons')
const keyboard = require('./../../helpers/keyboard')
const {getBranch} = require('./../../controllers/branchController')
const {getManager} = require('./../../controllers/managerController')
const {getOwner} = require('./../../controllers/ownerController')
const {date, report} = require('./../../helpers/utils')

const mbs0 = async (bot, chat_id, lang) => {
  let message

  const manager = await getManager({telegram_id: chat_id}), owner = await getOwner({telegram_id: manager.owner}),
    branch = await getBranch({owner: manager.owner, manager: manager.telegram_id, name: manager.branch}),
    kbb = (lang === kb.language.uz) ? keyboard.manager.pages.uz : keyboard.manager.pages.ru

  if (branch) {
    const started_at = date(branch.created_at)

    const data = {
      owner: owner.name, manager: manager.name, name: branch.name, location: branch.location.name,
      total_employees: branch.total_employees, total_washes: branch.total_washes, created_at: started_at
    }

    message = report(data, 'MANAGER_BRANCH', lang)

    await bot.sendLocation(chat_id, branch.location.latitude, branch.location.longitude)

    await bot.sendPhoto(chat_id, branch.image, {caption: message, reply_markup: {resize_keyboard: true, keyboard: kbb}})
  } else if (!branch) {
    message = (lang === kb.language.uz) ? "Sizga hali filial biriktirilmagan." : "Вам еще не назначена филиал."

    await bot.sendMessage(chat_id, message, {reply_markup: {resize_keyboard: true, keyboard: kbb}})
  }

}

const managerBranch = async (bot, chat_id, text, lang) => {
  if (text === kb.manager.pages.uz.branch || text === kb.manager.pages.ru.branch) await mbs0(bot, chat_id, lang)
}

module.exports = {managerBranch}
