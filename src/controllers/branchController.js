const Branch = require('./../models/branchModel')

const getBranches = async (query) => {
  try {
    return await Branch.find(query).sort({createdAt: -1})
  } catch (e) {
    console.log(e)
  }
}

const getBranch = async (query) => {
  try {
    return await Branch.findOne(query)
  } catch (e) {
    console.log(e)
  }
}

const makeBranch = async (data) => {
  try {
    return  await Branch.create(data)
  } catch (e) {
    console.log(e)
  }
}

const updateBranch = async (query, data, text) => {
  try {
    return await Branch.findOneAndUpdate(query, data)
  } catch (e) {
    console.log(e)
  }
}

const deleteBranch = async (query) => {
  try {
    return await Branch.findOneAndDelete(query)
  } catch (e) {
    console.log(e)
  }
}

const countBranches = async (query) => {
  try {
    return await Branch.countDocuments(query)
  } catch (e) {
    console.log(e)
  }
}

module.exports = {getBranches, getBranch, makeBranch, updateBranch, deleteBranch, countBranches}
