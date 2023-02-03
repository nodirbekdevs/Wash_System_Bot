const Client = require('./../models/clientModel')

const getClients = async (query) => {
  try {
    return await Client.find(query).sort({createdAt: -1})
  } catch (e) {
    console.log(e)
  }
}

const getClient = async (query) => {
  try {
    return await Client.findOne(query)
  } catch (e) {
    console.log(e)
  }
}

const makeClient = async (data) => {
  try {
    return  await Client.create(data)
  } catch (e) {
    console.log(e)
  }
}

const updateClient = async (query, data, text) => {
  try {
    return await Client.findOneAndUpdate(query, data)
  } catch (e) {
    console.log(e)
  }
}

const deleteClient = async (query) => {
  try {
    return await Client.findOneAndDelete(query)
  } catch (e) {
    console.log(e)
  }
}

const countClients = async (query) => {
  try {
    return await Client.countDocuments(query)
  } catch (e) {
    console.log(e)
  }
}

module.exports = {getClients, getClient, makeClient, updateClient, deleteClient, countClients}
