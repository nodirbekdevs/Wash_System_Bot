const Fee = require('./../models/feeModel')

const getFees = async (query) => {
  try {
    return await Fee.find(query).sort({createdAt: -1})
  } catch (e) {
    console.log(e)
  }
}

const getFeePagination = async (query, offset, limit) => {
  try {
    return await Fee.find(query).skip(offset).limit(limit)
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

const updateFee = async (query, data) => {
  try {
    return await Fee.findOneAndUpdate(query, data, {new: true})
  } catch (e) {
    console.log(e)
  }
}

const updateManyFees = async (query, data) => {
  try {
    return await Fee.updateMany(query, data)
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



// const getFees = async (query) => {
//   try {
//     return await Fee.findAll({where: query, order: [['created_at', 'DESC']]})
//   } catch (e) {
//     console.log(e)
//   }
// }
//
// const getFee = async (query) => {
//   try {
//     return await Fee.findOne({where: query})
//   } catch (e) {
//     console.log(e)
//   }
// }
//
// const makeFee = async (data) => {
//   try {
//     return await Fee.create(data)
//   } catch (e) {
//     console.log(e)
//   }
// }
//
// const updateFee = async (query, data) => {
//   try {
//     return await Fee.update(data, {where: query})
//   } catch (e) {
//     console.log(e)
//   }
// }
//
// const updateManyFees = async (query, data) => {
//   try {
//     const fees = await getFees({where: query})
//
//     for (let i = 0; i < fees.length; i++) {
//       await updateFee({where: query}, {_id: fees[i]._id})
//     }
//
//     return true
//   } catch (e) {
//     console.log(e)
//   }
// }
//
// const deleteFee = async (query) => {
//   try {
//     return await Fee.destroy({where: query})
//   } catch (e) {
//     console.log(e)
//   }
// }
//
// const countFees = async (query) => {
//   try {
//     return await Fee.count({where: query})
//   } catch (e) {
//     console.log(e)
//   }
// }

module.exports = {getFees, getFeePagination, getFee, makeFee, updateFee, updateManyFees, deleteFee, countFees}
