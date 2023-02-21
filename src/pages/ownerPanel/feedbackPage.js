const kb = require('./../../helpers/keyboard-buttons')
const keyboard = require('./../../helpers/keyboard')
const {getAllFeedback, getFeedback, updateFeedback, countAllFeedback} = require('./../../controllers/feedbackController')
const {report, date} = require('./../../helpers/utils')
const {getEmployee} = require('./../../controllers/employeeController')
const {getClient} = require('./../../controllers/clientController')

const ofs0 = async (bot, chat_id, lang) => {
  let message, kbb

  if (lang === kb.language.uz) {
    message = 'Izohlar sahifasi'
    kbb = keyboard.owner.feedback.uz
  } else if (lang === kb.language.ru) {
    message = 'Страница комментариев'
    kbb = keyboard.owner.feedback.ru
  }

  await bot.sendMessage(chat_id, message, {reply_markup: {resize_keyboard: true, keyboard: kbb}})
}

const ofs1 = async (bot, chat_id, lang) => {
  const number = await countAllFeedback({}), process = await countAllFeedback({status: 'process'}),
    active = await countAllFeedback({status: 'active'}), inactive = await countAllFeedback({status: 'inactive'}),
    seen = await countAllFeedback({status: 'seen'}), done = await countAllFeedback({status: 'done'})

  const data = {number, process, active, inactive, seen, done}

  const message = report(data, 'FEEDBACK_ALL', lang)

  await bot.sendMessage(chat_id, message)
}

const ofs2 = async (bot, chat_id, lang) => {
  let message, kbb

  const allFeedback = await getAllFeedback({branch_owner: chat_id, is_read: false, status: 'active'})

  for (let i = 0; i < allFeedback.length; i++) {
    const feedback = allFeedback[i], created_at = date(feedback.created_at)

    const author = feedback.is_employee
      ? await getEmployee({telegram_id: feedback.author})
      : await getClient({telegram_id: feedback.author})

    const data = {
      author: author.name,
      branch: feedback.branch,
      type: feedback.is_employee,
      mark: feedback.mark,
      reason: feedback.reason,
      status: feedback.status,
      created_at
    }

    const send_text = (lang === kb.language.uz) ? "Muommoni ko'rish boshlandi" : "Видение проблемы началось"

    let clause = report(data, 'FEEDBACK', lang)

    await bot.sendMessage(chat_id, clause, {
      reply_markup: {
        inline_keyboard: [[{text: send_text, callback_data: JSON.stringify({phrase: 'seen', id: feedback._id})}]]
      }
    })

    clause = ""

    await updateFeedback({_id: feedback._id}, {is_read: true})
  }

  if (lang === kb.language.uz) {
    message = "Hozirgacha yozigan yangi izohlar"
    kbb = keyboard.owner.feedback.uz
  } else if (lang === kb.language.ru) {
    message = "Добавлены новые комментарии"
    kbb = keyboard.owner.feedback.ru
  }

  await bot.sendMessage(chat_id, message, {reply_markup: {resize_keyboard: true, keyboard: kbb}})
}

const ofs3 = async (bot, chat_id, lang) => {
  let message, kbb

  const allFeedback = await getAllFeedback({branch_owner: chat_id, is_read: true, status: 'seen'})

  for (let i = 0; i < allFeedback.length; i++) {
    const feedback = allFeedback[i], created_at = date(feedback.created_at)

    const author = feedback.is_employee
      ? await getEmployee({telegram_id: feedback.author})
      : await getClient({telegram_id: feedback.author})

    const data = {
      author: author.name,
      branch: feedback.branch,
      type: feedback.is_employee,
      mark: feedback.mark,
      reason: feedback.reason,
      status: feedback.status,
      created_at
    }

    const send_text = (lang === kb.language.uz) ? "Muommoni hal qilindi" : "Проблема решена"

    let clause = report(data, 'FEEDBACK', lang)

    await bot.sendMessage(chat_id, clause, {
      reply_markup: {
        inline_keyboard: [[{text: send_text, callback_data: JSON.stringify({phrase: 'done', id: feedback._id})}]]
      }
    })

    clause = ""
  }

  if (lang === kb.language.uz) {
    message = "Yechimini kutayotgan izohlar"
    kbb = keyboard.owner.feedback.uz
  } else if (lang === kb.language.ru) {
    message = "Комментарии ожидают решения"
    kbb = keyboard.owner.feedback.ru
  }

  await bot.sendMessage(chat_id, message, {reply_markup: {resize_keyboard: true, keyboard: kbb}})
}

const ofs4 = async (bot, chat_id, message_id, text, _id, lang) => {
  let message, clause

  const feedback = await getFeedback({_id})

  const author = feedback.is_employee
    ? await getEmployee({telegram_id: feedback.author})
    : await getClient({telegram_id: feedback.author})

  const data = {name: author.name, feedback: feedback.reason},
    kbb = (lang === kb.language.uz) ? keyboard.owner.feedback.uz : keyboard.owner.feedback.ru

  await bot.deleteMessage(chat_id, message_id)

  if (text === 'seen') {
    message = (lang === kb.language.uz)
      ? "Bu izoh ustida ishlar boshlangan"
      : "Этот комментарий находится в обработке"

    if (feedback.status === 'active') {
      await updateFeedback({_id: feedback._id}, {status: 'seen'})

      message = report(data, 'FEEDBACK_SEEN', author.lang)

      clause = (lang === kb.language.uz) ? "Bu izoh ustida ishlar boshlandi" : "Начата работа над этим комментарием"
    }
  }

  if (text === 'done') {
    message = (lang === kb.language.uz)
      ? "Bu izoh ustida ishlar tugallangan. Muammo bartaraf etilgan."
      : "Этот комментарий завершен. Проблема решена."

    if (feedback.status === 'seen') {
      await updateFeedback({_id: feedback._id}, {status: 'done'})

      message = report(data, 'FEEDBACK_DONE', author.lang)

      clause = (lang === kb.language.uz) ? "Izoh muvaffaqqiyatli bajarildi" : "Комментарий завершен успешно"
    }
  }

  await bot.sendMessage(feedback.author, message)

  await bot.sendMessage(chat_id, clause, {reply_markup: {resize_keyboard: true, keyboard: kbb}})
}


const ownerFeedback = async (bot, chat_id, text, lang) => {
  try {
    if (text === kb.owner.pages.uz.feedback || text === kb.owner.pages.ru.feedback) await ofs0(bot, chat_id, lang)
    if (text === kb.owner.feedback.uz.number || text === kb.owner.feedback.ru.number) await ofs1(bot, chat_id, lang)
    if (text === kb.owner.feedback.uz.read || text === kb.owner.feedback.ru.read) await ofs2(bot, chat_id, lang)
    if (text === kb.owner.feedback.uz.doing || text === kb.owner.feedback.ru.doing) await ofs3(bot, chat_id, lang)
  } catch (e) {
    console.log(e)
  }
}

module.exports = {ownerFeedback, ofs4}
