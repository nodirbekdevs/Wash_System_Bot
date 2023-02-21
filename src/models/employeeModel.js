const {Schema, model} = require('mongoose'), {v4} = require('uuid')

const Employee = model('Employee', new Schema({
  _id: {type: String, default: v4},
  telegram_id: {type: Number, unique: true},
  manager: {type: Number, ref: 'Manager', required: true},
  branch: {type: String, ref: 'Branch', default: ''},
  name: {type: String, default: ''},
  username: {type: String, default: ''},
  password: {type: String, default: ''},
  number: {type: String, default: ''},
  total_washes: {type: Number, default: 0},
  total_feedback: {type: Number, default: 0},
  is_idler: {type: Boolean, default: false},
  lang: {type: String, default: ''},
  step: {type: Number, default: 0},
  status: {type: String, enum: ['process', 'inactive', 'active', 'unemployed'], default: 'process'},
  dismissal_at: {type: Date},
  created_at: {type: Date, default: Date.now}
}))

// const {DataTypes} = require("sequelize"), db = require("./../helpers/db"), Manager = require('./managerModel'),
//   Branch = require('./branchModel');
//
// const Employee = db.define('Employee', {
//   _id: {type: DataTypes.STRING, defaultValue: DataTypes.UUIDV4},
//   telegram_id: {type: DataTypes.INTEGER, unique: true},
//   manager: {type: DataTypes.INTEGER, references: {model: Manager, key: 'telegram_id'}, allowNull: false},
//   branch: {type: DataTypes.INTEGER, references: {model: Branch, key: 'telegram_id'}, allowNull: false},
//   name: {type: DataTypes.STRING, defaultValue: ''},
//   username: {type: DataTypes.STRING, defaultValue: ''},
//   password: {type: DataTypes.STRING, defaultValue: ''},
//   number: {type: DataTypes.STRING, defaultValue: ''},
//   total_washes: {type: DataTypes.INTEGER, defaultValue: 0},
//   total_feedback: {type: DataTypes.INTEGER, defaultValue: 0},
//   is_idler: {type: DataTypes.BOOLEAN, defaultValue: false},
//   lang: {type: DataTypes.STRING, defaultValue: ''},
//   step: {type: DataTypes.INTEGER, defaultValue: 0},
//   status: {type: DataTypes.ENUM, values: ['process', 'inactive', 'active'], defaultValue: 'process'},
//   dismissal_at: {type: DataTypes.DATE},
//   created_at: {type: DataTypes.DATE, defaultValue: DataTypes.NOW}
// })

module.exports = Employee
