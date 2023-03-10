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
      [kb.admin.pages.settings, kb.admin.pages.advertisements],
      [kb.admin.pages.cars, kb.admin.pages.owners]
    ],

    settings: [
      [kb.admin.settings.name, kb.admin.settings.number],
      [kb.main.uz]
    ],

    advertisements: [
      [kb.admin.advertisements.add],
      [kb.admin.advertisements.all, kb.admin.advertisements.number],
      [kb.main.uz]
    ],

    cars: [
      [kb.admin.cars.add],
      [kb.admin.cars.all, kb.admin.cars.number],
      [kb.main.uz]
    ],

    owners: [
      [kb.admin.owners.add],
      [kb.admin.owners.all, kb.admin.owners.number],
      [kb.main.uz]
    ],
  },

  owner: {
    pages: {
      uz: [
        [kb.owner.pages.uz.settings, kb.owner.pages.uz.feedback],
        [kb.owner.pages.uz.managers, kb.owner.pages.uz.branches],
        [kb.owner.pages.uz.fees, kb.owner.pages.uz.reports],
        [kb.owner.pages.uz.washes, kb.owner.pages.uz.employees]
      ],
      ru: [
        [kb.owner.pages.ru.settings, kb.owner.pages.ru.feedback],
        [kb.owner.pages.ru.managers, kb.owner.pages.ru.branches],
        [kb.owner.pages.ru.fees, kb.owner.pages.ru.reports],
        [kb.owner.pages.ru.washes, kb.owner.pages.ru.employees]
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

    fees: {
      uz: [
        [kb.owner.fees.uz.all, kb.owner.fees.uz.add],
        [kb.main.uz]
      ],
      ru: [
        [kb.owner.fees.ru.all, kb.owner.fees.ru.add],
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
        [kb.owner.reports.uz.one_day, kb.owner.reports.uz.other_days],
        [kb.options.back.uz]
      ],
      ru: [
        [kb.owner.reports.ru.one_day, kb.owner.reports.ru.other_days],
        [kb.options.back.ru]
      ]
    },

    washes: {
      uz: [
        [kb.owner.washes.uz.washed, kb.owner.washes.uz.washing],
        [kb.main.uz]
      ],
      ru: [
        [kb.owner.washes.ru.washed, kb.owner.washes.ru.washing],
        [kb.main.ru]
      ]
    },

    employees: {
      uz: [
        [kb.owner.employees.uz.all, kb.owner.employees.uz.working],
        [kb.owner.employees.uz.do_not_work],
        [kb.main.uz]
      ],
      ru: [
        [kb.owner.employees.ru.all, kb.owner.employees.ru.working],
        [kb.owner.employees.ru.do_not_work],
        [kb.main.ru]
      ]
    }
  },

  manager: {
    pages: {
      uz: [
        [kb.manager.pages.uz.settings, kb.manager.pages.uz.washes],
        [kb.manager.pages.uz.fees, kb.manager.pages.uz.employees],
        [kb.manager.pages.uz.branch]
      ],
      ru: [
        [kb.manager.pages.ru.settings, kb.manager.pages.ru.washes],
        [kb.manager.pages.ru.fees, kb.manager.pages.ru.employees],
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

    // fees: {
    //   uz: [
    //     [kb.manager.fees.uz.all, kb.manager.fees.uz.edit],
    //     [kb.main.uz]
    //   ],
    //   ru: [
    //     [kb.manager.fees.ru.all, kb.manager.fees.ru.edit],
    //     [kb.main.ru]
    //   ]
    // }
  },

  employee: {
    pages: {
      uz: [
        [kb.employee.pages.uz.settings, kb.employee.pages.uz.washes],
        [kb.employee.pages.uz.feedback, kb.employee.pages.uz.fees],
        [kb.employee.pages.uz.branch]
      ],
      ru: [
        [kb.employee.pages.ru.settings, kb.employee.pages.ru.washes],
        [kb.employee.pages.ru.feedback, kb.employee.pages.ru.fees],
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
        [kb.employee.washes.uz.today, kb.employee.washes.uz.all],
        [kb.main.uz]
      ],
      ru: [
        [kb.employee.washes.ru.today, kb.employee.washes.ru.all],
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
  },

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
      },

      fee: {
        settings: {
          uz: [
            [kb.options.owner.fee.settings.uz.name, kb.options.owner.fee.settings.uz.description, kb.options.owner.fee.settings.uz.image],
            [kb.options.owner.fee.settings.uz.cash, kb.options.owner.fee.settings.uz.car, kb.options.owner.fee.settings.uz.price],
            [kb.options.back.uz]
          ],
          ru: [
            [kb.options.owner.fee.settings.ru.name, kb.options.owner.fee.settings.ru.description, kb.options.owner.fee.settings.ru.image],
            [kb.options.owner.fee.settings.ru.cash, kb.options.owner.fee.settings.ru.car, kb.options.owner.fee.settings.ru.price],
            [kb.options.back.ru]
          ]
        }
      }
    },

    confirmation: {
      uz: [[kb.options.confirmation.uz, kb.options.not_to_confirmation.uz]],
      ru: [[kb.options.confirmation.ru, kb.options.not_to_confirmation.ru]]
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

    back: {
      uz: [[kb.options.back.uz]],
      ru: [[kb.options.back.ru]],
    },

    confirmation_advertising: [
      [kb.options.confirmation_advertising.yes, kb.options.confirmation_advertising.no]
    ],
  }
}
