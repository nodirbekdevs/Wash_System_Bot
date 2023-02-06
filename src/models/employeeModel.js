const {Schema, model} = require('mongoose')
const {v4} = require('uuid')

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

module.exports = Employee
