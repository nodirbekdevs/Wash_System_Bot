const {Schema, model} = require('mongoose')
const {v4} = require('uuid')

const Fee = model('Fee', new Schema({
  _id: {type: String, default: v4},
  owner: {type: Number, ref: 'Owner', default: 0},
  manager: {type: Number, ref: 'Manager', default: 0},
  branch: {type: String, ref: 'Branch', default: ''},
  image: {type: String, default: ''},
  name: {type: String, default: ''},
  description: {type: String, default: ''},
  cars: [{type: String, default: []}],
  cash: {type: Number, default: 0},
  price: {type: Number, default: 0},
  total_washes: {type: Number, default: 0},
  step: {type: Number, default: 0},
  status: {type: String, enum: ['process', 'inactive', 'active'], default: 'process'},
  created_at: {type: Date, default: Date.now}
}))

module.exports = Fee
