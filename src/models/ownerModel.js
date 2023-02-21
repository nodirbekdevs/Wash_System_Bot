const {Schema, model} = require('mongoose'), {v4} = require('uuid')

const Owner = model('Owner', new Schema({
  _id: {type: String, default: v4},
  telegram_id: {type: Number, unique: true},
  name: {type: String, default: ''},
  username: {type: String, default: ''},
  password: {type: String, default: ''},
  number: {type: String, default: ''},
  total_branches: {type: Number, default: 0},
  total_managers: {type: Number, default: 0},
  is_paid: {type: Boolean, default: false},
  balance: {type: Number, default: 0},
  lang: {type: String, default: ''},
  step: {type: Number, default: 0},
  status: {type: String, enum: ['process', 'active', 'inactive'], default: 'process'},
  created_at: {type: Date, default: Date.now()}
}))


// const {DataTypes} = require("sequelize"), db = require("./../helpers/db");
//
// const Owner = db.define('Owner', {
//   _id: {type: DataTypes.STRING, defaultValue: DataTypes.UUIDV4},
//   telegram_id: {type: DataTypes.INTEGER, unique: true},
//   name: {type: DataTypes.STRING, defaultValue: ''},
//   username: {type: DataTypes.STRING, defaultValue: ''},
//   password: {type: DataTypes.STRING, defaultValue: ''},
//   number: {type: DataTypes.STRING, defaultValue: ''},
//   total_branches: {type: DataTypes.INTEGER, defaultValue: 0},
//   total_managers: {type: DataTypes.INTEGER, defaultValue: 0},
//   is_paid: {type: DataTypes.BOOLEAN, defaultValue: false},
//   balance: {type: DataTypes.INTEGER, defaultValue: 0},
//   lang: {type: DataTypes.STRING, defaultValue: ''},
//   step: {type: DataTypes.INTEGER, defaultValue: 0},
//   status: {type: DataTypes.ENUM, values: ['process', 'inactive', 'active'], defaultValue: 'process'},
//   created_at: {type: DataTypes.DATE, defaultValue: DataTypes.NOW}
// })

module.exports = Owner
