const Fee = require('./../models/feeModel')

const getFees = async (query) => {
  try {
    return await Fee.find(query).sort({createdAt: -1})
  } catch (e) {
    console.log(e)
  }
}

const getFee = async (query) => {
  try {
    return await Fee.findOne(query)
  } catch (e) {
    console.log(e)
  }
}

const makeFee = async (data) => {
  try {
    return await Fee.create(data)
  } catch (e) {
    console.log(e)
  }
}

const updateFee = async (query, data, text) => {
  try {
    return await Fee.findOneAndUpdate(query, data)
  } catch (e) {
    console.log(e)
  }
}

const deleteFee = async (query) => {
  try {
    return await Fee.findOneAndDelete(query)
  } catch (e) {
    console.log(e)
  }
}

const countFees = async (query) => {
  try {
    return await Fee.countDocuments(query)
  } catch (e) {
    console.log(e)
  }
}

module.exports = {getFees, getFee, makeFee, updateFee, deleteFee, countFees}
