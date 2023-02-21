const {Schema, model} = require('mongoose'), {v4} = require('uuid')

const Admin = model('Admin', new Schema({
  _id: {type: String, default: v4},
  telegram_id: {type: Number, unique: true, required: true},
  name: {type: String, default: ''},
  username: {type: String, default: ''},
  password: {type: String, default: ''},
  number: {type: String, default: ''},
  type: {type: String, enum: ['admin', 'super_admin'], default: 'super_admin'},
  advertisements: [{type: String, ref: 'Advertising', default: []}],
  owners: [{type: String, ref: 'Owner', default: ''}],
  total_advertisements: {type: Number, default: 0},
  total_owners: {type: Number, default: 0},
  step: {type: Number, default: 0},
  status: {type: String, enum: ['active', 'inactive'], default: 'active'},
  created_at: {type: Date, default: Date.now()}
}))

// const {DataTypes} = require("sequelize"), db = require("./../helpers/db");
//
// const Admin = db.define('Admin', {
//   _id: {type: DataTypes.STRING, defaultValue: DataTypes.UUIDV4},
//   telegram_id: {type: DataTypes.INTEGER, unique: true, allowNull: true},
//   name: {type: DataTypes.STRING, defaultValue: ''},
//   username: {type: DataTypes.STRING, defaultValue: ''},
//   password: {type: DataTypes.STRING, defaultValue: ''},
//   number: {type: DataTypes.STRING, defaultValue: ''},
//   type: {type: DataTypes.ENUM, values: ['admin', 'super_admin'], defaultValue: 'super_admin'},
//   advertisements: {type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: []},
//   owners: {type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: []},
//   total_advertisements: {type: DataTypes.INTEGER, defaultValue: 0},
//   total_owners: {type: DataTypes.INTEGER, defaultValue: 0},
//   step: {type: DataTypes.INTEGER, defaultValue: 0},
//   status: {type: DataTypes.ENUM, values: ['active', 'inactive'], defaultValue: 'active'},
//   created_at: {type: DataTypes.DATE, defaultValue: DataTypes.NOW}
// })

module.exports = Admin
