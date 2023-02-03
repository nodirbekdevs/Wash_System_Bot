const Car = require('./../models/carModel')

const getCars = async (query) => {
  try {
    return await Car.find(query).sort({createdAt: -1})
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

const updateCar = async (query, data, text) => {
  try {
    return await Car.findOneAndUpdate(query, data)
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

module.exports = {getCars, getCar, makeCar, updateCar, deleteCar, countCars}
