const {Schema, model} = require('mongoose')
const {v4} = require('uuid')

const DailyWash = model('DailyWash', new Schema({
  _id: {type: String, default: v4},
  manager: {type: Number, ref: 'Manager', unique: true},
  branch: {type: String, ref: 'Branch', default: ''},
  title: {type: String, default: ''},
  washes: [{type: String, ref: 'Wash', default: []}],
  total_washes: {type: Number, default: 0},
  benefit: {type: Number, default: 0},
  status: {type: String, enum: ['process', 'inactive', 'active', 'washing', 'washed'], default: 'process'},
  created_at: {type: Date, default: Date.now}
}))

module.exports = DailyWash
