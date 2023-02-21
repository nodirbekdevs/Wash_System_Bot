const Owner = require('./../models/ownerModel')

const getOwners = async (query) => {
  try {
    return await Owner.find(query).sort({createdAt: -1})
  } catch (e) {
    console.log(e)
  }
}

const getOwnerPagination = async (query, offset, limit) => {
  try {
    return await Owner.find(query).skip(offset).limit(limit)
  } catch (e) {
    console.log(e)
  }
}

const getOwner = async (query) => {
  try {
    return await Owner.findOne(query)
  } catch (e) {
    console.log(e)
  }
}

const makeOwner = async (data) => {
  try {
    return await Owner.create(data)
  } catch (e) {
    console.log(e)
  }
}

const updateOwner = async (query, data) => {
  try {
    return await Owner.findOneAndUpdate(query, data, {new: true})
  } catch (e) {
    console.log(e)
  }
}

const deleteOwner = async (query) => {
  try {
    return await Owner.findOneAndDelete(query)
  } catch (e) {
    console.log(e)
  }
}

const countOwners = async (query) => {
  try {
    return await Owner.countDocuments(query)
  } catch (e) {
    console.log(e)
  }
}



// const getOwners = async (query) => {
//   try {
//     return await Owner.findAll({where: query, order: [['created_at', 'DESC']]})
//   } catch (e) {
//     console.log(e)
//   }
// }
//
// const getOwner = async (query) => {
//   try {
//     return await Owner.findOne({where: query})
//   } catch (e) {
//     console.log(e)
//   }
// }
//
// const makeOwner = async (data) => {
//   try {
//     return await Owner.create(data)
//   } catch (e) {
//     console.log(e)
//   }
// }
//
// const updateOwner = async (query, data) => {
//   try {
//     return await Owner.update(data, {where: query})
//   } catch (e) {
//     console.log(e)
//   }
// }
//
// const deleteOwner = async (query) => {
//   try {
//     return await Owner.destroy({where: query})
//   } catch (e) {
//     console.log(e)
//   }
// }
//
// const countOwners = async (query) => {
//   try {
//     return await Owner.count({where: query})
//   } catch (e) {
//     console.log(e)
//   }
// }

module.exports = {getOwners, getOwnerPagination, getOwner, makeOwner, updateOwner, deleteOwner, countOwners}
