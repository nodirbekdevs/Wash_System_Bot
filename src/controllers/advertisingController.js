const Advertising = require('./../models/advertisingModel')

const getAdvertisements = async (query) => {
  try {
    return await Advertising.find(query).sort({createdAt: -1})
  } catch (e) {
    console.log(e)
  }
}

const getAdvertising = async (query) => {
  try {
    return await Advertising.findOne(query)
  } catch (e) {
    console.log(e)
  }
}

const makeAdvertising = async (data) => {
  try {
    return  await Advertising.create({author: data})
  } catch (e) {
    console.log(e)
  }
}

const updateAdvertising = async (query, data) => {
  try {
    return await Advertising.findOneAndUpdate(query, data, {new: true})
  } catch (e) {
    console.log(e)
  }
}

const deleteAdvertising = async (query) => {
  try {
    return await Advertising.findOneAndDelete(query)
  } catch (e) {
    console.log(e)
  }
}

const countAdvertisements = async (query) => {
  try {
    return await Advertising.countDocuments(query)
  } catch (e) {
    console.log(e)
  }
}



// const getAdvertisements = async (query) => {
//   try {
//     return await Advertising.findAll({where: query, order: [['created_at', 'DESC']]})
//   } catch (e) {
//     console.log(e)
//   }
// }
//
// const getAdvertising = async (query) => {
//   try {
//     return await Advertising.findOne({where: query})
//   } catch (e) {
//     console.log(e)
//   }
// }
//
// const makeAdvertising = async (data) => {
//   try {
//     return await Advertising.create({author: data})
//   } catch (e) {
//     console.log(e)
//   }
// }
//
// const updateAdvertising = async (query, data) => {
//   try {
//     return await Advertising.update(data, {where: query})
//   } catch (e) {
//     console.log(e)
//   }
// }
//
// const deleteAdvertising = async (query) => {
//   try {
//     return await Advertising.destroy({where: query})
//   } catch (e) {
//     console.log(e)
//   }
// }
//
// const countAdvertisements = async (query) => {
//   try {
//     return await Advertising.count({where: query})
//   } catch (e) {
//     console.log(e)
//   }
// }

module.exports = {
  getAdvertisements,
  getAdvertising,
  makeAdvertising,
  updateAdvertising,
  deleteAdvertising,
  countAdvertisements
}
