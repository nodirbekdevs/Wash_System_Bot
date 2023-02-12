const {Schema, model} = require('mongoose')
const {v4} = require('uuid')

const Wash = model('Wash', new Schema({
  _id: {type: String, default: v4},
  manager: {type: Number, ref: 'Manager', default: 0},
  employee: {type: String, ref: 'Employee', default: ''},
  branch: {type: String, ref: 'Branch', default: ''},
  client: {type: Number, ref: 'Client', default: 0},
  fee: {type: String, ref: 'Fee', default: ''},
  car: {type: String, ref: 'Car', default: ''},
  car_type: {type: String, default: ''},
  car_number: {type: String, default: ''},
  date: {type: String, default: ''},
  time: {type: String, default: ''},
  cash: {type: Number, default: 0},
  price: {type: Number, default: 0},
  benefit: {type: Number, default: 0},
  step: {type: Number, default: 0},
  status: {type: String, enum: ['process', 'inactive', 'active', 'washing', 'washed'], default: 'process'},
  washed_time: {
    started_at: {type: Date},
    washed_at: {type: Date}
  },
  created_at: {type: Date, default: Date.now}
}))

module.exports = Wash
