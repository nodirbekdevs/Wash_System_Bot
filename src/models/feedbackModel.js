const {Schema, model} = require('mongoose')
const {v4} = require('uuid')

const Feedback = model('Feedback', new Schema({
  _id: {type: String, default: v4},
  author: {type: Number, required: true},
  branch: {type: String, ref: 'Branch', default: ''},
  branch_owner: {type: Number, ref: 'Owner', default: 0},
  is_employee: {type: Boolean, default: false},
  mark: {type: String, default: ''},
  reason: {type: String, default: ''},
  is_read: {type: Boolean, default: false},
  step: {type: Number, default: 0},
  status: {type: String, enum: ['process', 'inactive', 'active', 'seen', 'done'], default: 'process'},
  created_at: {type: Date, default: Date.now}
}))

module.exports = Feedback
