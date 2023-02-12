const {Schema, model} = require('mongoose')
const {v4} = require('uuid')

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

module.exports = Manager
