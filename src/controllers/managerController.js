const Manager = require('./../models/managerModel')

const getManagers = async (query) => {
  try {
    return await Manager.find(query).sort({createdAt: -1})
  } catch (e) {
    console.log(e)
  }
}

const getManager = async (query) => {
  try {
    return await Manager.findOne(query)
  } catch (e) {
    console.log(e)
  }
}

const makeManager = async (data) => {
  try {
    return await Manager.create(data)
  } catch (e) {
    console.log(e)
  }
}

const updateManager = async (query, data) => {
  try {
    return await Manager.findOneAndUpdate(query, data, {new: true})
  } catch (e) {
    console.log(e)
  }
}

const deleteManager = async (query) => {
  try {
    return await Manager.findOneAndDelete(query)
  } catch (e) {
    console.log(e)
  }
}

const countManagers = async (query) => {
  try {
    return await Manager.countDocuments(query)
  } catch (e) {
    console.log(e)
  }
}



// const getManagers = async (query) => {
//   try {
//     return await Manager.findAll({where: query, order: [['created_at', 'DESC']]})
//   } catch (e) {
//     console.log(e)
//   }
// }
//
// const getManager = async (query) => {
//   try {
//     return await Manager.findOne({where: query})
//   } catch (e) {
//     console.log(e)
//   }
// }
//
// const makeManager = async (data) => {
//   try {
//     return await Manager.create(data)
//   } catch (e) {
//     console.log(e)
//   }
// }
//
// const updateManager = async (query, data) => {
//   try {
//     return await Manager.update(data, {where: query})
//   } catch (e) {
//     console.log(e)
//   }
// }
//
// const deleteManager = async (query) => {
//   try {
//     return await Manager.destroy({where: query})
//   } catch (e) {
//     console.log(e)
//   }
// }
//
// const countManagers = async (query) => {
//   try {
//     return await Manager.count({where: query})
//   } catch (e) {
//     console.log(e)
//   }
// }

module.exports = {getManagers, getManager, makeManager, updateManager, deleteManager, countManagers}
