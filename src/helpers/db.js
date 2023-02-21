const {mongo} = require('./config'), {connect} = require('mongoose')


const db = connect(mongo.mongo_url, mongo.options)
  .then(() => {
    console.log('To MongoDb has connected ...')
  })
  .catch((err) => {
    console.log(`To MongoDb has not connected and problem has kept ${err}`)
  })

// const { Sequelize } = require('sequelize');
//
// const db = new Sequelize(`postgres://${username}:${password}@localhost:5432/${database_name}`)
//
// const db = new Sequelize(database_name, username, password, {
//   host: 'localhost',
//   dialect: 'postgres'
// })
//
// db.sync({ force: false }).then(() => console.log("Database connection created"));
//
// db.authenticate().then(() => console.log("Database connection created")).catch(e => console.log(e))

module.exports = db
