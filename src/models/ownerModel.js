const {Schema, model} = require('mongoose')
const {v4} = require('uuid')

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

module.exports = Owner
