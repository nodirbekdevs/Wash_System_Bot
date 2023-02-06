const kb = require('./../../helpers/keyboard-buttons')
const keyboard = require('./../../helpers/keyboard')
const {getBranch} = require('./../../controllers/branchController')
const {getManager} = require('./../../controllers/managerController')
const {getEmployee} = require('./../../controllers/employeeController')
const {date, bio} = require('./../../helpers/utils')

const ebs0 = async (bot, chat_id, lang) => {
  const employee = await getEmployee({telegram_id: chat_id}), manager = await getManager({telegram_id: employee.manager}),
    branch = await getBranch({owner: manager.owner, manager: manager.telegram_id, name: manager.branch}),
    kbb = (lang === kb.language.uz) ? keyboard.manager.pages.uz : keyboard.manager.pages.ru,
    started_at = date(branch.created_at)

  const data = {
    manager: manager.name,
    name: branch.name,
    location: branch.location.name,
    total_employees: branch.total_employees,
    total_washes: branch.total_washes,
    created_at: started_at
  }

  const message = bio(data, 'MANAGER_BRANCH', lang)

  await bot.sendLocation(chat_id, branch.location.latitude, branch.location.longitude)

  await bot.sendPhoto(chat_id, branch.image, {caption: message, reply_markup: {resize_keyboard: true, keyboard: kbb}})
}

const employeeBranch = async (bot, chat_id, text, lang) => {
  if (text === kb.manager.pages.uz.branch || text === kb.manager.pages.ru.branch) await ebs0(bot, chat_id, lang)
}

module.exports = {employeeBranch}
