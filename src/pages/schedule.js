const kb = require('./../helpers/keyboard-buttons')
const cron = require('node-cron')
const excel = require('xlsx')
const {join} = require('node:path')
const {updateManyEmployees} = require('./../controllers/employeeController')
const {getWashes} = require('./../controllers/washController')
const {getBranches} = require('./../controllers/branchController')
const {getOwners, getOwner} = require('./../controllers/ownerController')
const {getManager} = require('./../controllers/managerController')
const {get_washed_time, date_name} = require('./../helpers/utils')

const schedule = (bot) => {
  cron.schedule('18 02 * * *', async () => {
    await updateManyEmployees({status: 'active'}, {status: 'inactive'})

    const branches = await getBranches({
      owner: {$gt: 0},
      manager: {$gt: 0},
      total_fees: {$gt: 0},
      total_employees: {$gt: 0},
      total_washes: {$gt: 0},
      status: 'provided',
    })

    if (branches.length > 0) {
      for (let i = 0; i < branches.length; i++) {
        const branch = branches[i]

        const owner = await getOwner({telegram_id: branch.owner})

        const path = join(__dirname, `./../../uploads/reports/branches/${branch.name}`)

        const washes = await getWashes({
          manager: branch.manager, branch: branch.name, status: 'washed', created_at: {
            $gte: new Date(new Date().setHours(0o0, 0o0, 0o0)),
            $lt: new Date(new Date().setHours(23, 59, 59))
          }
        })

        if (washes.length > 0) {
          let daily_washes = [], total = 0

          const text = owner.lang === kb.language.uz ? "Bugungi hisobotni yuborish ishlari boshlandi" : "Начался процесс отправки сегодняшнего отчета"

          // if (owner.lang === kb.language.uz) {
          //   text = "Bugungi hisobotni yuborish ishlari boshlandi"
          //   headers = [
          //     'Menejer', 'Xodim', 'Filial', 'Klient', 'Tarif', 'Mashina', 'Mashina turi', 'Mashina nomeri', 'Kassa',
          //     'Narxi', 'Foyda', 'Yuvilgan vaqt'
          //   ]
          // } else if (owner.lang === kb.language.uz) {
          //   text = "Начался процесс отправки сегодняшнего отчета"
          //   headers = [
          //     'Менеджер', 'Сотрудник', 'Филиал', 'Клиент', 'Тариф', 'Машина', 'Тип машины', 'Номер машины', 'Касса',
          //     'Цена', 'Выгода', 'Время мойки'
          //   ]
          // }

          await bot.sendMessage(owner.telegram_id, text)

          for (let j = 0; j < washes.length; j++) {
            const wash = washes[j].toJSON(), manager = await getManager({telegram_id: wash.manager}),
              washed_time = get_washed_time(wash.washed_time.started_at, wash.washed_time.washed_at)

            delete wash.washed_time
            delete wash._id
            delete wash.date
            delete wash.time
            delete wash.step
            delete wash.status
            delete wash.created_at
            delete wash.__v

            if (wash.client === 0) delete wash.client

            wash.manager = manager.name
            wash.washed_at = washed_time

            total += wash.benefit

            daily_washes.push(wash)
          }

          const filename = date_name(), name = `${path}/${filename}_${branch.name}_daily.xlsx`

          const new_workbook = excel.utils.book_new(), data = excel.utils.json_to_sheet(daily_washes)

          excel.utils.book_append_sheet(new_workbook, data, filename)

          excel.writeFile(new_workbook, name)

          const file_options = {
            filename: document,
            contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          }

          const message = owner.lang === kb.language.uz
            ? `Bugungi avtomobil yuvishlardan ${total} foyda ko'rildi`
            : `${total} прибыль от сегодняшних автомоек`

          await bot.sendDocument(owner.telegram_id, name, {}, file_options)

          await bot.sendMessage(owner.telegram_id, message)
        } else if (washes.length <= 0) {
          const text = owner.lang === kb.language.uz ? "Bugun avtomobillar yuvilmadi" : "Машины сегодня не мыли"

          await bot.sendMessage(owner.telegram_id, text)
        }
      }
    }
  });

  // cron.schedule('* * 01 * *', async () => {
  //   let message
  //
  //   const owners = await getOwners({})
  //
  //   for (let i = 0; i < owners.length; i++) {
  //     const owner = owners[i]
  //
  //     if (owner.balance >= 200000) {
  //       owner.balance -= 200000
  //       owner.is_paid = true
  //       message = owner.lang === kb.language.uz
  //         ? "Bu oy uchun pul to'landi. Bu oy platformani ishlatishingiz mumkun"
  //         : "Оплачено за этот месяц. В этом месяце вы можете использовать платформу"
  //     } else if (owner.balance < 200000) {
  //       owner.is_paid = false
  //       message = owner.lang === kb.language.uz
  //         ? "Bu oy uchun pul to'lanmadi. Platformani ishlatish uchun admin bilan bog'laning"
  //         : "Не оплачен в этом месяце. Свяжитесь с администратором, чтобы использовать платформу"
  //     }
  //
  //     await owner.save()
  //
  //     await bot.sendMessage(owner.telegram_id, message)
  //   }
  // })
}

module.exports = {schedule}
