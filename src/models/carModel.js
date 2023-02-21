const {Schema, model} = require('mongoose'), {v4} = require('uuid')

const Car = model('Car', new Schema({
  _id: {type: String, default: v4},
  author: {type: Number, ref: 'Admin', required: true},
  name: {type: String, default: ''},
  type: {type: String, default: ''},
  description: {type: String, default: ''},
  image: {type: String, default: ''},
  total_fees: {type: Number, default: 0},
  total_washes: {type: Number, default: 0},
  step: {type: Number, default: 4},
  status: {type: String, enum: ['process', 'inactive', 'active'], default: 'active'},
  created_at: {type: Date, default: Date.now}
}))


// const {DataTypes} = require("sequelize"), db = require("./../helpers/db"), Admin = require('./adminModel');
//
// const Car = db.define('Car', {
//   _id: {type: DataTypes.STRING, defaultValue: DataTypes.UUIDV4},
//   author: {type: DataTypes.INTEGER, references: {model: Admin, key: 'telegram_id'}, allowNull: false},
//   name: {type: DataTypes.STRING, defaultValue: ''},
//   type: {type: DataTypes.STRING, defaultValue: ''},
//   description: {type: DataTypes.STRING, defaultValue: ''},
//   image: {type: DataTypes.STRING, defaultValue: ''},
//   total_fees: {type: DataTypes.INTEGER, defaultValue: 0},
//   total_washes: {type: DataTypes.INTEGER, defaultValue: 0},
//   step: {type: DataTypes.INTEGER, defaultValue: 0},
//   status: {type: DataTypes.ENUM, values: ['process', 'inactive', 'active'], defaultValue: 'process'},
//   created_at: {type: DataTypes.DATE, defaultValue: DataTypes.NOW}
// })

module.exports = Car
