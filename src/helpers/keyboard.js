const kb = require('./keyboard-buttons')

module.exports = {
  language: [
    [kb.language.uz, kb.language.ru]
  ],

  main: {
    uz: [[kb.main.uz]],
    ru: [[kb.main.ru]]
  },

  start: [[kb.start]],

  admin: {
    pages: [
      [kb.admin.pages.uz.settings, kb.admin.pages.uz.settings]
    ],

    settings: [
      [kb.admin.settings.uz.name, kb.admin.settings.uz.number],
      [kb.admin.settings.uz.username, kb.admin.settings.uz.language],
      [kb.main.uz]
    ],

    advertisements: [
      [kb.admin.advertisements.uz.add],
      [kb.admin.advertisements.uz.all, kb.admin.advertisements.uz.number],
      [kb.main.uz]
    ],
  },

  owner: {
    pages: {
      uz: [
        [kb.owner.pages.uz.settings, kb.owner.pages.uz.feedback],
        [kb.owner.pages.uz.managers, kb.owner.pages.uz.branches],
        [kb.owner.pages.uz.cars, kb.owner.pages.uz.reports]
      ],
      ru: [
        [kb.owner.pages.ru.settings, kb.owner.pages.ru.feedback],
        [kb.owner.pages.ru.managers, kb.owner.pages.ru.branches],
        [kb.owner.pages.ru.cars, kb.owner.pages.ru.reports]
      ]
    },

    settings: {
      uz: [
        [kb.owner.settings.uz.name, kb.owner.settings.uz.number, kb.owner.settings.uz.language],
        [kb.main.uz]
      ],
      ru: [
        [kb.owner.settings.ru.name, kb.owner.settings.ru.number, kb.owner.settings.ru.language],
        [kb.main.ru]
      ]
    },

    branches: {
      uz: [
        [kb.owner.branches.uz.all, kb.owner.branches.uz.add],
        [kb.main.uz]
      ],
      ru: [
        [kb.owner.branches.ru.all, kb.owner.branches.ru.add],
        [kb.main.ru]
      ]
    },

    managers: {
      uz: [
        [kb.owner.managers.uz.all, kb.owner.managers.uz.add],
        [kb.main.uz]
      ],
      ru: [
        [kb.owner.managers.ru.all, kb.owner.managers.ru.add],
        [kb.main.ru]
      ]
    },

    cars: {
      uz: [
        [kb.owner.cars.uz.all, kb.owner.cars.uz.add],
        [kb.main.uz]
      ],
      ru: [
        [kb.owner.cars.ru.all, kb.owner.cars.ru.add],
        [kb.main.ru]
      ]
    },

    feedback: {
      uz: [
        [kb.owner.feedback.uz.read],
        [kb.owner.feedback.uz.number, kb.owner.feedback.uz.doing],
        [kb.main.uz]
      ],
      ru: [
        [kb.owner.feedback.ru.read],
        [kb.owner.feedback.ru.number, kb.owner.feedback.ru.doing],
        [kb.main.ru]
      ]
    },

    reports: {
      uz: [
        [kb.owner.reports.uz.day, kb.owner.reports.uz.five_day],
        [kb.owner.reports.uz.ten_day, kb.owner.reports.uz.week],
        [kb.owner.reports.uz.month, kb.owner.reports.uz.year],
        [kb.main.uz]
      ],
      ru: [
        [kb.owner.reports.ru.day, kb.owner.reports.ru.five_day],
        [kb.owner.reports.ru.ten_day, kb.owner.reports.ru.week],
        [kb.owner.reports.ru.month, kb.owner.reports.ru.year],
        [kb.main.ru]
      ]
    }
  },

  manager: {
    pages: {
      uz: [
        [kb.manager.pages.uz.settings, kb.manager.pages.uz.washes],
        [kb.manager.pages.uz.cars, kb.manager.pages.uz.employees],
        [kb.manager.pages.uz.branch]
      ],
      ru: [
        [kb.manager.pages.ru.settings, kb.manager.pages.ru.washes],
        [kb.manager.pages.ru.cars, kb.manager.pages.ru.employees],
        [kb.manager.pages.ru.branch]
      ]
    },

    settings: {
      uz: [
        [kb.manager.settings.uz.name, kb.manager.settings.uz.number, kb.manager.settings.uz.language],
        [kb.main.uz]
      ],
      ru: [
        [kb.manager.settings.ru.name, kb.manager.settings.ru.number, kb.manager.settings.ru.language],
        [kb.main.ru]
      ]
    },

    washes: {
      uz: [
        [kb.manager.washes.uz.today, kb.manager.washes.uz.washing],
        [kb.manager.washes.uz.add],
        [kb.main.uz]
      ],
      ru: [
        [kb.manager.washes.ru.today, kb.manager.washes.ru.washing],
        [kb.manager.washes.ru.add],
        [kb.main.ru]
      ]
    },

    employees: {
      uz: [
        [kb.manager.employees.uz.all, kb.manager.employees.uz.attendance],
        [kb.manager.employees.uz.add],
        [kb.main.uz]
      ],
      ru: [
        [kb.manager.employees.ru.all, kb.manager.employees.ru.attendance],
        [kb.manager.employees.ru.add],
        [kb.main.ru]
      ]
    },

    cars: {
      uz: [
        [kb.manager.cars.uz.all, kb.manager.cars.uz.add],
        [kb.main.uz]
      ],
      ru: [
        [kb.manager.cars.ru.all, kb.manager.cars.ru.add],
        [kb.main.ru]
      ]
    }
  },

  employee: {
    pages: {
      uz: [
        [kb.employee.pages.uz.settings, kb.employee.pages.uz.washes],
        [kb.employee.pages.uz.feedback, kb.employee.pages.uz.cars],
        [kb.employee.pages.uz.branch]
      ],
      ru: [
        [kb.employee.pages.ru.settings, kb.employee.pages.ru.washes],
        [kb.employee.pages.ru.feedback, kb.employee.pages.ru.cars],
        [kb.employee.pages.ru.branch]
      ]
    },

    settings: {
      uz: [
        [kb.employee.settings.uz.name, kb.employee.settings.uz.number, kb.employee.settings.uz.language],
        [kb.main.uz]
      ],
      ru: [
        [kb.employee.settings.ru.name, kb.employee.settings.ru.number, kb.employee.settings.ru.language],
        [kb.main.ru]
      ]
    },

    washes: {
      uz: [
        [kb.manager.washes.uz.today, kb.manager.washes.uz.washing],
        [kb.manager.washes.uz.add],
        [kb.main.uz]
      ],
      ru: [
        [kb.manager.washes.ru.today, kb.manager.washes.ru.washing],
        [kb.manager.washes.ru.add],
        [kb.main.ru]
      ]
    },

    feedback: {
      uz: [
        [kb.employee.feedback.uz.add, kb.employee.feedback.uz.my_feedback],
        [kb.main.uz]
      ],
      ru: [
        [kb.employee.feedback.ru.add, kb.employee.feedback.ru.my_feedback],
        [kb.main.ru]
      ]
    },

    cars: {
      uz: [
        [kb.employee.cars.uz.all],
        [kb.main.uz]
      ],
      ru: [
        [kb.employee.cars.ru.all],
        [kb.main.ru]
      ]
    }},

  client: {},

  options: {

    owner: {
      branch: {
        settings: {
          uz: [
            [kb.options.owner.branch.settings.uz.name, kb.options.owner.branch.settings.uz.manager],
            [kb.options.owner.branch.settings.uz.image, kb.options.owner.branch.settings.uz.location],
            [kb.options.back.uz]
          ],
          ru: [
            [kb.options.owner.branch.settings.ru.name, kb.options.owner.branch.settings.ru.manager],
            [kb.options.owner.branch.settings.ru.image, kb.options.owner.branch.settings.ru.location],
            [kb.options.back.ru]
          ]
        }
      },

      manager: {
        settings: {
          uz: [
            [kb.options.owner.manager.settings.uz.name, kb.options.owner.manager.settings.uz.branch],
            [kb.options.owner.manager.settings.uz.number, kb.options.owner.manager.settings.uz.username],
            [kb.options.back.uz]
          ],
          ru: [
            [kb.options.owner.manager.settings.ru.name, kb.options.owner.manager.settings.ru.branch],
            [kb.options.owner.manager.settings.ru.number, kb.options.owner.manager.settings.ru.username],
            [kb.options.back.ru]
          ]
        }
      }


    },

    confirmation: {
      uz: [[kb.options.confirmation.uz, kb.options.not_to_confirmation.uz]],
      ru: [[kb.options.confirmation.ru, kb.options.not_to_confirmation.ru]]
    },


    allow: {
      uz: [
        [kb.options.allow.uz.yes, kb.options.allow.uz.no]
      ],

      ru: [
        [kb.options.allow.ru.yes, kb.options.allow.ru.no]
      ]
    },

    order: {
      uz: [
        [kb.options.order.uz.order, kb.options.order.uz.clear],
        [kb.options.order.uz.edit, kb.main.uz]
      ],

      ru: [
        [kb.options.order.ru.order, kb.options.order.ru.clear],
        [kb.options.order.ru.edit, kb.main.ru]
      ]
    },

    feedback: {
      uz: [
        [kb.options.feedback.uz.good, kb.options.feedback.uz.bad],
        [kb.options.back.uz]
      ],

      ru: [
        [kb.options.feedback.ru.good, kb.options.feedback.ru.bad],
        [kb.options.back.ru]
      ]
    },

    situation: {
      uz: [
        [kb.options.situation.uz.increase, kb.options.situation.uz.decrease, kb.options.situation.uz.destroy],
        [kb.options.back.uz]
      ],

      ru: [
        [kb.options.situation.ru.increase, kb.options.situation.ru.decrease, kb.options.situation.ru.destroy],
        [kb.options.back.ru]
      ]
    },

    condition: {
      uz: [
        [kb.options.condition.uz.true],
        [kb.options.condition.uz.false]
      ],

      ru: [
        [kb.options.condition.ru.true],
        [kb.options.condition.ru.false]
      ]
    },

    back: {
      uz: [[kb.options.back.uz]],
      ru: [[kb.options.back.ru]],
    },


    confirmation_admin: [
      [kb.options.confirmation.uz, kb.options.not_to_confirmation.uz]
    ],
    confirmation_advertising: [
      [kb.options.confirmation_advertising.yes, kb.options.confirmation_advertising.no]
    ],

    task: [
      [kb.options.task.baker, kb.options.task.dough_maker],
      [kb.options.back.uz, kb.options.task.supplier]
    ],

    back_employee: [[kb.options.back.ru]],

    delivered: [[kb.options.delivered]]
  }
}
