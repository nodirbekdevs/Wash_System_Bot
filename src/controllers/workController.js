const Work = require('./../models/workModel')

const getWorks = async (query) => {
  try {
    return await Work.find(query)
  } catch (e) {
    console.log(e)
  }
}

const getWork = async (query) => {
  try {
    return await Work.findOne(query)
  } catch (e) {
    console.log(e)
  }
}

const makeWork = async (data) => {
  try {
    return await Work.create(data)
  } catch (e) {
    console.log(e)
  }
}

const updateWork = async (query, data) => {
  try {
    return await Work.findOneAndUpdate(query, data, {new: true})
  } catch (e) {
    console.log(e)
  }
}

const deleteWork = async (query) => {
  try {
    return await Work.findOneAndDelete(query)
  } catch (e) {
    console.log(e)
  }
}

const countWorks = async (query) => {
  try {
    return await Work.countDocuments(query)
  } catch (e) {
    console.log(e)
  }
}

module.exports = {getWorks, getWork, makeWork, updateWork, deleteWork, countWorks}
