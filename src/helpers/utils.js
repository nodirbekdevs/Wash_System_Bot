const kb = require('./keyboard-buttons')
const {getEmployee} = require('./../controllers/employeeController')
const {getCars} = require('./../controllers/carController')
const {getOwners} = require('./../controllers/ownerController')
const Cars = require('./../models/carModel')
const Owner = require('./../models/ownerModel')

const universal_keyboard = (data, lang) => {
  let kbb = [], arr = [], text

  for (let i = 0; i < data.length; i++) {
    const item = data[i]

    text = item.name ? item.name : item.type

    const obj = {text}

    arr.push(obj)

    if (arr.length % 2 === 0) {
      kbb.push(arr)
      arr = []
    }
  }

  text = data[data.length - 1].name ? data[data.length - 1].name : data[data.length - 1].type

  if (data.length % 2 === 1) {
    kbb.push([{text}])
  }

  if (lang === kb.language.uz) kbb.push([kb.options.back.uz])
  else if (lang === kb.language.ru) kbb.push([kb.options.back.ru])

  return kbb
}

const car_type = (data, lang) => {

}

const date = (day) => {
  const year = day.getFullYear(), month = day.getMonth(), date = day.getDate(), hour = day.getHours(),
    minutes = day.getMinutes(), given_date = `${year}-${month}-${date}. ${hour}:${minutes}`

  return given_date
}

const report = (data, kw, lang) => {
  let message = ''

  message = ''

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
      message += `Ваш номер телефона - +${data.number}.\n`
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
      message += "Информация о филиале: \n"
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
      message += `Holati - ${data.status}`
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
      message += `Mashina - ${data.car}\n`
      message += `Mashina raqami - ${data.car_number}\n`
      message += `Narxi - ${data.price}\n`
      message += `Kassa - ${data.cash}\n`
      message += `Sof foyda - ${data.benefit}\n`
      message += `Boshlangan vaqt - ${data.washing_time_started}\n`
      message += `Tugallangan vaqt - ${data.washing_time_ended}`
    } else if (lang === kb.language.ru) {
      message += `Сотрудник - ${data.employee}\n`
      message += `Филиал - ${data.branch}\n`
      message += `Автомобиль - ${data.car}\n`
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
      message += `Mashina turi - ${data.car_type}\n`
      message += `Mashina - ${data.car}\n`
      message += `Mashina raqami - ${data.car_number}\n`
      message += `Narxi - ${data.price}\n`
      message += `Kassa - ${data.cash}\n`
      message += `Sof foyda - ${data.benefit}\n`
      message += `Boshlangan vaqt - ${data.started_at}\n`
    } else if (lang === kb.language.ru) {
      message += `Менеджер - ${data.manager}\n`
      message += `Сотрудник - ${data.employee}\n`
      message += `Филиал - ${data.branch}\n`
      message += `Тип автомобиля - ${data.car_type}\n`
      message += `Автомобиль - ${data.car}\n`
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
      message += `Ситуация - ${data.is_idler ? 'Ishlayapti' : 'Ishlamayapti'}\n`
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

const wash_pagination = async (page, limit, washes, lang) => {
  let offset = limit * (page - 1), text

  text = (lang === kb.language.uz)
    ? `<b>Hozirgi: ${offset + 1}-${washes.length + offset}, Jami:${washes.length}</b>\n\n`
    : `<b>Текущий: ${offset + 1}-${washes.length + offset}, Общий:${washes.length}</b>\n\n`

  let kbb = [], arr = []

  for (let i = 0; i < washes.length; i++) {
    const wash = washes[i], employee = await getEmployee({telegram_id: wash.employee})

    const obj = (wash.status === 'washed')
      ? {text: `${i + 1}`, callback_data: JSON.stringify({phrase: 'washed', id: wash._id})}
      : {text: `${i + 1}`, callback_data: JSON.stringify({phrase: 'washing', id: wash._id})}

    arr.push(obj)

    if (arr.length % 5 === 0) {
      kbb.push(arr)
      arr = []
    }

    text += `<b>${i + 1}.</b> ${employee.name} - ${wash.car} - ${wash.car_number}\n`
  }

  kbb.push(arr)

  const inline_keyboard = [
    {text: `⬅️`, callback_data: JSON.stringify({phrase: page !== 1 ? `left#wash#${page - 1}` : 'none', id: ''})},
    {text: `❌`, callback_data: JSON.stringify({phrase: `delete`, id: ''})},
    {
      text: ` ➡️`,
      callback_data: JSON.stringify({
        phrase: washes.length + offset !== washes.length ? `right#wash#${page + 1}` : 'none',
        id: ''
      })
    }
  ]

  kbb.push(inline_keyboard)

  return {text, kbb}
}

const employee_pagination = async (page, limit, employees, lang) => {
  let offset = limit * (page - 1), text, clause

  text = (lang === kb.language.uz)
    ? `<b>Hozirgi: ${offset + 1}-${employees.length + offset}, Jami:${employees.length}</b>\n\n`
    : `<b>Текущий: ${offset + 1}-${employees.length + offset}, Общий:${employees.length}</b>\n\n`

  let kbb = [], arr = []

  for (let i = 0; i < employees.length; i++) {
    const employee = employees[i]

    const obj = {text: `${i + 1}`, callback_data: JSON.stringify({phrase: 'employee', id: employee._id})}

    arr.push(obj)

    if (arr.length % 5 === 0) {
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
        phrase: employees.length + offset !== employees.length ? `right#employee#${page + 1}` : 'none',
        id: ''
      })
    }
  ]

  kbb.push(inline_keyboard)

  return {text, kbb}
}

const fee_pagination = (page, limit, cars, lang) => {
  let offset = limit * (page - 1), text, clause

  text = (lang === kb.language.uz)
    ? `<b>Hozirgi: ${offset + 1}-${cars.length + offset}, Jami:${cars.length}</b>\n\n`
    : `<b>Текущий: ${offset + 1}-${cars.length + offset}, Общий:${cars.length}</b>\n\n`

  let kbb = [], arr = []

  for (let i = 0; i < cars.length; i++) {
    const car = cars[i]

    const obj = {text: `${i + 1}`, callback_data: JSON.stringify({phrase: 'car', id: car._id})}

    arr.push(obj)

    if (arr.length % 3 === 0) {
      kbb.push(arr)
      arr = []
    }

    text += `<b>${i + 1}.</b> ${car.branch} - ${car.type} \n`
  }

  kbb.push(arr)

  const inline_keyboard = [
    {text: `⬅️`, callback_data: JSON.stringify({phrase: page !== 1 ? `left#car#${page - 1}` : 'none', id: ''})},
    {text: `❌`, callback_data: JSON.stringify({phrase: `delete`, id: ''})},
    {
      text: ` ➡️`,
      callback_data: JSON.stringify({
        phrase: car.length + offset !== car.length ? `right#employee#${page + 1}` : 'none',
        id: ''
      })
    }
  ]

  kbb.push(inline_keyboard)

  return {text, kbb}
}

const car_pagination = async (page, limit, author) => {
  let offset = limit * (page - 1), text, kbb = [], arr = []

  const cars = await Cars.find({author}).skip(offset).limit(limit), all_cars = await getCars({author: 669704116})

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

const owner_pagination = async (page, limit) => {
  let offset = limit * (page - 1), text, kbb = [], arr = []

  const owners = await Owner.find({status: 'active'}).skip(offset).limit(limit), all_owners = await getOwners({status: 'active'})

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

  return {text, kbb}
}

const employee_attendance = (employees, lang) => {
  let kbb = [], arr = []

  const text = (lang === kb.language.uz)
    ? `<b>Jami: ${employees.length} ta ishchi mavjud.</b>`
    : `<b>Всего: ${employees.length} сотрудника.</b>`

  for (let i = 0; i < employees.length; i++) {
    const employee = employees[i], flag = employee.status === 'active' ? '✅' : '➖'

    const obj = {text: `${flag} ${employee.name}`, callback_data: JSON.stringify({phrase: 'e_edit', id: employee._id})}

    arr.push(obj)

    if (arr.length % 2 === 0) {
      kbb.push(arr)
      arr = []
    }
  }

  kbb.push([{text: `❌`, callback_data: JSON.stringify({phrase: `delete`, id: ''})}])

  return {kbb, text}
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

module.exports = {
  universal_keyboard, employee_attendance, car_pagination, fee_pagination,
  report, date, wash_pagination, employee_pagination, owner_pagination, car_attendance
}
