const {Schema, model} = require('mongoose'), {v4} = require('uuid')

const Advertising = model('Advertising', new Schema({
  _id: {type: String, default: v4},
  author: {type: Number, ref: 'Admin', required: true},
  image: {type: String, default: ''},
  title: {type: String, default: ''},
  description: {type: String, default: ''},
  is_send: {type: Boolean, default: false},
  step: {type: Number, default: 0},
  status: {type: String, enum: ['process', 'inactive', 'active', 'approved'], default: 'process'},
  created_at: {type: Date, default: Date.now}
}))

// const {DataTypes} = require("sequelize"), db = require("./../helpers/db"), Admin = require('./adminModel');
//
// const Advertising = db.define('Advertising', {
//   _id: {type: DataTypes.STRING, defaultValue: DataTypes.UUIDV4},
//   author: {type: DataTypes.INTEGER, references: {model: Admin, key: 'telegram_id'}, allowNull: false},
//   image: {type: DataTypes.STRING, defaultValue: ''},
//   title: {type: DataTypes.STRING, defaultValue: ''},
//   description: {type: DataTypes.TEXT, defaultValue: ''},
//   is_send: {type: DataTypes.BOOLEAN, defaultValue: false},
//   step: {type: DataTypes.INTEGER, defaultValue: 0},
//   status: {type: DataTypes.ENUM, values: ['process', 'inactive', 'active', 'approved'], defaultValue: 'process'},
//   created_at: {type: DataTypes.DATE, defaultValue: DataTypes.NOW}
// })

module.exports = Advertising
