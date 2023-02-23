const Feedback = require('./../models/feedbackModel')

const getAllFeedback = async (query) => {
  try {
    return await Feedback.find(query).sort({createdAt: -1})
  } catch (e) {
    console.log(e)
  }
}

const getFeedbackPagination = async (query, offset, limit) => {
  try {
    return await Feedback.find(query).skip(offset).limit(limit)
  } catch (e) {
    console.log(e)
  }
}

const getFeedback = async (query) => {
  try {
    return await Feedback.findOne(query)
  } catch (e) {
    console.log(e)
  }
}

const makeFeedback = async (data) => {
  try {
    return await Feedback.create(data)
  } catch (e) {
    console.log(e)
  }
}

const updateFeedback = async (query, data) => {
  try {
    return await Feedback.findOneAndUpdate(query, data, {new: true})
  } catch (e) {
    console.log(e)
  }
}

const deleteFeedback = async (query) => {
  try {
    return await Feedback.findOneAndDelete(query)
  } catch (e) {
    console.log(e)
  }
}

const countAllFeedback = async (query) => {
  try {
    return await Feedback.countDocuments(query)
  } catch (e) {
    console.log(e)
  }
}



// const getAllFeedback = async (query) => {
//   try {
//     return await Feedback.findAll({where: query, order: [['created_at', 'DESC']]})
//   } catch (e) {
//     console.log(e)
//   }
// }
//
// const getFeedback = async (query) => {
//   try {
//     return await Feedback.findOne({where: query})
//   } catch (e) {
//     console.log(e)
//   }
// }
//
// const makeFeedback = async (data) => {
//   try {
//     return await Feedback.create(data)
//   } catch (e) {
//     console.log(e)
//   }
// }
//
// const updateFeedback = async (query, data) => {
//   try {
//     return await Feedback.update(data, {where: query})
//   } catch (e) {
//     console.log(e)
//   }
// }
//
// const deleteFeedback = async (query) => {
//   try {
//     return await Feedback.destroy({where: query})
//   } catch (e) {
//     console.log(e)
//   }
// }
//
// const countAllFeedback = async (query) => {
//   try {
//     return await Feedback.count({where: query})
//   } catch (e) {
//     console.log(e)
//   }
// }

module.exports = {getAllFeedback, getFeedbackPagination, getFeedback, makeFeedback, updateFeedback, deleteFeedback, countAllFeedback}
