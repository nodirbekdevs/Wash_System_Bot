const {Schema, model} = require('mongoose')
const {v4} = require('uuid')

const Work = model('Work', new Schema({
  _id: {type: String, default: v4},
  admin: {type: Number, ref: 'Admin', required: true},
  type: {type: String, enum: ['On', 'Off'], default: 'Off'},
  description: {type: String, default: ''},
  status: {type: String, enum: ['active', 'inactive'], default: 'active'},
  created_at: {type: Date, default: Date.now}
}))

module.exports = Work
