const {Schema, model} = require('mongoose'), {v4} = require('uuid')

const Client = model('Client', new Schema({
  _id: {type: String, default: v4},
  telegram_id: {type: Number, unique: true},
  name: {type: String, default: ''},
  username: {type: String, default: ''},
  password: {type: String, default: ''},
  number: {type: String, default: ''},
  total_washes: {type: Number, default: 0},
  total_feedback: {type: Number, default: 0},
  lang: {type: String, default: ''},
  step: {type: Number, default: 0},
  status: {type: String, enum: ['process', 'inactive', 'active'], default: 'process'},
  created_at: {type: Date, default: Date.now}
}))

// const {DataTypes} = require("sequelize"), db = require("./../helpers/db");
//
// const Client = db.define('Client', {
//   _id: {type: DataTypes.STRING, defaultValue: DataTypes.UUIDV4},
//   telegram_id: {type: DataTypes.INTEGER, unique: true},
//   name: {type: DataTypes.STRING, defaultValue: ''},
//   username: {type: DataTypes.STRING, defaultValue: ''},
//   password: {type: DataTypes.STRING, defaultValue: ''},
//   number: {type: DataTypes.STRING, defaultValue: ''},
//   total_washes: {type: DataTypes.INTEGER, defaultValue: 0},
//   total_feedback: {type: DataTypes.INTEGER, defaultValue: 0},
//   lang: {type: DataTypes.STRING, defaultValue: ''},
//   step: {type: DataTypes.INTEGER, defaultValue: 0},
//   status: {type: DataTypes.ENUM, values: ['process', 'inactive', 'active'], defaultValue: 'process'},
//   created_at: {type: DataTypes.DATE, defaultValue: DataTypes.NOW}
// })

module.exports = Client
