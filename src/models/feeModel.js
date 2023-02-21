const {Schema, model} = require('mongoose'), {v4} = require('uuid')

const Fee = model('Fee', new Schema({
  _id: {type: String, default: v4},
  owner: {type: Number, ref: 'Owner', default: 0},
  manager: {type: Number, ref: 'Manager', default: 0},
  branch: {type: String, ref: 'Branch', default: ''},
  image: {type: String, default: ''},
  name: {type: String, default: ''},
  description: {type: String, default: ''},
  cars: [{type: String, default: []}],
  cash: {type: Number, default: 0},
  price: {type: Number, default: 0},
  total_washes: {type: Number, default: 0},
  step: {type: Number, default: 0},
  status: {type: String, enum: ['process', 'inactive', 'active'], default: 'process'},
  created_at: {type: Date, default: Date.now}
}))

// const {DataTypes} = require("sequelize"), db = require("./../helpers/db"), Owner = require('./ownerModel'),
//   Manager = require('./managerModel'), Branch = require('./branchModel');
//
// const Fee = db.define('Fee', {
//   _id: {type: DataTypes.STRING, defaultValue: DataTypes.UUIDV4},
//   owner: {type: DataTypes.INTEGER, references: {model: Owner, key: 'telegram_id'}, defaultValue: 0},
//   manager: {type: DataTypes.INTEGER, references: {model: Manager, key: 'telegram_id'}, defaultValue: 0},
//   branch: {type: DataTypes.STRING, references: {model: Branch, key: 'name'}, defaultValue: ''},
//   image: {type: DataTypes.STRING, defaultValue: ''},
//   name: {type: DataTypes.STRING, defaultValue: ''},
//   description: {type: DataTypes.STRING, defaultValue: ''},
//   cars: {type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: []},
//   cash: {type: DataTypes.INTEGER, defaultValue: 0},
//   price: {type: DataTypes.INTEGER, defaultValue: 0},
//   total_washes: {type: DataTypes.INTEGER, defaultValue: 0},
//   step: {type: DataTypes.INTEGER, defaultValue: 0},
//   status: {type: DataTypes.ENUM, values: ['process', 'inactive', 'active'], defaultValue: 'process'},
//   created_at: {type: DataTypes.DATE, defaultValue: DataTypes.NOW}
// })

module.exports = Fee
