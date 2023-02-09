const {Schema, model} = require('mongoose')
const {v4} = require('uuid')

const Car = model('Car', new Schema({
  _id: {type: String, default: v4},
  author: {type: Number, ref: 'Admin', required: true},
  name: {type: String, default: ''},
  type: {type: String, default: ''},
  description: {type: String, default: ''},
  image: {type: String, default: ''},
  total_types: {type: Number, default: 0},
  total_washes: {type: Number, default: 0},
  step: {type: Number, default: 4},
  status: {type: String, enum: ['process', 'inactive', 'active'], default: 'active'},
  created_at: {type: Date, default: Date.now}
}))

module.exports = Car
