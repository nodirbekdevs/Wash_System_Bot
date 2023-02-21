require('dotenv').config()

module.exports = {
  TOKEN: process.env.TOKEN,
  MAP_OPTIONS: {
    provider: process.env.provider,
    httpAdapter: process.env.httpAdapter,
    apiKey: process.env.apiKey,
    formatter: process.env.formatter
  },

  mongo: {
    options: {
      useNewUrlParser: process.env.useNewUrlParser,
      useUnifiedTopology: process.env.useUnifiedTopology,
      serverSelectionTimeoutMS: process.env.serverSelectionTimeoutMS
    },
    mongo_url: process.env.mongo_url,
  },

  database_name: process.env.database_name,
  username: process.env.username,
  password: process.env.password,
}
