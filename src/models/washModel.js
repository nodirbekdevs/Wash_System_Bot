const {Schema, model} = require('mongoose'), {v4} = require('uuid')

const Wash = model('Wash', new Schema({
  _id: {type: String, default: v4},
  manager: {type: Number, ref: 'Manager', default: 0},
  employee: {type: String, ref: 'Employee', default: ''},
  branch: {type: String, ref: 'Branch', default: ''},
  client: {type: Number, ref: 'Client', default: 0},
  fee: {type: String, ref: 'Fee', default: ''},
  car: {type: String, ref: 'Car', default: ''},
  car_type: {type: String, default: ''},
  car_number: {type: String, default: ''},
  date: {type: String, default: ''},
  time: {type: String, default: ''},
  cash: {type: Number, default: 0},
  price: {type: Number, default: 0},
  benefit: {type: Number, default: 0},
  step: {type: Number, default: 0},
  status: {type: String, enum: ['process', 'inactive', 'active', 'washing', 'washed'], default: 'process'},
  washed_time: {
    started_at: {type: Date},
    washed_at: {type: Date}
  },
  created_at: {type: Date, default: Date.now}
}))


// const {DataTypes} = require("sequelize"), db = require("./../helpers/db"), Manager = require('./managerModel'),
//   Branch = require('./branchModel'), Employee = require('./employeeModel'),
//   Fee = require('./feeModel'), Client = require('./clientModel'), Car = require('./carModel');
//
// const Wash = db.define('Wash', {
//   _id: {type: DataTypes.STRING, defaultValue: DataTypes.UUIDV4},
//   manager: {type: DataTypes.INTEGER, references: {model: Manager, key: 'telegram_id'}, defaultValue: 0},
//   employee: {type: DataTypes.STRING, references: {model: Employee, key: 'name'}, defaultValue: ''},
//   branch: {type: DataTypes.STRING, references: {model: Branch, key: 'name'}, defaultValue: ''},
//   client: {type: DataTypes.INTEGER, references: {model: Client, key: 'telegram_id'}, defaultValue: ''},
//   fee: {type: DataTypes.STRING, references: {model: Fee, key: 'name'}, defaultValue: ''},
//   car: {type: DataTypes.STRING, references: {model: Car, key: 'name'}, defaultValue: ''},
//   car_type: {type: DataTypes.STRING, defaultValue: ''},
//   car_number: {type: DataTypes.STRING, defaultValue: ''},
//   date: {type: DataTypes.STRING, defaultValue: ''},
//   time: {type: DataTypes.STRING, defaultValue: ''},
//   cash: {type: DataTypes.INTEGER, defaultValue: 0},
//   price: {type: DataTypes.INTEGER, defaultValue: 0},
//   benefit: {type: DataTypes.INTEGER, defaultValue: 0},
//   step: {type: DataTypes.INTEGER, defaultValue: 0},
//   status: {type: DataTypes.ENUM, values: ['process', 'inactive', 'active', 'washing', 'washed'], defaultValue: 'process'},
//   created_at: {type: DataTypes.DATE, defaultValue: DataTypes.NOW},
//   ended_at: {type: DataTypes.DATE, allowNull: true}
// })

module.exports = Wash
