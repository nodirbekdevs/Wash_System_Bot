const {mongo_url, mongo_options} = require('./config')
const {connect} = require('mongoose')

const db = connect(mongo_url, mongo_options)
  .then(() => {
    console.log('To MongoDb has connected ...')
  })
  .catch((err) => {
    console.log(`To MongoDb has not connected and problem has kept ${err}`)
  })

module.exports = db
