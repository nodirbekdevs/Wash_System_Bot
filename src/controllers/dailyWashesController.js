const DailyWash = require('./../models/dailyWashModel')

const getDailyWashes = async (query) => {
  try {
    return await DailyWash.find(query).sort({createdAt: -1})
  } catch (e) {
    console.log(e)
  }
}

const getDailyWash = async (query) => {
  try {
    return await DailyWash.findOne(query)
  } catch (e) {
    console.log(e)
  }
}

const makeDailyWash = async (data) => {
  try {
    return  await DailyWash.create(data)
  } catch (e) {
    console.log(e)
  }
}

const updateDailyWash = async (query, data, text) => {
  try {
    return await DailyWash.findOneAndUpdate(query, data)
  } catch (e) {
    console.log(e)
  }
}

const deleteDailyWash = async (query) => {
  try {
    return await DailyWash.findOneAndDelete(query)
  } catch (e) {
    console.log(e)
  }
}

const countDailyWashes = async (query) => {
  try {
    return await DailyWash.countDocuments(query)
  } catch (e) {
    console.log(e)
  }
}

module.exports = {getDailyWashes, getDailyWash, makeDailyWash, updateDailyWash, deleteDailyWash, countDailyWashes}
