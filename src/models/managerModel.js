const {Schema, model} = require('mongoose'), {v4} = require('uuid')

const Manager = model('Manager', new Schema({
  _id: {type: String, default: v4},
  telegram_id: {type: Number, unique: true},
  owner: {type: Number, ref: 'Owner', default: ''},
  branch: {type: String, ref: 'Branch', default: ''},
  name: {type: String, default: ''},
  username: {type: String, default: ''},
  password: {type: String, default: ''},
  number: {type: String, default: ''},
  total_employees: {type: Number, default: 0},
  lang: {type: String, default: ''},
  step: {type: Number, default: 0},
  status: {type: String, enum: ['process', 'active', 'inactive', 'occupied'], default: 'process'},
  created_at: {type: Date, default: Date.now()}
}))


// const {DataTypes} = require("sequelize"), db = require("./../helpers/db"), Owner = require('./ownerModel'),
//   Branch = require('./branchModel');
//
// const Manager = db.define('Manager', {
//   _id: {type: DataTypes.STRING, defaultValue: DataTypes.UUIDV4},
//   telegram_id: {type: DataTypes.INTEGER, unique: true},
//   owner: {type: DataTypes.INTEGER, references: {model: Owner, key: 'telegram_id'}, defaultValue: 0},
//   branch: {type: DataTypes.STRING, references: {model: Branch, key: 'name'}, defaultValue: ''},
//   name: {type: DataTypes.STRING, defaultValue: ''},
//   username: {type: DataTypes.STRING, defaultValue: ''},
//   password: {type: DataTypes.STRING, defaultValue: ''},
//   number: {type: DataTypes.STRING, defaultValue: ''},
//   total_employees: {type: DataTypes.INTEGER, defaultValue: 0},
//   lang: {type: DataTypes.STRING, defaultValue: ''},
//   step: {type: DataTypes.INTEGER, defaultValue: 0},
//   status: {type: DataTypes.ENUM, values: ['process', 'inactive', 'active', 'occupied'], defaultValue: 'process'},
//   created_at: {type: DataTypes.DATE, defaultValue: DataTypes.NOW}
// })

module.exports = Manager
