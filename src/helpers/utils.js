const kb = require('./keyboard-buttons')
const keyboard = require('./keyboard')
const {getCars, getCarPagination} = require('./../controllers/carController')
const {getOwners, getOwnerPagination, getOwner} = require('./../controllers/ownerController')
const {getWashes, getWashPagination} = require('./../controllers/washController')
const {getFees, getFeePagination} = require('./../controllers/feeController')
const {getEmployees, getEmployeePagination, getEmployee} = require('./../controllers/employeeController')
const {getAllFeedback, getFeedbackPagination} = require('./../controllers/feedbackController')
const {getManager} = require('./../controllers/managerController')
const {getClient} = require('./../controllers/clientController')


const report = (data, kw, lang) => {
  let message = ''

  if (kw === 'ADMIN') {
    message += 'Ma\'lumotlaringiz: \n'
    message += `Ismingiz - ${data.name}.\n`
    message += `Telefon raqamingiz - ${data.number}.\n`
    message += `Username - ${data.username}.\n`
    message += `\nNimani o'zgartirmoqchisiz`
  }

  if (kw === 'ADMIN_OWNER') {
    message += "Xo'jayin ma'lumotlari: \n"
    message += `Ismi - ${data.name}.\n`
    message += `Username - ${data.username}.\n`
    message += `Telefon raqami - ${data.number}.\n`
    message += `Filiallar soni - ${data.total_branches}.\n`
    message += `Menejerlar soni - ${data.total_managers}.\n`
    message += `Ishlatish holati - ${data.is_paid ? "To'langan" : "To'lanmagan"}.\n`
    message += `Hisobi - ${data.balance}.\n`
    message += `Tanlangan til - ${data.lang}.\n`
    message += `Holati - ${data.status}.\n`
    message += `Qo'shilgan vaqti - ${data.created_at}.\n`
  }

  if (kw === 'OWNER') {
    if (lang === kb.language.uz) {
      message += "Xo'jayin ma'lumotlari: \n"
      message += `Ismingiz - ${data.name}.\n`
      message += `Telefon raqamingiz - ${data.number}.\n`
      message += `Tanlangan til - ${data.lang}.\n`
    } else if (lang === kb.language.ru) {
      message += `Информация о босса:\n`
      message += `Ваше имя - ${data.name}.\n`
      message += `Ваш номер телефона - ${data.number}.\n`
      message += `Выбранный вами язык - ${data.lang}\n`
    }
  }

  if (kw === 'MANAGER') {
    if (lang === kb.language.uz) {
      message += "Menejer ma'lumotlari: \n"
      message += `Filial - ${data.branch}.\n`
      message += `Ism - ${data.name}.\n`
      message += `Telefon raqam - ${data.number}.\n`
      message += `Tanlangan til - ${data.lang}.\n`
    } else if (lang === kb.language.ru) {
      message += `Информация о менеджере:\n`
      message += `Филиал - ${data.branch}.\n`
      message += `Имя - ${data.name}.\n`
      message += `Номер телефона - +${data.number}.\n`
      message += `Выбранный язык - ${data.lang}\n`
    }
  }

  if (kw === 'BRANCH') {
    if (lang === kb.language.uz) {
      message += "Filial ma'lumotlari: \n"
      message += `Nomi - ${data.name} \n`
      message += `Menejeri - ${data.manager} \n`
      message += `Manzili - ${data.location.name} \n`
    } else if (lang === kb.language.ru) {
      message += `Информация о филиале: \n`
      message += `Название - ${data.name} \n`
      message += `Менеджер - ${data.manager} \n`
      message += `Адрес - ${data.location.name} \n`
    }
  }

  if (kw === 'MANAGER_BRANCH') {
    if (lang === kb.language.uz) {
      message += "Filial ma'lumotlari: \n"
      message += `Xo'jayin: ${data.owner}\n`
      message += `Menejer: ${data.manager}\n`
      message += `Nomi - ${data.name} \n`
      message += `Manzili - ${data.location} \n`
      message += `Barcha xodimlar - ${data.total_employees} \n`
      message += `Barcha yuvishlar - ${data.total_washes} \n`
      message += `Ish boshlagan vaqt - ${data.created_at} \n`
    } else if (lang === kb.language.ru) {
      message += `Босс: ${data.owner}\n`
      message += `Менеджер: ${data.manager}\n`
      message += `Название - ${data.name} \n`
      message += `Адрес - ${data.location} \n`
      message += `Все сотрудники - ${data.total_employees} \n`
      message += `Все мойки - ${data.total_washes} \n`
      message += `Время начала - ${data.created_at} \n`


      message += "Информация о филиале: \n"
      message += `Название - ${data.name} \n`
      message += `Менеджер - ${data.manager} \n`
      message += `Адрес - ${data.location.name} \n`
    }
  }

  if (kw === 'FEEDBACK_ALL') {
    if (lang === kb.language.uz) {
      message += `Umumiy izohlar soni - ${data.number}\n`
      message += `Tugallanmagan izohlar soni - ${data.process}\n`
      message += `Qabul qilingan izohlar soni - ${data.active}\n`
      message += `Qabul qilinmagan izohlar soni - ${data.inactive}\n`
      message += `\nKo'rilgan izohlar soni - ${data.seen}\n`
      message += `Amalga oshirilgan izohlar soni - ${data.done}`
    } else if (lang === kb.language.ru) {
      message += `Общее количество комментариев - ${data.number}\n`
      message += `Количество неполных комментариев - ${data.process}\n`
      message += `Количество полученных комментариев - ${data.active}\n`
      message += `Количество неполученных комментариев - ${data.inactive}\n`
      message += `\nКоличество просмотренных комментариев - ${data.seen}\n`
      message += `Количество сделанных комментариев - ${data.done}`
    }
  }

  if (kw === 'FEEDBACK') {
    if (lang === kb.language.uz) {
      message += `Avtor - ${data.author}\n`
      message += `Filial - ${data.branch}\n`
      message += `Avtor turi - ${data.type ? 'Xodim' : 'Mijoz'}\n`
      message += `Bahosi - ${data.mark}\n`
      message += `Sababi - ${data.reason}\n`
      message += `Holati - ${data.status}\n`
      message += `Yozilgan vaqti - ${data.created_at}`
    } else if (lang === kb.language.ru) {
      message += `Автор - ${data.author}\n`
      message += `Филиал - ${data.branch}\n`
      message += `Тип автора - ${data.type ? 'Сотрудник' : 'Клиент'}\n`
      message += `Рейтинг - ${data.mark}\n`
      message += `Причина - ${data.reason}\n`
      message += `Статус - ${data.status}`
      message += `Записанное время - ${data.created_at}`
    }
  }

  if (kw === 'FEEDBACK_SEEN') {
    if (lang === kb.language.uz) {
      message += `Assalomu Aleykum ${data.name}\n`
      message += `Siz yozgan izoh ustida ishlar boshlandi\n`
      message += `Izoh - ${data.feedback}`
    } else if (lang === kb.language.ru) {
      message += `Assalomu Aleykum ${data.name}\n`
      message += `Ваш комментарий обработан\n`
      message += `Комментария - ${data.feedback}`
    }
  }

  if (kw === 'FEEDBACK_DONE') {
    if (lang === kb.language.uz) {
      message += `Assalomu Aleykum ${data.name}\n`
      message += `Siz yozgan izoh ustida ishlar tugallandi. Muammo bartaraf etildi\n`
      message += `Izoh - ${data.feedback}`
    } else if (lang === kb.language.ru) {
      message += `Assalomu Aleykum ${data.name}\n`
      message += `Ваш комментарий обработан. Проблема решена\n`
      message += `Комментария - ${data.feedback}`
    }
  }

  if (kw === "ADVERTISING") {
    message += `<b>${data.title}</b>\n`
    message += `\n<pre>${data.description}</pre>`
  }

  if (kw === "WASH") {
    if (lang === kb.language.uz) {
      message += `Xodim - ${data.employee}\n`
      message += `Filial - ${data.branch}\n`
      message += `Tarif - ${data.fee}\n`
      message += `Mashina - ${data.car}\n`
      message += `Mashina turi - ${data.car_type}\n`
      message += `Mashina raqami - ${data.car_number}\n`
      message += `Narxi - ${data.price}\n`
      message += `Kassa - ${data.cash}\n`
      message += `Sof foyda - ${data.benefit}\n`
      message += `Boshlangan vaqt - ${data.washing_time_started}\n`
      message += `Tugallangan vaqt - ${data.washing_time_ended}`
    } else if (lang === kb.language.ru) {
      message += `Сотрудник - ${data.employee}\n`
      message += `Филиал - ${data.branch}\n`
      message += `Тариф - ${data.fee}\n`
      message += `Автомобиль - ${data.car}\n`
      message += `Тип втомобилья - ${data.car_type}\n`
      message += `Номер автомобиля - ${data.car_number}\n`
      message += `Цена - ${data.price}\n`
      message += `Касса - ${data.cash}\n`
      message += `Чистый доход - ${data.benefit}\n`
      message += `Время начала - ${data.washing_time_started}\n`
      message += `Законченное время - ${data.washing_time_ended}`
    }
  }

  if (kw === 'WASH_MAKING') {
    if (lang === kb.language.uz) {
      message += `Menejer - ${data.manager}\n`
      message += `Xodim - ${data.employee}\n`
      message += `Filial - ${data.branch}\n`
      message += `Tarif - ${data.fee}\n`
      message += `Mashina - ${data.car}\n`
      message += `Mashina turi - ${data.car_type}\n`
      message += `Mashina raqami - ${data.car_number}\n`
      message += `Narxi - ${data.price}\n`
      message += `Kassa - ${data.cash}\n`
      message += `Sof foyda - ${data.benefit}\n`
      message += `Boshlangan vaqt - ${data.started_at}\n`
    } else if (lang === kb.language.ru) {
      message += `Менеджер - ${data.manager}\n`
      message += `Сотрудник - ${data.employee}\n`
      message += `Филиал - ${data.branch}\n`
      message += `Тариф - ${data.fee}\n`
      message += `Автомобиль - ${data.car}\n`
      message += `Тип автомобиля - ${data.car_type}\n`
      message += `Номер автомобиля - ${data.car_number}\n`
      message += `Цена - ${data.price}\n`
      message += `Касса - ${data.cash}\n`
      message += `Чистый доход - ${data.benefit}\n`
      message += `Время начала - ${data.started_at}\n`
    }
  }

  if (kw === 'EMPLOYEE') {
    if (lang === kb.language.uz) {
      message += `Menejer - ${data.manager}\n`
      message += `Filial - ${data.branch}\n`
      message += `Ismi - ${data.name}\n`
      message += `Telefon raqami - ${data.number}\n`
      message += `Yuvgan avtomobillari - ${data.total_washes}\n`
      message += `Vaziyati - ${data.is_idler ? 'Ishlayapti' : 'Ishlamayapti'}\n`
      message += `Tanlaan tili - ${data.lang}\n`
      message += `Holati - ${data.status}\n`
      message += `Ish boshlagan vaqti - ${data.created_at}\n`
    } else if (lang === kb.language.ru) {
      message += `Менеджер - ${data.manager}\n`
      message += `Филиал - ${data.branch}\n`
      message += `Имя - ${data.name}\n`
      message += `Номер телефона - ${data.number}\n`
      message += `Мытые автомобили - ${data.total_washes}\n`
      message += `Ситуация - ${data.is_idler ? 'Работает' : 'Не работает'}\n`
      message += `Выбранный язык - ${data.lang}\n`
      message += `Статус - ${data.status}\n`
      message += `Время начать работу - ${data.created_at}\n`
    }
  }

  if (kw === 'EMPLOYEE_SETTINGS') {
    if (lang === kb.language.uz) {
      message += `Ma'lumotlaringiz: \n`
      message += `Ismingiz - ${data.name}.\n`
      message += `Telefon raqamingiz - ${data.number}\n`
      message += `Username - ${data.username}.\n`
      message += `Tanlangan til - ${data.lang}.\n`
    } else if (lang === kb.language.ru) {
      message += `Информация о сотрудника:\n`
      message += `Ваше имя - ${data.name}.\n`
      message += `Ваш номер телефона - +${data.number}.\n`
      message += `Username - ${data.username}.\n`
      message += `Выбранный вами язык - ${data.lang}\n`
    }
  }

  if (kw === 'FEE') {
    if (lang === kb.language.uz) {
      message += `Xo'jayin - ${data.owner}\n`
      message += `Menejer - ${data.manager}\n`
      message += `Filial - ${data.branch}\n`
      message += `Nomi - ${data.name}\n`
      message += `Tavsifi - ${data.description}\n`
      message += `Mashinalar - \n`
      for (let i = 0; i < data.cars.length; i++) message += `${i + 1}. ${data.cars[i]}\n`
      message += `Tarifda yuvilgan mashinalar - ${data.total_washes}\n`
      message += `Yuvish kassasi - ${data.cash}\n`
      message += `Yuvish narxi - ${data.price}\n`
      message += `Yuvish foydasi - ${data.price - data.cash}\n`
      message += `Ish boshlagan vaqti - ${data.created_at}\n`
    } else if (lang === kb.language.ru) {
      message += `Босс - ${data.owner}\n`
      message += `Менеджер - ${data.manager}\n`
      message += `Филиал - ${data.branch}\n`
      message += `Тип - ${data.type}\n`
      message += `Описание - ${data.description}\n`
      message += `Автомобили - \n`
      for (let i = 0; i < data.cars.length; i++) message += `${i + 1}. ${data.cars[i]}\n`
      message += `Автомобили помыты по тарифу - ${data.total_washes}\n`
      message += `Yuvish kassasi - ${data.cash}\n`
      message += `Цена автомойки - ${data.price}\n`
      message += `Чистая прибыль от автомойки - ${data.price - data.cash}\n`
      message += `Время начать работу - ${data.created_at}\n`
    }
  }

  if (kw === 'FEE_SETTINGS') {
    if (lang === kb.language.uz) {
      message += `Nomi - ${data.name}\n`
      message += `Tavsifi - ${data.description}\n`
      message += `Mashinalar - \n`
      for (let i = 0; i < data.cars.length; i++) message += `${i + 1}. ${data.cars[i]}\n`
      message += `Yuvish kassasi - ${data.cash}\n`
      message += `Yuvish narxi - ${data.price}\n`
      message += `Yuvish foydasi - ${data.price - data.cash}\n`
    } else if (lang === kb.language.ru) {
      message += `Тип - ${data.type}\n`
      message += `Описание - ${data.description}\n`
      message += `Автомобили - \n`
      for (let i = 0; i < data.cars.length; i++) message += `${i + 1}. ${data.cars[i]}\n`
      message += `Yuvish kassasi - ${data.cash}\n`
      message += `Цена автомойки - ${data.price}\n`
      message += `Чистая прибыль от автомойки - ${data.price - data.cash}\n`
    }
  }

  if (kw === 'CAR') {
    if (lang === kb.language.uz) {
      message += `Nomi - ${data.name}\n`
      message += `Tavsifi - ${data.description}\n`
      message += `Turi - ${data.type}\n`
      message += `Qo'shilgan vaqti - ${data.created_at}\n`
    } else if (lang === kb.language.ru) {
      message += `Название - ${data.name}\n`
      message += `Описание - ${data.description}\n`
      message += `Тип - ${data.type}\n`
      message += `Добавлено время - ${data.created_at}\n`
    }
  }

  return message
}

const owner_pagination = async (page, limit) => {
  let offset = limit * (page - 1), text, kbb = [], arr = [], kbs

  const owners = await getOwnerPagination({status: 'active'}, offset, limit),
    all_owners = await getOwners({status: 'active'})

  if (owners.length > 0) {
    text = `<b>Hozirgi: ${offset + 1}-${owners.length + offset}, Jami:${all_owners.length}</b>\n\n`

    for (let i = 0; i < owners.length; i++) {
      const owner = owners[i]

      const obj = {text: `${i + 1}`, callback_data: JSON.stringify({phrase: 'owner', id: owner._id})}

      arr.push(obj)

      if (arr.length % 6 === 0) {
        kbb.push(arr)
        arr = []
      }

      text += `<b>${i + 1}.</b> ${owner.name} - ${owner.number} - ${owner.is_paid ? "To'langan" : "To'lanmagan"} - ${owner.balance} \n`
    }

    kbb.push(arr)

    const inline_keyboard = [
      {text: `⬅️`, callback_data: JSON.stringify({phrase: page !== 1 ? `left#owner#${page - 1}` : 'none', id: ''})},
      {text: `❌`, callback_data: JSON.stringify({phrase: `delete`, id: ''})},
      {
        text: ` ➡️`,
        callback_data: JSON.stringify({
          phrase: owners.length + offset !== all_owners.length ? `right#owner#${page + 1}` : 'none', id: ''
        })
      }
    ]

    kbb.push(inline_keyboard)

    kbs = {reply_markup: {inline_keyboard: kbb}}
  } else if (owners.length <= 0) {
    text = "Hozircha mo'yka xo'jayinlari qo'shilmagan"
    kbs = {reply_markup: {resize_keyboard: true, keyboard: keyboard.admin.owners}}
  }


  return {text, kbs}
}
const universal_keyboard = (data, lang) => {
  let kbb = [], arr = [], text

  for (let i = 0; i < data.length; i++) {
    const item = data[i]

    if (item.status !== 'inactive') {
      text = item.name ? item.name : item.type

      const obj = {text}

      arr.push(obj)

      if (arr.length % 2 === 0) {
        kbb.push(arr)
        arr = []
      }
    }
  }

  if (data[data.length - 1].status !== 'inactive') {
    text = data[data.length - 1].name ? data[data.length - 1].name : data[data.length - 1].type
  }

  if (data.length % 2 === 1) {
    kbb.push([{text}])
  }

  if (lang === kb.language.uz) kbb.push([kb.options.back.uz])
  else if (lang === kb.language.ru) kbb.push([kb.options.back.ru])

  return kbb
}

const employee_pagination = async (page, limit, query, lang) => {
  let offset = limit * (page - 1), text, clause, kbs

  const employees = await getEmployeePagination(query, offset, limit), all_employees = await getEmployees(query)

  if (employees.length > 0) {
    text = (lang === kb.language.uz)
      ? `<b>Hozirgi: ${offset + 1}-${employees.length + offset}, Jami:${all_employees.length}</b>\n\n`
      : `<b>Текущий: ${offset + 1}-${employees.length + offset}, Общий:${all_employees.length}</b>\n\n`

    let kbb = [], arr = []

    for (let i = 0; i < employees.length; i++) {
      const employee = employees[i]

      const obj = {text: `${i + 1}`, callback_data: JSON.stringify({phrase: 'emp', id: employee._id})}

      arr.push(obj)

      if (arr.length % 6 === 0) {
        kbb.push(arr)
        arr = []
      }

      if (employees.is_idler) {
        clause = (lang === kb.language.uz) ? "Ishlayapti" : "Работает"
      } else if (!employee.is_idler) {
        clause = (lang === kb.language.uz) ? "Ishlamayapti" : "Не работает"
      }

      text += `<b>${i + 1}.</b> ${employee.name} - ${employee.number} - ${employee.total_washes} - ${clause}\n`
    }

    kbb.push(arr)

    const inline_keyboard = [
      {text: `⬅️`, callback_data: JSON.stringify({phrase: page !== 1 ? `left#employee#${page - 1}` : 'none', id: ''})},
      {text: `❌`, callback_data: JSON.stringify({phrase: `delete`, id: ''})},
      {
        text: ` ➡️`,
        callback_data: JSON.stringify({
          phrase: employees.length + offset !== all_employees.length ? `right#employee#${page + 1}` : 'none', id: ''
        })
      }
    ]

    kbb.push(inline_keyboard)

    kbs = {reply_markup: {inline_keyboard: kbb}}
  } else if (employees.length <= 0) {
    if (lang === kb.language.uz) {
      text = "Hozircha hodimlar qo'shimagan yoki hali ishga kelmagan"
      kbs = {reply_markup: {resize_keyboard: true, keyboard: keyboard.manager.employees.uz}}
    } else if (lang === kb.language.ru) {
      text = 'Нет сотрудников, которые были добавлены или начаты еще'
      kbs = {reply_markup: {resize_keyboard: true, keyboard: keyboard.manager.employees.ru}}
    }
  }

  return {text, kbs}
}
const owner_employee_pagination = async (page, limit, query, type, lang) => {
  let offset = limit * (page - 1), text, clause, kbs, extra

  const employees = await getEmployeePagination(query, offset, limit), all_employees = await getEmployees(query)

  if (employees.length > 0) {
    text = (lang === kb.language.uz)
      ? `<b>Hozirgi: ${offset + 1}-${employees.length + offset}, Jami:${all_employees.length}</b>\n\n`
      : `<b>Текущий: ${offset + 1}-${employees.length + offset}, Общий:${all_employees.length}</b>\n\n`

    let kbb = [], arr = [], obj

    for (let i = 0; i < employees.length; i++) {
      const employee = employees[i]

      if (type === 'ALL') {
        obj = {text: `${i + 1}`, callback_data: JSON.stringify({phrase: 'e_all', id: employee._id})}
      } else if (type === 'ACTIVE') {
        obj = {text: `${i + 1}`, callback_data: JSON.stringify({phrase: 'e_act', id: employee._id})}
      } else if (type === 'INACTIVE') {
        obj = {text: `${i + 1}`, callback_data: JSON.stringify({phrase: 'e_inact', id: employee._id})}
      }

      arr.push(obj)

      if (arr.length % 6 === 0) {
        kbb.push(arr)
        arr = []
      }

      if (employee.is_idler) {
        clause = (lang === kb.language.uz) ? "Ishlayapti" : "Работает"
      } else if (!employee.is_idler) {
        clause = (lang === kb.language.uz) ? "Ishlamayapti" : "Не работает"
      }

      text += `<b>${i + 1}.</b> ${employee.name} - ${employee.number} - ${employee.total_washes} - ${clause}\n`
    }

    if (arr.length !== 0) kbb.push(arr)

    if (type === 'ALL') extra = 'all_e'
    if (type === 'ACTIVE') extra = 'act_e'
    if (type === 'INACTIVE') extra = 'inact_e'


    const inline_keyboard = [
      {text: `⬅️`, callback_data: JSON.stringify({phrase: page !== 1 ? `left#${extra}#${page - 1}` : 'none', id: ''})},
      {text: `❌`, callback_data: JSON.stringify({phrase: `delete`, id: ''})},
      {
        text: ` ➡️`,
        callback_data: JSON.stringify({
          phrase: employees.length + offset !== all_employees.length ? `right#${extra}#${page + 1}` : 'none', id: ''
        })
      }
    ]

    kbb.push(inline_keyboard)

    kbs = {reply_markup: {inline_keyboard: kbb}}
  } else if (employees.length <= 0) {
    if (lang === kb.language.uz) {
      text = "Hozircha hodimlar qo'shimagan yoki hali ishga kelmagan"
      kbs = {reply_markup: {resize_keyboard: true, keyboard: keyboard.owner.employees.uz}}
    } else if (lang === kb.language.ru) {
      text = 'Нет сотрудников, которые были добавлены или начаты еще'
      kbs = {reply_markup: {resize_keyboard: true, keyboard: keyboard.owner.employees.ru}}
    }
  }

  return {text, kbs}
}
const employee_wash_pagination = async (page, limit, query, lang) => {
  let offset = limit * (page - 1), text, kbb = [], arr = [], kbs, wash

  const washes = await getWashPagination(query, offset, limit), all_washes = await getWashes(query)

  if (washes.length > 0 && all_washes.length > 0) {
    text = (lang === kb.language.uz)
      ? `<b>Hozirgi: ${offset + 1}-${washes.length + offset}, Jami:${all_washes.length}</b>\n\n`
      : `<b>Текущий: ${offset + 1}-${washes.length + offset}, Общий:${all_washes.length}</b>\n\n`

    for (let i = 0; i < washes.length; i++) {
      wash = washes[i]

      const obj = {text: `${i + 1}`, callback_data: JSON.stringify({phrase: 'wash', id: wash._id})}

      arr.push(obj)

      if (arr.length % 6 === 0) {
        kbb.push(arr)
        arr = []
      }

      text += `<b>${i + 1}.</b> ${wash.employee} - ${wash.car} - ${wash.car_number}\n`
    }

    kbb.push(arr)

    const inline_keyboard = [
      {
        text: `⬅️`,
        callback_data: JSON.stringify({phrase: page !== 1 ? `left#wash#today#${page - 1}` : 'none', id: ''})
      },
      {text: `❌`, callback_data: JSON.stringify({phrase: `delete`, id: ''})},
      {
        text: ` ➡️`,
        callback_data: JSON.stringify({
          phrase: washes.length + offset !== all_washes.length ? `right#wash#today#${page + 1}` : 'none', id: ''
        })
      }
    ]

    kbb.push(inline_keyboard)

    kbs = {reply_markup: {inline_keyboard: kbb}}
  } else {
    if (lang === kb.language.uz) {
      text = 'Hali yuvishlar mavjud emas'
      kbs = {reply_markup: {resize_keyboard: true, keyboard: keyboard.employee.washes.uz}}
    } else if (lang === kb.language.ru) {
      text = "Автомоек пока нет"
      kbs = {reply_markup: {resize_keyboard: true, keyboard: keyboard.employee.washes.ru}}
    }
  }

  return {text, kbs}
}
const employee_attendance = (employees, lang) => {
  let kbb = [], arr = [], text, work = 0, out_work = 0, kbs

  if (employees.length > 0) {
    for (let i = 0; i < employees.length; i++) {
      let flag

      const employee = employees[i]

      if (employee.status === 'active') {
        work += 1
        flag = '✅'
      } else if (employee.status === 'inactive') {
        out_work += 1
        flag = '➖'
      }

      text = (lang === kb.language.uz)
        ? `<b>Jami: ${employees.length}</b> ta ishchi mavjud.\n ${work} ta xodim kelgan, ${out_work} ta xodim kelmagan`
        : `<b>Всего: ${employees.length}</b> сотрудника.\n Прибыли сотрудники: ${work}, не прибыли сотрудники: ${out_work}`

      const obj = {
        text: `${flag} ${employee.name}`,
        callback_data: JSON.stringify({phrase: 'e_edit', id: employee._id})
      }

      arr.push(obj)

      if (arr.length % 3 === 0) {
        kbb.push(arr)
        arr = []
      }
    }

    kbb.push(arr)

    kbb.push([{text: `❌`, callback_data: JSON.stringify({phrase: `delete`, id: ''})}])

    kbs = {reply_markup: {inline_keyboard: kbb}}
  } else if (employees.length <= 0) {
    if (lang === kb.language.uz) {
      text = "Hali xodimlar mavjud emas"
      kbs = {reply_markup: {resize_keyboard: true, keyboard: keyboard.manager.employees.uz}}
    } else if (lang === kb.language.ru) {
      text = "Персонала пока нет"
      kbs = {reply_markup: {resize_keyboard: true, keyboard: keyboard.manager.employees.ru}}
    }
  }

  return {kbs, text}
}

const branch_report_keyboard = (data, lang) => {
  let kbb = [], arr = [], text

  for (let i = 0; i < data.length; i++) {
    const item = data[i]

    if (item.status !== 'inactive') {
      arr.push({text: item.name})

      if (arr.length % 2 === 0) {
        kbb.push(arr)
        arr = []
      }
    }
  }

  kbb.push(arr)

  if (lang === kb.language.uz) kbb.push([kb.main.uz])
  else if (lang === kb.language.ru) kbb.push([kb.main.ru])

  return kbb
}

const fee_pagination = async (page, limit, query, kw, lang) => {
  let offset = limit * (page - 1), text, kbb = [], kbs

  const fees = await getFeePagination(query, offset, limit), all_fees = await getFees(query)

  if (fees.length > 0) {
    text = (lang === kb.language.uz)
      ? `<b>Hozirgi: ${offset + 1}-${fees.length + offset}, Jami:${all_fees.length}</b>\n\n`
      : `<b>Текущий: ${offset + 1}-${fees.length + offset}, Общий:${all_fees.length}</b>\n\n`

    for (let i = 0; i < fees.length; i++) {
      const fee = fees[i], owner = await getOwner({telegram_id: fee.owner}),
        manager = await getManager({telegram_id: fee.manager}), started_at = date(fee.created_at)

      const data = {
        owner: owner.name, manager: manager.name, branch: fee.branch, name: fee.name, description: fee.description,
        total_washes: fee.total_washes, cars: fee.cars, cash: fee.cash, price: fee.price, created_at: started_at
      }

      text += report(data, 'FEE', lang)
    }

    const inline_keyboard = [
      {text: `⬅️`, callback_data: JSON.stringify({phrase: page !== 1 ? `left#fee#${page - 1}` : 'none', id: ''})},
      {text: `❌`, callback_data: JSON.stringify({phrase: `delete`, id: ''})},
      {
        text: ` ➡️`,
        callback_data: JSON.stringify({
          phrase: fees.length + offset !== all_fees.length ? `right#fee#${page + 1}` : 'none', id: ''
        })
      }
    ]

    kbb.push(inline_keyboard)

    kbs = {reply_markup: {inline_keyboard: kbb}}
  } else if (fees.length <= 0) {
    if (lang === kb.language.uz) {
      text = "Hali tariflar mavjud emas"
      kbs = kw === 'MANAGER'
        ? {reply_markup: {resize_keyboard: true, keyboard: keyboard.manager.pages.uz}}
        : {reply_markup: {resize_keyboard: true, keyboard: keyboard.employee.pages.uz}}
    } else if (lang === kb.language.ru) {
      text = "Тарифов пока нет"
      kbs = kw === 'MANAGER'
        ? {reply_markup: {resize_keyboard: true, keyboard: keyboard.manager.pages.ru}}
        : {reply_markup: {resize_keyboard: true, keyboard: keyboard.employee.pages.ru}}
    }
  }

  return {text, kbs}
}

const car_keyboard = (data, lang) => {
  let kbb = [], arr = []

  for (let i = 0; i < data.length; i++) {
    const obj = {text: data[i]}
    arr.push(obj)

    if (arr.length % 5 === 0) {
      kbb.push(arr)
      arr = []
    }
  }

  kbb.push(arr)

  if (lang === kb.language.uz) {
    kbb.push([kb.options.back.uz])
  } else {
    kbb.push([kb.options.back.ru])
  }

  return kbb
}
const car_attendance = (cars, list, lang, type) => {
  let kbb = [], arr = [], obj

  const text = (lang === kb.language.uz)
    ? `<b>Jami: ${cars.length} ta mashina mavjud.</b>`
    : `<b>Всего: ${cars.length} автомобилей.</b>`

  for (let i = 0; i < cars.length; i++) {
    const car = cars[i], flag = list.includes(car.name) ? '✅' : '➖'

    if (type === 'select') {
      obj = {text: `${flag} ${car.name}`, callback_data: JSON.stringify({phrase: 's_car', id: car._id})}
    } else if (type === 'edit') {
      obj = {text: `${flag} ${car.name}`, callback_data: JSON.stringify({phrase: 'e_car', id: car._id})}
    }

    arr.push(obj)

    if (arr.length % 4 === 0) {
      kbb.push(arr)
      arr = []
    }
  }

  const clause = (lang === kb.language.uz) ? "Tugatish" : "Прекращение"

  if (type === 'select') {
    obj = {text: clause, callback_data: JSON.stringify({phrase: `s_e`, id: ''})}
  } else if (type === 'edit') {
    obj = {text: clause, callback_data: JSON.stringify({phrase: `e_e`, id: ''})}
  }

  kbb.push([obj])

  return {kbb, text}
}
const car_pagination = async (page, limit, author) => {
  let offset = limit * (page - 1), text, kbb = [], arr = []

  const cars = await getCarPagination(author, offset, limit), all_cars = await getCars(author)

  text = `<b>Hozirgi: ${offset + 1}-${cars.length + offset}, Jami:${all_cars.length}</b>\n\n`

  for (let i = 0; i < cars.length; i++) {
    const car = cars[i]

    const obj = {text: `${i + 1}`, callback_data: JSON.stringify({phrase: 'car', id: car._id})}

    arr.push(obj)

    if (arr.length % 6 === 0) {
      kbb.push(arr)
      arr = []
    }

    text += `<b>${i + 1}.</b> ${car.name} - ${car.type} \n`
  }

  kbb.push(arr)

  const inline_keyboard = [
    {text: `⬅️`, callback_data: JSON.stringify({phrase: page !== 1 ? `left#car#${page - 1}` : 'none', id: ''})},
    {text: `❌`, callback_data: JSON.stringify({phrase: `delete`, id: ''})},
    {
      text: ` ➡️`,
      callback_data: JSON.stringify({
        phrase: cars.length + offset !== all_cars.length ? `right#car#${page + 1}` : 'none', id: ''
      })
    }
  ]

  kbb.push(inline_keyboard)

  return {text, kbb}
}

const get_washed_time = (start, end) => {
  const start_time = new Date(start).getTime(), end_time = new Date(end).getTime()

  const time = new Date(end_time - start_time)

  const hour = time.getHours(), minute = time.getMinutes(), second = time.getSeconds()

  return `${hour - 6}:${minute > 10 ? minute : `0${minute}`}:${second > 10 ? second : `0${second}`}`
}
const wash_pagination = async (page, limit, query, kw, lang) => {
  let offset = limit * (page - 1), text, kbb = [], arr = [], kbs, wash, total = 0

  const washes = await getWashPagination(query, offset, limit), all_washes = await getWashes(query)

  if (washes.length > 0 && all_washes.length > 0) {
    text = (lang === kb.language.uz)
      ? `<b>Hozirgi: ${offset + 1}-${washes.length + offset}, Jami:${all_washes.length}</b>\n\n`
      : `<b>Текущий: ${offset + 1}-${washes.length + offset}, Общий:${all_washes.length}</b>\n\n`

    for (let i = 0; i < washes.length; i++) {
      wash = washes[i]

      const obj = wash.status === 'washed'
        ? {text: `${i + 1}`, callback_data: JSON.stringify({phrase: 'wash', id: wash._id})}
        : {text: `${i + 1}`, callback_data: JSON.stringify({phrase: 'washing', id: wash._id})}

      arr.push(obj)

      total += wash.benefit

      if (arr.length % 6 === 0) {
        kbb.push(arr)
        arr = []
      }

      text += `<b>${i + 1}.</b> ${wash.employee} - ${wash.car} - ${wash.car_number}\n`
    }

    kbb.push(arr)

    const inline_keyboard = wash.status === 'washed' ? [
      {text: `⬅️`, callback_data: JSON.stringify({phrase: page !== 1 ? `left#wash#${page - 1}` : 'none', id: ''})},
      {text: `❌`, callback_data: JSON.stringify({phrase: `delete`, id: ''})},
      {
        text: ` ➡️`,
        callback_data: JSON.stringify({
          phrase: washes.length + offset !== all_washes.length ? `right#wash#${page + 1}` : 'none', id: ''
        })
      }
    ] : [
      {text: `⬅️`, callback_data: JSON.stringify({phrase: page !== 1 ? `left#washing#${page - 1}` : 'none', id: ''})},
      {text: `❌`, callback_data: JSON.stringify({phrase: `delete`, id: ''})},
      {
        text: ` ➡️`,
        callback_data: JSON.stringify({
          phrase: washes.length + offset !== all_washes.length ? `right#washing#${page + 1}` : 'none', id: ''
        })
      }
    ]

    kbb.push(inline_keyboard)

    kbs = {reply_markup: {inline_keyboard: kbb}}
  } else {
    if (lang === kb.language.uz) {
      text = 'Hali yuvishlar mavjud emas'
      kbs = kw === 'MANAGER'
        ? {reply_markup: {resize_keyboard: true, keyboard: keyboard.manager.washes.uz}}
        : {reply_markup: {resize_keyboard: true, keyboard: keyboard.owner.washes.uz}}
    } else if (lang === kb.language.ru) {
      text = "Автомоек пока нет"
      kbs = kw === 'MANAGER'
        ? {reply_markup: {resize_keyboard: true, keyboard: keyboard.manager.washes.ru}}
        : {reply_markup: {resize_keyboard: true, keyboard: keyboard.owner.washes.ru}}
    }
  }

  return {text, kbs, total}
}
const washing_pagination = async (page, limit, query, lang) => {
  let offset = limit * (page - 1), text, kbb = [], arr = []

  const washes = await getWashPagination(query, offset, limit), all_washes = await getWashes(query)

  if (washes.length > 0 && all_washes.length > 0) {
    text = (lang === kb.language.uz)
      ? `<b>Hozirgi: ${offset + 1}-${washes.length + offset}, Jami:${all_washes.length}</b>\n\n`
      : `<b>Текущий: ${offset + 1}-${washes.length + offset}, Общий:${all_washes.length}</b>\n\n`

    for (let i = 0; i < washes.length; i++) {
      const wash = washes[i]

      const obj = {text: `${i + 1}`, callback_data: JSON.stringify({phrase: 'washing', id: wash._id})}

      arr.push(obj)

      if (arr.length % 6 === 0) {
        kbb.push(arr)
        arr = []
      }

      text += `<b>${i + 1}.</b> ${wash.employee} - ${wash.car} - ${wash.car_number}\n`
    }

    kbb.push(arr)

    const inline_keyboard = [
      {text: `⬅️`, callback_data: JSON.stringify({phrase: page !== 1 ? `left#washing#${page - 1}` : 'none', id: ''})},
      {text: `❌`, callback_data: JSON.stringify({phrase: `delete`, id: ''})},
      {
        text: ` ➡️`,
        callback_data: JSON.stringify({
          phrase: washes.length + offset !== all_washes.length ? `right#washing#${page + 1}` : 'none', id: ''
        })
      }
    ]

    kbb.push(inline_keyboard)
  } else {
    if (lang === kb.language.uz) {
      text = 'Hali yuvishlar mavjud emas'
      kbb = keyboard.manager.washes.uz
    } else if (lang === kb.language.ru) {
      text = "Автомоек пока нет"
      kbb = keyboard.manager.washes.ru
    }
  }

  return {text, kbb}
}
const owner_wash_pagination = async (page, limit, query, lang) => {
  let offset = limit * (page - 1), text, kbb = [], arr = [], kbs

  const washes = await getWashPagination(query, offset, limit), all_washes = await getWashes(query)

  if (washes.length > 0 && all_washes.length > 0) {
    text = (lang === kb.language.uz)
      ? `<b>Hozirgi: ${offset + 1}-${washes.length + offset}, Jami:${all_washes.length}</b>\n\n`
      : `<b>Текущий: ${offset + 1}-${washes.length + offset}, Общий:${all_washes.length}</b>\n\n`

    for (let i = 0; i < washes.length; i++) {
      const wash = washes[i]

      const obj = wash.status === 'washed'
        ? {text: `${i + 1}`, callback_data: JSON.stringify({phrase: 'wash', id: wash._id})}
        : {text: `${i + 1}`, callback_data: JSON.stringify({phrase: 'washing', id: wash._id})}

      arr.push(obj)

      if (arr.length % 6 === 0) {
        kbb.push(arr)
        arr = []
      }

      text += `<b>${i + 1}.</b> ${wash.employee} - ${wash.car} - ${wash.car_number}\n`
    }

    kbb.push(arr)

    const inline_keyboard = [
      {text: `⬅️`, callback_data: JSON.stringify({phrase: page !== 1 ? `left#wash#${page - 1}` : 'none', id: ''})},
      {text: `❌`, callback_data: JSON.stringify({phrase: `delete`, id: ''})},
      {
        text: ` ➡️`,
        callback_data: JSON.stringify({
          phrase: washes.length + offset !== all_washes.length ? `right#wash#${page + 1}` : 'none', id: ''
        })
      }
    ]

    kbb.push(inline_keyboard)

    kbs = {reply_markup: {inline_keyboard: kbb}}
  } else {
    if (lang === kb.language.uz) {
      text = 'Hali yuvishlar mavjud emas'
      kbs = {reply_markup: {resize_keyboard: true, keyboard: keyboard.owner.washes.uz}}
    } else if (lang === kb.language.ru) {
      text = "Автомоек пока нет"
      kbs = {reply_markup: {resize_keyboard: true, keyboard: keyboard.owner.washes.ru}}
    }
  }

  return {text, kbs}
}

const feedback_seen_pagination = async (page, limit, query, lang) => {
  let offset = limit * (page - 1), text, kbb = [], arr = [], kbs, kw

  const selected_feedback = await getFeedbackPagination(query, offset, limit),
    all_feedback = await getAllFeedback(query)

  if (selected_feedback.length > 0) {
    text = (lang === kb.language.uz)
      ? `<b>Hozirgi: ${offset + 1}-${selected_feedback.length + offset}, Jami:${all_feedback.length}</b>\n\n`
      : `<b>Текущий: ${offset + 1}-${selected_feedback.length + offset}, Общий:${all_feedback.length}</b>\n\n`

    for (let i = 0; i < selected_feedback.length; i++) {
      const feedback = selected_feedback[i]

      const author = feedback.is_employee
        ? await getEmployee({telegram_id: feedback.author})
        : await getClient({telegram_id: feedback.author})

      const obj = {text: `${i + 1}`, callback_data: JSON.stringify({phrase: 'se_feed', id: feedback._id})}

      arr.push(obj)

      if (arr.length % 6 === 0) {
        kbb.push(arr)
        arr = []
      }

      text += `<b>${i + 1}.</b> ${author.name} - ${feedback.branch} - ${feedback.mark}\n`
    }

    kbb.push(arr)

    const inline_keyboard = [
      {
        text: `⬅️`,
        callback_data: JSON.stringify({phrase: page !== 1 ? `left#selfeedback#${page - 1}` : 'none', id: ''})
      },
      {text: `❌`, callback_data: JSON.stringify({phrase: `delete`, id: ''})},
      {
        text: ` ➡️`,
        callback_data: JSON.stringify({
          phrase: selected_feedback.length + offset !== all_feedback.length ? `right#selfeedback#${page + 1}` : 'none',
          id: ''
        })
      }
    ]

    kbb.push(inline_keyboard)

    kw = 'YES'

    kbs = {reply_markup: {inline_keyboard: kbb}}
  } else if (selected_feedback.length <= 0) {
    kw = 'NO'

    if (lang === kb.language.uz) {
      text = "Hali izohlar mavjud emas"
      kbs = {reply_markup: {resize_keyboard: true, keyboard: keyboard.owner.feedback.uz}}
    } else if (lang === kb.language.ru) {
      text = "Пока нет комментариев"
      kbs = {reply_markup: {resize_keyboard: true, keyboard: keyboard.owner.feedback.ru}}
    }
  }

  return {text, kbs, kw}
}
const feedback_done_pagination = async (page, limit, query, lang) => {
  let offset = limit * (page - 1), text, kbb = [], arr = [], kbs, kw

  const selected_feedback = await getFeedbackPagination(query, offset, limit),
    all_feedback = await getAllFeedback(query)

  if (selected_feedback.length > 0) {
    text = (lang === kb.language.uz)
      ? `<b>Hozirgi: ${offset + 1}-${selected_feedback.length + offset}, Jami:${all_feedback.length}</b>\n\n`
      : `<b>Текущий: ${offset + 1}-${selected_feedback.length + offset}, Общий:${all_feedback.length}</b>\n\n`

    for (let i = 0; i < selected_feedback.length; i++) {
      const feedback = selected_feedback[i]

      const author = feedback.is_employee
        ? await getEmployee({telegram_id: feedback.author})
        : await getClient({telegram_id: feedback.author})

      const obj = {text: `${i + 1}`, callback_data: JSON.stringify({phrase: 'do_feed', id: feedback._id})}

      arr.push(obj)

      if (arr.length % 6 === 0) {
        kbb.push(arr)
        arr = []
      }

      text += `<b>${i + 1}.</b> ${author.name} - ${feedback.branch} - ${feedback.mark}\n`
    }

    kbb.push(arr)

    const inline_keyboard = [
      {
        text: `⬅️`,
        callback_data: JSON.stringify({phrase: page !== 1 ? `left#dofeedback#${page - 1}` : 'none', id: ''})
      },
      {text: `❌`, callback_data: JSON.stringify({phrase: `delete`, id: ''})},
      {
        text: ` ➡️`,
        callback_data: JSON.stringify({
          phrase: selected_feedback.length + offset !== all_feedback.length ? `right#dofeedback#${page + 1}` : 'none',
          id: ''
        })
      }
    ]

    kbb.push(inline_keyboard)

    kw = 'YES'

    kbs = {reply_markup: {inline_keyboard: kbb}}
  } else if (selected_feedback.length <= 0) {
    kw = 'NO'

    if (lang === kb.language.uz) {
      text = "Hali bajarilayotgan izohlar mavjud emas"
      kbs = {reply_markup: {resize_keyboard: true, keyboard: keyboard.owner.feedback.uz}}
    } else if (lang === kb.language.ru) {
      text = "В настоящее время комментарии отсутствуют"
      kbs = {reply_markup: {resize_keyboard: true, keyboard: keyboard.owner.feedback.ru}}
    }
  }

  return {text, kbs, kw}
}

const date = (day) => {
  const year = day.getFullYear(), month = day.getMonth(), date = day.getDate(), hour = day.getHours(),
    minutes = day.getMinutes()

  return `${year}-${month + 1}-${date}. ${hour}:${minutes}`
}
const date_name = () => {
  let year, month, date

  const day = new Date()

  year = day.getFullYear(), month = day.getMonth(), date = day.getDate()

  if (month === 9) {
    month += 1
  } else if (month < 10 && month !== 9) {
    month = `0${month + 1}`
  }

  return `${date}-${month}-${year}`
}
const date_is_valid = (date) => {
  const day = new Date(date)
  return day instanceof Date && !isNaN(day);
}
const parse_number = (text) => {
  return Number(text).toString()
}

module.exports = {
  report,
  owner_pagination,
  universal_keyboard,
  employee_pagination,
  owner_employee_pagination,
  employee_wash_pagination,
  employee_attendance,
  branch_report_keyboard,
  fee_pagination,
  car_keyboard,
  car_attendance,
  car_pagination,
  get_washed_time,
  wash_pagination,
  washing_pagination,
  owner_wash_pagination,
  feedback_seen_pagination,
  feedback_done_pagination,
  date,
  date_name,
  date_is_valid,
  parse_number
}
