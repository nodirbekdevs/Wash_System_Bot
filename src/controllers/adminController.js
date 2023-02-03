const Admin = require('./../models/adminModel')

const getAdmins = async (query) => {
  try {
    return await Admin.find(query)
  } catch (e) {
    console.log(e)
  }
}

const getAdmin = async (query) => {
  try {
    return await Admin.findOne(query)
  } catch (e) {
    console.log(e)
  }
}

const makeAdmin = async (data) => {
  try {
    return await Admin.create(data)
  } catch (e) {
    console.log(e)
  }
}

const updateAdmin = async (query, data) => {
  try {
    return await Admin.findOneAndUpdate(query, data, {new: true})
  } catch (e) {
    console.log(e)
  }
}

const deleteAdmin = async (query) => {
  try {
    return await Admin.findOneAndDelete(query)
  } catch (e) {
    console.log(e)
  }
}

const countAdmins = async (query) => {
  try {
    return await Admin.countDocuments(query)
  } catch (e) {
    console.log(e)
  }
}

module.exports = {getAdmins, getAdmin, makeAdmin, updateAdmin, deleteAdmin, countAdmins}
