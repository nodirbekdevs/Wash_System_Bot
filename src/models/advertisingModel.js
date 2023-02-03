const {Schema, model} = require('mongoose')
const {v4} = require('uuid')

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

module.exports = Advertising
