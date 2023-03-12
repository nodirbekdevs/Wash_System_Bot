const Wash = require('./../models/washModel')

const getWashes = async (query) => {
  try {
    return await Wash.find(query).sort({employee: 1})
  } catch (e) {
    console.log(e)
  }
}

const getWashPagination = async (query, offset, limit) => {
  try {
    return await Wash.find(query).skip(offset).limit(limit)
  } catch (e) {
    console.log(e)
  }
}

const getWash = async (query) => {
  try {
    return await Wash.findOne(query)
  } catch (e) {
    console.log(e)
  }
}

const makeWash = async (data) => {
  try {
    return await Wash.create(data)
  } catch (e) {
    console.log(e)
  }
}

const updateWash = async (query, data) => {
  try {
    return await Wash.findOneAndUpdate(query, data, {new: true})
  } catch (e) {
    console.log(e)
  }
}

const deleteWash = async (query) => {
  try {
    return await Wash.findOneAndDelete(query)
  } catch (e) {
    console.log(e)
  }
}

const countWashes = async (query) => {
  try {
    return await Wash.countDocuments(query)
  } catch (e) {
    console.log(e)
  }
}



// const getWashes = async (query) => {
//   try {
//     return await Wash.find({where: query, order: [['created_at', 'DESC']]})
//   } catch (e) {
//     console.log(e)
//   }
// }
//
// const getWash = async (query) => {
//   try {
//     return await Wash.findOne({where: query})
//   } catch (e) {
//     console.log(e)
//   }
// }
//  Wash.findAll({limit, offset, where: query})
// const makeWash = async (data) => {
//   try {
//     return await Wash.create(data)
//   } catch (e) {
//     console.log(e)
//   }
// }
//
// const updateWash = async (query, data) => {
//   try {
//     return await Wash.update(data, {where: query})
//   } catch (e) {
//     console.log(e)
//   }
// }
//
// const deleteWash = async (query) => {
//   try {
//     return await Wash.destroy({where: query})
//   } catch (e) {
//     console.log(e)
//   }
// }
//
// const countWashes = async (query) => {
//   try {
//     return await Wash.count({where: query})
//   } catch (e) {
//     console.log(e)
//   }
// }

module.exports = {getWashes, getWashPagination, getWash, makeWash, updateWash, deleteWash, countWashes}
