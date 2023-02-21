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

const updateBranch = async (query, data) => {
  try {
    return await Branch.findOneAndUpdate(query, data, {new: true})
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



// const getBranches = async (query) => {
//   try {
//     return await Branch.findAll({where: query, order: [['created_at', 'DESC']]})
//   } catch (e) {
//     console.log(e)
//   }
// }
//
// const getBranch = async (query) => {
//   try {
//     return await Branch.findOne({where: query})
//   } catch (e) {
//     console.log(e)
//   }
// }
//
// const makeBranch = async (data) => {
//   try {
//     return await Branch.create(data)
//   } catch (e) {
//     console.log(e)
//   }
// }
//
// const updateBranch = async (query, data) => {
//   try {
//     return await Branch.update(data, {where: query})
//   } catch (e) {
//     console.log(e)
//   }
// }
//
// const deleteBranch = async (query) => {
//   try {
//     return await Branch.destroy({where: query})
//   } catch (e) {
//     console.log(e)
//   }
// }
//
// const countBranches = async (query) => {
//   try {
//     return await Branch.count({where: query})
//   } catch (e) {
//     console.log(e)
//   }
// }

module.exports = {getBranches, getBranch, makeBranch, updateBranch, deleteBranch, countBranches}
