const Employee = require('./../models/employeeModel')

const getEmployees = async (query) => {
  try {
    return await Employee.find(query)
  } catch (e) {
    console.log(e)
  }
}

const getEmployeePagination = async (query, offset, limit) => {
  try {
    return await Employee.find(query).skip(offset).limit(limit)
  } catch (e) {
    console.log(e)
  }
}

const getEmployee = async (query) => {
  try {
    return await Employee.findOne(query)
  } catch (e) {
    console.log(e)
  }
}

const makeEmployee = async (data) => {
  try {
    return await Employee.create(data)
  } catch (e) {
    console.log(e)
  }
}

const updateEmployee = async (query, data) => {
  try {
    return await Employee.findOneAndUpdate(query, data, {new: true})
  } catch (e) {
    console.log(e)
  }
}

const updateManyEmployees = async (query, data) => {
  try {
    return await Employee.updateMany(query, data)
  } catch (e) {
    console.log(e)
  }
}

const deleteEmployee = async (query) => {
  try {
    return await Employee.findOneAndDelete(query)
  } catch (e) {
    console.log(e)
  }
}


const countEmployees = async (query) => {
  try {
    return await Employee.countDocuments(query)
  } catch (e) {
    console.log(e)
  }
}


// const getEmployees = async (query) => {
//   try {
//     return await Employee.findAll({where: query})
//   } catch (e) {
//     console.log(e)
//   }
// }
//
// const getEmployee = async (query) => {
//   try {
//     return await Employee.findOne({where: query})
//   } catch (e) {
//     console.log(e)
//   }
// }
//
// const makeEmployee = async (data) => {
//   try {
//     return await Employee.create(data)
//   } catch (e) {
//     console.log(e)
//   }
// }
//
// const updateEmployee = async (query, data) => {
//   try {
//     return await Employee.update(data, {where: query})
//   } catch (e) {
//     console.log(e)
//   }
// }
//
// const updateManyEmployees = async (query, data) => {
//   try {
//     const employees = await getEmployees(query)
//
//     for (let i = 0; i < employees.length; i++) {
//       await updateEmployee(data, {_id: employees[i]._id})
//     }
//
//     return true
//   } catch (e) {
//     console.log(e)
//   }
// }
//
// const deleteEmployee = async (query) => {
//   try {
//     return await Employee.destroy({where: query})
//   } catch (e) {
//     console.log(e)
//   }
// }
//
//
// const countEmployees = async (query) => {
//   try {
//     return await Employee.count({where: query})
//   } catch (e) {
//     console.log(e)
//   }
// }

module.exports = {
  getEmployees,
  getEmployeePagination,
  getEmployee,
  makeEmployee,
  updateEmployee,
  updateManyEmployees,
  deleteEmployee,
  countEmployees
}
