const Car = require('./../models/carModel')

const getCars = async (query) => {
  try {
    return await Car.find(query).sort({createdAt: -1})
  } catch (e) {
    console.log(e)
  }
}

const getCarPagination = async (query, offset, limit) => {
  try {
    return await Car.find(query).skip(offset).limit(limit)
  } catch (e) {
    console.log(e)
  }
}

const getCar = async (query) => {
  try {
    return await Car.findOne(query)
  } catch (e) {
    console.log(e)
  }
}

const makeCar = async (data) => {
  try {
    return  await Car.create(data)
  } catch (e) {
    console.log(e)
  }
}

const updateCar = async (query, data) => {
  try {
    return await Car.findOneAndUpdate(query, data, {new: true})
  } catch (e) {
    console.log(e)
  }
}

const deleteCar = async (query) => {
  try {
    return await Car.findOneAndDelete(query)
  } catch (e) {
    console.log(e)
  }
}

const countCars = async (query) => {
  try {
    return await Car.countDocuments(query)
  } catch (e) {
    console.log(e)
  }
}



// const getCars = async (query) => {
//   try {
//     return await Car.findAll({where: query, order: [['created_at', 'DESC']]})
//   } catch (e) {
//     console.log(e)
//   }
// }
//
// const getCar = async (query) => {
//   try {
//     return await Car.findOne({where: query})
//   } catch (e) {
//     console.log(e)
//   }
// }
//
// const makeCar = async (data) => {
//   try {
//     return await Car.create(data)
//   } catch (e) {
//     console.log(e)
//   }
// }
//
// const updateCar = async (query, data) => {
//   try {
//     return await Car.update(data, {where: query})
//   } catch (e) {
//     console.log(e)
//   }
// }
//
// const deleteCar = async (query) => {
//   try {
//     return await Car.destroy({where: query})
//   } catch (e) {
//     console.log(e)
//   }
// }
//
// const countCars = async (query) => {
//   try {
//     return await Car.count({where: query})
//   } catch (e) {
//     console.log(e)
//   }
// }

module.exports = {getCars, getCarPagination, getCar, makeCar, updateCar, deleteCar, countCars}
