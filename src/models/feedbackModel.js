const {Schema, model} = require('mongoose'), {v4} = require('uuid')

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

// const {DataTypes} = require("sequelize"), db = require("./../helpers/db"), Owner = require('./ownerModel'),
//   Branch = require('./branchModel');
//
// const Feedback = db.define('Feedback', {
//   _id: {type: DataTypes.STRING, defaultValue: DataTypes.UUIDV4},
//   author: {type: DataTypes.INTEGER, allowNull: false},
//   branch_owner: {type: DataTypes.INTEGER, references: {model: Owner, key: 'telegram_id'}, defaultValue: 0},
//   branch: {type: DataTypes.STRING, references: {model: Branch, key: 'name'}, defaultValue: ''},
//   is_employee: {type: DataTypes.BOOLEAN, defaultValue: false},
//   mark: {type: DataTypes.STRING, defaultValue: ''},
//   reason: {type: DataTypes.STRING, defaultValue: ''},
//   is_read: {type: DataTypes.BOOLEAN, defaultValue: false},
//   step: {type: DataTypes.INTEGER, defaultValue: 0},
//   status: {type: DataTypes.ENUM, values: ['process', 'inactive', 'active', 'seen', 'done'], defaultValue: 'process'},
//   created_at: {type: DataTypes.DATE, defaultValue: DataTypes.NOW}
// })

module.exports = Feedback
