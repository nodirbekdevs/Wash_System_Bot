const kb = require('./../../helpers/keyboard-buttons')
const keyboard = require('./../../helpers/keyboard')
const {getFeedback, updateFeedback, countAllFeedback} = require('./../../controllers/feedbackController')
const {report, date, feedback_seen_pagination, feedback_done_pagination} = require('./../../helpers/utils')
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

  await bot.sendMessage(chat_id, message, {
    reply_markup: {resize_keyboard: true, keyboard: kbb, one_time_keyboard: true}
  })
}

const ofs1 = async (bot, chat_id, lang) => {
  const number = await countAllFeedback({}), process = await countAllFeedback({status: 'process'}),
    active = await countAllFeedback({status: 'active'}), inactive = await countAllFeedback({status: 'inactive'}),
    seen = await countAllFeedback({status: 'seen'}), done = await countAllFeedback({status: 'done'})

  const data = {number, process, active, inactive, seen, done}

  const message = report(data, 'FEEDBACK_ALL', lang), kbb = (lang === kb.language.uz)
    ? keyboard.owner.feedback.uz : keyboard.owner.feedback.ru

  await bot.sendMessage(chat_id, message, {reply_markup: {resize_keyboard: true, keyboard: kbb, one_time_keyboard: true}})
}

const ofs2 = async (bot, chat_id, lang) => {
  const query = {branch_owner: chat_id, is_read: false, status: 'active'}

  const report = await feedback_seen_pagination(1, 6, query, lang)

  // for (let i = 0; i < allFeedback.length; i++) {
  //   const feedback = allFeedback[i], created_at = date(feedback.created_at)
  //
  //   const author = feedback.is_employee
  //     ? await getEmployee({telegram_id: feedback.author})
  //     : await getClient({telegram_id: feedback.author})
  //
  //   const data = {
  //     author: author.name, branch: feedback.branch, type: feedback.is_employee, mark: feedback.mark,
  //     reason: feedback.reason, status: feedback.status, created_at
  //   }
  //
  //   const send_text = (lang === kb.language.uz) ? "Muommoni ko'rish boshlandi" : "Видение проблемы началось"
  //
  //   let clause = report(data, 'FEEDBACK', lang)
  //
  //   await bot.sendMessage(chat_id, clause, {
  //     reply_markup: {
  //       inline_keyboard: [[{text: send_text, callback_data: JSON.stringify({phrase: 'seen', id: feedback._id})}]]
  //     }
  //   })
  //
  //   clause = ""
  //
  //   await updateFeedback({_id: feedback._id}, {is_read: true})
  // }

  if (report.kw === 'YES') {
    await bot.sendMessage(chat_id, report.text, {parse_mode: 'HTML', reply_markup: report.kbs.reply_markup})

    const message = lang === kb.language.uz ? "Hozirgacha yozilgan yangi izohlar" : "Добавлены новые комментарии"

    await bot.sendMessage(chat_id, message)
  } else if (report.kw === 'NO') {
    await bot.sendMessage(chat_id, report.text, report.kbs)
  }
}

const ofs3 = async (bot, chat_id, lang) => {
  const query = {branch_owner: chat_id, is_read: true, status: 'seen'}

  const report = await feedback_done_pagination(1, 6, query, lang)

  // for (let i = 0; i < allFeedback.length; i++) {
  //   const feedback = allFeedback[i], created_at = date(feedback.created_at)
  //
  //   const author = feedback.is_employee
  //     ? await getEmployee({telegram_id: feedback.author})
  //     : await getClient({telegram_id: feedback.author})
  //
  //   const data = {
  //     author: author.name, branch: feedback.branch, type: feedback.is_employee, mark: feedback.mark,
  //     reason: feedback.reason, status: feedback.status, created_at
  //   }
  //
  //   const send_text = (lang === kb.language.uz) ? "Muommoni ko'rish boshlandi" : "Видение проблемы началось"
  //
  //   let clause = report(data, 'FEEDBACK', lang)
  //
  //   await bot.sendMessage(chat_id, clause, {
  //     reply_markup: {
  //       inline_keyboard: [[{text: send_text, callback_data: JSON.stringify({phrase: 'seen', id: feedback._id})}]]
  //     }
  //   })
  //
  //   clause = ""
  //
  //   await updateFeedback({_id: feedback._id}, {is_read: true})
  // }

  if (report.kw === 'YES') {
    await bot.sendMessage(chat_id, report.text, {parse_mode: 'HTML', reply_markup: report.kbs.reply_markup})

    const message = lang === kb.language.uz ? "Hozirgacha bajarilayotgan izohlar" : "Комментарии пока в обработке"

    await bot.sendMessage(chat_id, message)
  } else if (report.kw === 'NO') {
    await bot.sendMessage(chat_id, report.text, report.kbs)
  }
}

const ofs4 = async (bot, chat_id, query_id, message_id, data, _id, lang) => {
  let query, report, kbb

  if ((data[0] === 'left' || data[0] === 'right') && data[1] === 'selfeedback') {
    query = {branch_owner: chat_id, is_read: false, status: 'active'}

    report = await feedback_seen_pagination(parseInt(data[2]), 6, query, lang)
  }

  if ((data[0] === 'left' || data[0] === 'right') && data[1] === 'dofeedback') {
    query = {branch_owner: chat_id, is_read: true, status: 'seen'}

    report = await feedback_done_pagination(parseInt(data[2]), 6, query, lang)
  }

  if (report) {
    kbb = report.kbs.reply_markup

    await bot.editMessageText(report.text, {chat_id, message_id, parse_mode: 'HTML', reply_markup: kbb})
  }
}

const ofs5 = async (bot, chat_id, query_id, message_id, data, _id, lang) => {
  let message, clause, back

  if (data === 'se_feed') {
    const feedback = await getFeedback({_id})

    const created_at = date(feedback.created_at)

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

    message = report(data, 'FEEDBACK', lang)

    if (lang === kb.language.uz) {
      clause = "Muommoni ko'rish boshlandi"
      back = kb.options.back.uz
    } else if (lang === kb.language.ru) {
      clause = "Видение проблемы началось"
      back = kb.options.back.ru
    }

    await bot.editMessageText(message, {
      chat_id, message_id, parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [
          [{text: clause, callback_data: JSON.stringify({phrase: "seen", id: feedback._id})}],
          [{text: back, callback_data: JSON.stringify({phrase: "fsb", id: ''})}],
        ]
      }
    })
  }

  if (data === 'do_feed') {
    const feedback = await getFeedback({_id})

    const created_at = date(feedback.created_at)

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

    message = report(data, 'FEEDBACK', lang)

    if (lang === kb.language.uz) {
      clause = "Muommoni hal qilindi"
      back = kb.options.back.uz
    } else if (lang === kb.language.ru) {
      clause = "Проблема решена"
      back = kb.options.back.ru
    }

    await bot.editMessageText(message, {
      chat_id, message_id, parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [
          [{text: clause, callback_data: JSON.stringify({phrase: "done", id: feedback._id})}],
          [{text: back, callback_data: JSON.stringify({phrase: "fdb", id: ''})}],
        ]
      }
    })
  }
}

const ofs6 = async (bot, chat_id, query_id, message_id, data, _id, lang) => {
  let message, clause

  if (data === 'seen') {
    const feedback = await getFeedback({_id})

    const author = feedback.is_employee
      ? await getEmployee({telegram_id: feedback.author})
      : await getClient({telegram_id: feedback.author})

    const data2 = {name: author.name, feedback: feedback.reason}

    if (feedback.status === 'active') {
      await updateFeedback({_id: feedback._id}, {is_read: true, status: 'seen'})
      message = report(data2, 'FEEDBACK_SEEN', author.lang)

      clause = (lang === kb.language.uz) ? "Bu izoh ustida ishlar boshlandi" : "Начата работа над этим комментарием"
    }

    await bot.sendMessage(feedback.author, message)

    await bot.sendMessage(chat_id, clause)
  }

  const query = {branch_owner: chat_id, is_read: false, status: 'active'}

  const information = await feedback_seen_pagination(1, 6, query, lang)


  if (information.kw === 'YES') {
    await bot.editMessageText(information.text, {
      chat_id, message_id, parse_mode: 'HTML', reply_markup: information.kbs.reply_markup
    })
  } else if (information.kw === 'NO') {
    await bot.deleteMessage(chat_id, message_id)

    await bot.sendMessage(chat_id, information.text, {reply_markup: information.kbs.reply_markup})
  }
}

const ofs7 = async (bot, chat_id, query_id, message_id, data, _id, lang) => {
  let message, clause

  if (data === 'done') {
    const feedback = await getFeedback({_id})

    const author = feedback.is_employee
      ? await getEmployee({telegram_id: feedback.author})
      : await getClient({telegram_id: feedback.author})

    const data2 = {name: author.name, feedback: feedback.reason}

    if (feedback.status === 'seen') {
      await updateFeedback({_id: feedback._id}, {status: 'done'})
      message = report(data2, 'FEEDBACK_DONE', author.lang)

      clause = (lang === kb.language.uz) ? "Muommoni hal qilindi" : "Проблема решена"
    }

    await bot.sendMessage(feedback.author, message)

    await bot.sendMessage(chat_id, clause)
  }

  const query = {branch_owner: chat_id, is_read: true, status: 'seen'}

  const information = await feedback_done_pagination(1, 6, query, lang)

  if (information.kw === 'YES') {
    await bot.editMessageText(information.text, {
      chat_id, message_id, parse_mode: 'HTML', reply_markup: information.kbs.reply_markup
    })
  } else if (information.kw === 'NO') {
    await bot.deleteMessage(chat_id, message_id)

    await bot.sendMessage(chat_id, information.text, {reply_markup: information.kbs.reply_markup})
  }
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

module.exports = {ownerFeedback, ofs4, ofs5, ofs6, ofs7}
