const {Schema, model} = require('mongoose')
const {v4} = require('uuid')

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

module.exports = Client
