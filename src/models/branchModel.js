const {Schema, model} = require('mongoose'), {v4} = require('uuid')

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
  situation: {type: String, enum: ['', 'edit', 'report', 'wash', 'employee'], default: ''},
  total_fees: {type: Number, default: 0},
  total_employees: {type: Number, default: 0},
  total_washes: {type: Number, default: 0},
  step: {type: Number, default: 0},
  status: {type: String, enum: ['process', 'active', 'inactive', 'provided'], default: 'process'},
  created_at: {type: Date, default: Date.now()}
}))

// const {DataTypes} = require("sequelize"), db = require("./../helpers/db"), Owner = require('./ownerModel'),
//   Manager = require('./managerModel');
//
// const Branch = db.define('Branch', {
//   _id: {type: DataTypes.STRING, defaultValue: DataTypes.UUIDV4},
//   owner: {type: DataTypes.INTEGER, references: {model: Owner, key: 'telegram_id'}, defaultValue: 0},
//   manager: {type: DataTypes.INTEGER, references: {model: Manager, key: 'telegram_id'}, defaultValue: 0},
//   name: {type: DataTypes.STRING, defaultValue: ''},
//   image: {type: DataTypes.STRING, defaultValue: ''},
//   // location: {
//   //   name: {type: DataTypes.STRING, defaultValue: ''},
//   //   latitude: {type: DataTypes.STRING, defaultValue: ''},
//   //   longitude: {type: DataTypes.STRING, defaultValue: ''}
//   // },
//   location: {type: DataTypes.JSON, defaultValue: {}},
//   total_fees: {type: DataTypes.INTEGER, defaultValue: 0},
//   total_employees: {type: DataTypes.INTEGER, defaultValue: 0},
//   total_washes: {type: DataTypes.INTEGER, defaultValue: 0},
//   step: {type: DataTypes.INTEGER, defaultValue: 0},
//   status: {type: DataTypes.ENUM, values: ['process', 'inactive', 'active', 'provided'], defaultValue: 'process'},
//   created_at: {type: DataTypes.DATE, defaultValue: DataTypes.NOW}
// })

module.exports = Branch
