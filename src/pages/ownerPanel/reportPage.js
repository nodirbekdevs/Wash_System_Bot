const kb = require('./../../helpers/keyboard-buttons')
const keyboard = require('./../../helpers/keyboard')
const {existsSync} = require('fs')
const {join} = require('node:path')
const excel = require('xlsx')
const {omp} = require('./mainPage')
const {getWashes} = require('./../../controllers/washController')
const {getOwner, updateOwner} = require('./../../controllers/ownerController')
const {getManager} = require('./../../controllers/managerController')
const {getClient} = require('./../../controllers/clientController')
const {getBranches, getBranch, updateBranch} = require('./../../controllers/branchController')
const {branch_report_keyboard, get_washed_time, date_name, date, date_is_valid} = require('./../../helpers/utils')
// const {} = require('./../../../uploads/reports/branches')

let type

const ors0 = async (bot, chat_id, lang) => {
  let message = '', clause, kbb

  const branches = await getBranches({owner: chat_id, status: 'provided'})

  if (branches.length > 0) {
    clause = (lang === kb.language.uz) ? "Qaysi filialni hisobotini ko'rmoqchisiz" : "Какой партнерский отчет вы хотите видеть?"

    message = (lang === kb.language.uz) ? "Hisobotlar sahifasi." : "Страница отчетов."

    kbb = branch_report_keyboard(branches, lang)

    await updateOwner({telegram_id: chat_id}, {step: 14})

  } else if (branches.length <= 0) {
    if (lang === kb.language.uz) {
      clause = "Hali filiallar mavjud bo'lmaganligi sababli hisobotlarni ko'ra olmaysiz"
      kbb = keyboard.main.uz
    } else if (lang === kb.language.ru) {
      clause = "Вы не можете видеть отчеты, потому что еще нет филталов"
      kbb = keyboard.main.ru
    }
  }

  if (message !== '') {
    await bot.sendMessage(chat_id, message)
  }

  await bot.sendMessage(chat_id, clause, {reply_markup: {resize_keyboard: true, keyboard: kbb}})
}

const ors1 = async (bot, chat_id, text, lang) => {
  let message, kbb

  const branch = await getBranch({name: text}) ? await getBranch({name: text}) : await getBranch({_id: text})

  if (branch) {
    await updateOwner({telegram_id: chat_id}, {step: 15})

    await updateBranch({_id: branch._id}, {situation: 'report'})

    if (lang === kb.language.uz) {
      message = "1 kunikmi yoki ko'proq kunlik hisobotlarni ko'rmoqchimisiz"
      kbb = keyboard.owner.reports.uz
    } else if (lang === kb.language.ru) {
      message = "Хотите ли вы видеть отчеты за 1 день или более"
      kbb = keyboard.owner.reports.ru
    }
  } else if (!branch) {
    await updateOwner({telegram_id: chat_id}, {step: 5})

    if (lang === kb.language.uz) {
      message = "Bunday filial topilmadi"
      kbb = keyboard.owner.pages.uz
    } else if (lang === kb.language.ru) {
      message = "Такой филиал не найдено"
      kbb = keyboard.owner.pages.ru
    }
  }

  await bot.sendMessage(chat_id, message, {reply_markup: {resize_keyboard: true, keyboard: kbb}})
}

const ors2 = async (bot, chat_id, lang) => {
  await updateOwner({telegram_id: chat_id}, {step: 16})

  let message, kbb

  if (lang === kb.language.uz) {
    message = "Iltimos sanani YIL-OY-KUN shu ko'rinishda yuboring.\n Sonlarni ko'rsatilgan tarzda yuboring va har bir qo'yilgan chiziqchaga e'tibor bering"
    kbb = keyboard.options.back.uz
  } else if (lang === keyboard.options.back.ru) {
    message = "Отправьте дату в формате ГОД-МЕСЯЦ-ДЕНЬ--.\n Отправьте числа, как показано, и обратите внимание на каждую черточку"
    kbb = keyboard.options.back.ru
  }

  await bot.sendMessage(chat_id, message, {reply_markup: {resize_keyboard: true, keyboard: kbb}})
}

const ors3 = async (bot, chat_id, _id, text, lang) => {
  let file_options, message, total = 0, file, kbb

  const validation = date_is_valid(text)

  if (validation) {
    const branch = await getBranch({_id}), name = text.split('-')

    await updateOwner({telegram_id: chat_id}, {step: 15})

    file = join(__dirname, `./../../../uploads/reports/branches/${branch.name}/${name[2]}-${name[1]}-${name[0]}_${branch.name}_daily.xlsx`)

    if (existsSync(file)) {

      const sheet = excel.readFile(file, {cellDates: true}), wb = sheet.Sheets[0], data = excel.utils.sheet_to_json(wb)

      for (let i = 0; i < data.length; i++) total += data[i].benefit

      file_options = {filename: file, contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}

      if (lang === kb.language.uz) {
        message = `Qidirilgan sanada avtomobil yuvishlardan ${total} foyda ko'rilgan`
        kbb = keyboard.owner.reports.uz
      } else if (lang === kb.language.ru) {
        message = `${total} прибыли от автомоек на дату поиска`
        kbb = keyboard.owner.reports.ru
      }

      await bot.sendDocument(chat_id, file, {}, file_options)
    } else if (!existsSync(file)) {
      const washes = await getWashes({
        manager: {$gt: 0}, branch: branch.name, status: 'washed', created_at: {
          $gte: new Date(new Date(text).setHours(0o0, 0o0, 0o0)),
          $lt: new Date(new Date(text).setHours(23, 59, 59))
        }
      })

      if (washes.length > 0) {

        let daily_washes = []

        for (let i = 0; i < washes.length; i++) {
          const wash = washes[i].toJSON(), manager = await getManager({telegram_id: wash.manager}),
            washed_time = get_washed_time(wash.washed_time.started_at, wash.washed_time.washed_at),
            washed_at = date(wash.created_at)

          delete wash._id
          delete wash.washed_time
          delete wash.date
          delete wash.time
          delete wash.step
          delete wash.status
          delete wash.__v

          if (wash.client === 0) {
            delete wash.client
          } else if (wash.client > 0) {
            wash.client = (await getClient({telegram_id: wash.client})).name
          }

          wash.manager = manager.name
          wash.washed_at = washed_time
          wash.created_at = washed_at

          total += wash.benefit

          daily_washes.push(wash)
        }

        const new_workbook = excel.utils.book_new(), data = excel.utils.json_to_sheet(daily_washes),
          filename = date_name()

        file = join(__dirname, `./../../../uploads/reports/branches/${branch.name}/${name[2]}-${name[1]}-${name[0]}_${branch.name}_searched.xlsx`)

        excel.utils.book_append_sheet(new_workbook, data, filename)

        excel.writeFile(new_workbook, file)

        file_options = {
          filename: file,
          contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        }

        if (lang === kb.language.uz) {
          message = `Qidirilgan sanada avtomobil yuvishlardan ${total} foyda ko'rilgan`
          kbb = keyboard.owner.reports.uz
        } else if (lang === kb.language.ru) {
          message = `${total} прибыли от автомоек на дату поиска`
          kbb = keyboard.owner.reports.ru
        }

        await bot.sendDocument(chat_id, file, {}, file_options)
      } else if (washes.length <= 0) {
        if (lang === kb.language.uz) {
          message = "Bu vaqtda avtomobil yuvilmagan shuning uchun hisobot yo'q"
          kbb = keyboard.owner.reports.uz
        } else if (lang === kb.language.ru) {
          message = "Машину пока не мыли, так что нет отчета."
          kbb = keyboard.owner.reports.ru
        }
      }
    }
  } else if (!validation) {
    if (lang === kb.language.uz) {
      message = "Iltimos YIL-OY-KUN shu ko'rinishda yuboring"
      kbb = keyboard.options.back.uz
    } else if (lang === kb.language.ru) {
      message = "Пожалуйста, отправьте ГОД-МЕСЯЦ-ДЕНЬ в этом формате"
      kbb = keyboard.options.back.ru
    }
  }

  await bot.sendMessage(chat_id, message, {reply_markup: {resize_keyboard: true, keyboard: kbb}})
}

const ors4 = async (bot, chat_id, lang) => {
  await updateOwner({telegram_id: chat_id}, {step: 16})

  let message, kbb

  if (lang === kb.language.uz) {
    message = "Iltimos sanani YIL-OY-KUN#YIL-OY-KUN shu ko'rinishda yuboring.\n Sonlarni ko'rsatilgan tarzda yuboring va har bir qo'yilgan chiziqchaga e'tibor bering"
    kbb = keyboard.options.back.uz
  } else if (lang === keyboard.options.back.ru) {
    message = "Отправьте дату в формате ГОД-МЕСЯЦ-ДЕНЬ#ГОД-МЕСЯЦ-ДЕНЬ.\n Отправьте числа, как показано, и обратите внимание на каждую черточку"
    kbb = keyboard.options.back.ru
  }

  await bot.sendMessage(chat_id, message, {reply_markup: {resize_keyboard: true, keyboard: kbb}})
}

const ors5 = async (bot, chat_id, _id, text, lang) => {
  let message, total = 0, kbb

  const reverse = text.split('#')

  if (reverse.length === 2) {
    const start = date_is_valid(reverse[0]), end = date_is_valid(reverse[1])

    if (start && end) {
      const branch = await getBranch({_id})

      await updateOwner({telegram_id: chat_id}, {step: 15})

      const from = reverse[0].split('-'), to = reverse[1].split('-'),
        from_date = `${from[2]}-${from[1]}-${from[0]}`, to_date = `${to[2]}-${to[1]}-${to[0]}`,
        searched_date = `${from_date}_${to_date}`,
        file = join(__dirname, `./../../../uploads/reports/branches/${branch.name}/${searched_date}_${branch.name}_searched.xlsx`)

      if (existsSync(file)) {

        const sheet = excel.readFile(file, {cellDates: true}), wb = sheet.Sheets[0],
          data = excel.utils.sheet_to_json(wb)

        for (let i = 0; i < data.length; i++) total += data[i].toJSON.benefit

        const file_options = {
          filename: file,
          contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        }

        if (lang === kb.language.uz) {
          message = `Qidirilgan sanalr oralig'ida avtomobil yuvishlardan ${total} foyda ko'rilgan`
          kbb = keyboard.owner.reports.uz
        } else if (lang === kb.language.ru) {
          message = `${total} прибыли от автомоек в указанном диапазоне дат`
          kbb = keyboard.owner.reports.ru
        }

        await bot.sendDocument(chat_id, file, {}, file_options)
      } else if (!existsSync(file)) {
        const washes = await getWashes({
          manager: {$gt: 0}, branch: branch.name, status: 'washed', created_at: {
            $gte: new Date(new Date(reverse[0]).setHours(0o0, 0o0, 0o0)),
            $lt: new Date(new Date(reverse[1]).setHours(23, 59, 59))
          }
        })

        if (washes.length > 0) {
          let daily_washes = []

          for (let i = 0; i < washes.length; i++) {
            const wash = washes[i].toJSON(), manager = await getManager({telegram_id: wash.manager}),
              washed_time = get_washed_time(wash.washed_time.started_at, wash.washed_time.washed_at),
              washed_at = date(wash.created_at)

            delete wash._id
            delete wash.washed_time
            delete wash.date
            delete wash.time
            delete wash.step
            delete wash.status
            delete wash.__v

            if (wash.client === 0) {
              delete wash.client
            } else if (wash.client > 0) {
              wash.client = (await getClient({telegram_id: wash.client})).name
            }

            wash.manager = manager.name
            wash.washed_at = washed_time
            wash.created_at = washed_at

            total += wash.benefit

            daily_washes.push(wash)
          }

          const new_workbook = excel.utils.book_new(), data = excel.utils.json_to_sheet(daily_washes)

          excel.utils.book_append_sheet(new_workbook, data, searched_date)

          excel.writeFile(new_workbook, file)

          const file_options = {
            filename: file,
            contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          }

          if (lang === kb.language.uz) {
            message = `Qidirilgan sanalr oralig'ida avtomobil yuvishlardan ${total} foyda ko'rilgan`
            kbb = keyboard.owner.reports.uz
          } else if (lang === kb.language.ru) {
            message = `${total} прибыли от автомоек в указанном диапазоне дат`
            kbb = keyboard.owner.reports.ru
          }

          await bot.sendDocument(chat_id, file, {}, file_options)
        } else if (washes.length <= 0) {
          if (lang === kb.language.uz) {
            message = "Bu vaqt oralig'ida mashina yuvilmagan shuning uchun hisobot yo'q"
            kbb = keyboard.owner.reports.uz
          } else if (lang === kb.language.ru) {
            message = "Машину пока не мыли, так что нет отчета."
            kbb = keyboard.owner.reports.ru
          }
        }
      }
    } else if (!start || !end) {
      if (lang === kb.language.uz) {
        message = "Iltimos YIL-OY-KUN#YIL-OY-KUN shu ko'rinishda yuboring"
        kbb = keyboard.options.back.uz
      } else if (lang === kb.language.ru) {
        message = 'Пожалуйста, отправьте как ГОД-МЕСЯЦ-ДЕНЬ#ГОД-МЕСЯЦ-ДЕНЬ'
        kbb = keyboard.options.back.ru
      }
    }
  } else if (reverse.length !== 2) {
    if (lang === kb.language.uz) {
      message = "Iltimos YIL-OY-KUN#YIL-OY-KUN shu ko'rinishda yuboring"
      kbb = keyboard.options.back.uz
    } else if (lang === kb.language.ru) {
      message = 'Пожалуйста, отправьте как ГОД-МЕСЯЦ-ДЕНЬ#ГОД-МЕСЯЦ-ДЕНЬ'
      kbb = keyboard.options.back.ru
    }
  }


  await bot.sendMessage(chat_id, message, {reply_markup: {resize_keyboard: true, keyboard: kbb}})
}

const ors6 = async (bot, chat_id, lang) => {
  await updateOwner({telegram_id: chat_id}, {step: 14})
  await updateBranch({owner: chat_id, situation: 'report'}, {situation: ''})
  await ors0(bot, chat_id, lang)
}

const ors7 = async (bot, chat_id, lang) => {
  let message, kbb

  await updateOwner({telegram_id: chat_id}, {step: 15})

  if (lang === kb.language.uz) {
    message = "1 kunikmi yoki ko'proq kunlik hisobotlarni ko'rmoqchimisiz"
    kbb = keyboard.owner.reports.uz
  } else if (lang === kb.language.ru) {
    message = "Хотите ли вы видеть отчеты за 1 день или более"
    kbb = keyboard.owner.reports.ru
  }

  await bot.sendMessage(chat_id, message, {reply_markup: {resize_keyboard: true, keyboard: kbb}})
}

const ors8 = async (bot, chat_id, lang) => {
  await updateOwner({telegram_id: chat_id}, {step: 5})
  await omp(bot, chat_id, lang)
}

const ownerReports = async (bot, chat_id, text, lang) => {
  const owner = await getOwner({telegram_id: chat_id}), branch = await getBranch({owner: chat_id, situation: 'report'})

  try {
    if (text === kb.owner.pages.uz.reports || text === kb.owner.pages.ru.reports) await ors0(bot, chat_id, lang)

    if (owner) {
      if (owner.step === 14) {
        if (text === kb.main.uz || text === kb.main.ru) await ors8(bot, chat_id, lang)
        if (text !== kb.options.back.ru || text !== kb.options.back.ru) await ors1(bot, chat_id, text, lang)
      }

      if (owner.step === 15) {
        if (text === kb.options.back.uz || text === kb.options.back.ru) await ors6(bot, chat_id, lang)

        if (text !== kb.options.back.uz || text !== kb.options.back.ru) {
          if (text === kb.owner.reports.uz.one_day || text === kb.owner.reports.ru.one_day) await ors2(bot, chat_id, lang)
          if (text === kb.owner.reports.uz.other_days || text === kb.owner.reports.ru.other_days) await ors4(bot, chat_id, lang)
          type = text
        }
      }

      if (owner.step === 16) {
        if (text === kb.options.back.uz || text === kb.options.back.ru) await ors7(bot, chat_id, lang)
        else if (text !== kb.options.back.uz || text !== kb.options.back.ru) {
          if (type === kb.owner.reports.uz.one_day || type === kb.owner.reports.ru.one_day) await ors3(bot, chat_id, branch._id, text, lang)
          if (type === kb.owner.reports.uz.other_days || type === kb.owner.reports.ru.other_days) await ors5(bot, chat_id, branch._id, text, lang)
        }
      }
    }
  } catch (e) {
    console.log(e)
  }
}

module.exports = {ownerReports}
