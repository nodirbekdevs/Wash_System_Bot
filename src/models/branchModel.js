const {Schema, model} = require('mongoose')
const {v4} = require('uuid')

const Branch = model('Branch', new Schema({
  _id: {type: String, default: v4},
  owner: {type: Number, ref: 'Owner', default: 0},
  manager: {type: Number, ref: 'Manager', default: 0},
  name: {type: String, default: ''},
  image: {type: String, default: ''},
  location: {
    name: {type: String, default: ''},
    latitude: {type: String, default: ''},
    longitude: {type: String, default: ''}
  },
  total_employees: {type: Number, default: 0},
  total_washes: {type: Number, default: 0},
  step: {type: Number, default: 0},
  status: {type: String, enum: ['process', 'active', 'inactive', 'provided'], default: 'process'},
  created_at: {type: Date, default: Date.now()}
}))

module.exports = Branch
