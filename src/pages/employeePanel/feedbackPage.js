const kb = require('../../helpers/keyboard-buttons')
const keyboard = require('../../helpers/keyboard')
const {getAllFeedback, getFeedback, makeFeedback, updateFeedback, deleteFeedback, countAllFeedback} = require('../../controllers/feedbackController')
const {getEmployee, updateEmployee} = require('../../controllers/employeeController')
const {getManager} = require('../../controllers/managerController')
const {report} = require('./../../helpers/utils')

let feedback_id

const efs0 = async (bot, chat_id, lang) => {
  let message, kbb

  if (lang === kb.language.uz) {
    message = "Izohlar bo'limi"
    kbb = keyboard.employee.feedback.uz
  } else if (lang === kb.language.ru) {
    message = "Страница комментарии"
    kbb = keyboard.employee.feedback.ru
  }

  await bot.sendMessage(chat_id, message, {reply_markup: {resize_keyboard: true, keyboard: kbb}})
}

const efs1 = async (bot, chat_id, lang) => {
  let message, kbb

  const employee = await getEmployee({telegram_id: chat_id}), manager = await getManager({telegram_id: employee.manager})

  const new_feedback = await makeFeedback({author: chat_id, branch: manager.branch, branch_owner: manager.owner, is_employee: true})

  feedback_id = new_feedback._id

  if (lang === kb.language.uz) {
    message = "Biz haqimizda nima deb o'ylaysiz"
    kbb = keyboard.options.feedback.uz
  } else if (lang === kb.language.ru) {
    message = "Что вы думаете о нас"
    kbb = keyboard.options.feedback.ru
  }

  await bot.sendMessage(chat_id, message, {reply_markup: {resize_keyboard: true, keyboard: kbb}})
}

const efs2 = async (bot, chat_id, _id, text, lang) => {
  let message, kbb

  await updateFeedback({_id}, {mark: text, step: 1})

  const feedback = await getFeedback({_id})

  if (lang === kb.language.uz) {
    message = `Nega ${feedback.mark} ligini sababini yozing`
    kbb = keyboard.options.back.uz
  } else if (lang === kb.language.ru) {
    message = `Напишите причину, по которой ${feedback.mark}`
    kbb = keyboard.options.back.ru
  }

  await bot.sendMessage(chat_id, message, {reply_markup: {resize_keyboard: true, keyboard: kbb, one_time_keyboard: true}})
}

const efs3 = async (bot, chat_id, _id, text, lang) => {
  let message, kbb

  await updateFeedback({_id}, {reason: text, step: 2, status: 'active'})

  const feedback = await getFeedback({_id}), employee = await getEmployee({telegram_id: chat_id})

  if (feedback.mark === kb.options.feedback.uz.good || feedback.mark === kb.options.feedback.ru.good) {
    await updateFeedback({_id: feedback._id}, {action: 'done'})
  }

  await updateEmployee({_id: employee._id}, {$inc: {total_feedback: 1}})

  if (lang === kb.language.uz) {
    message = "Izohingiz muvaffaqiyatli qoldirildi"
    kbb = keyboard.employee.feedback.uz
  } else if (lang === kb.language.ru) {
    message = `Ваш комментарий успешно отправлен.`
    kbb = keyboard.employee.feedback.ru
  }

  await bot.sendMessage(chat_id, message, {reply_markup: {resize_keyboard: true, keyboard: kbb}})
}

const efs4 = async (bot, chat_id, lang) => {
  let message = ''

  const
    count = await countAllFeedback({author: chat_id}),
    process = await countAllFeedback({author: chat_id, status: 'process'}),
    active = await countAllFeedback({author: chat_id, status: 'active'}),
    inactive = await countAllFeedback({author: chat_id, status: 'inactive'}),
    seen = await countAllFeedback({author: chat_id, status: 'seen'}),
    done = await countAllFeedback({author: chat_id, status: 'done'})

  if (count > 0) {
    const data = {number: count, process, active, inactive, seen, done}

    message = report(data, 'FEEDBACK_ALL', lang)
  } else if (count <= 0) {
    message = "Hozircha siz fikr qoldirmagansiz"
  }

  await bot.sendMessage(chat_id, message)
}

const efs5 = async (bot, chat_id, _id, lang) => {
  await deleteFeedback({_id})
  await efs0(bot, chat_id, lang)
}

const employeeFeedback = async (bot, chat_id, text, lang) => {

  const feedback = await getFeedback({_id: feedback_id, status: 'process'})
    ? await getFeedback({_id: feedback_id, status: 'process'})
    : (await getAllFeedback({author: chat_id, status: 'process'}))[0]

  try {
    if (text === kb.employee.pages.uz.feedback || text === kb.employee.pages.ru.feedback) await efs0(bot, chat_id, lang)
    else if (text === kb.employee.feedback.uz.add || text === kb.employee.feedback.ru.add) await efs1(bot, chat_id, lang)
    else if (text === kb.employee.feedback.uz.my_feedback || text === kb.employee.feedback.ru.my_feedback) await efs4(bot, chat_id, lang)

    if (feedback) {
      if (text === kb.options.back.uz || text === kb.options.back.ru) {
        await efs5(bot, feedback._id, feedback.author, lang)
      } else if (text !== kb.options.back.uz || text !== kb.options.back.ru) {
        if (feedback.step === 0) await efs2(bot, chat_id, feedback._id, text, lang)
        else if (feedback.step === 1) await efs3(bot, chat_id, feedback._id, text, lang)
      }
    }
  } catch (e) {
    console.log(e)
  }
}

module.exports = {employeeFeedback}
