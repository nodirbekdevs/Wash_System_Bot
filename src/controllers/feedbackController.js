const Feedback = require('./../models/feedbackModel')

const getAllFeedback = async (query) => {
  try {
    return await Feedback.find(query).sort({createdAt: -1})
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
    return await Feedback.findOneAndUpdate(query, data)
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

module.exports = {getAllFeedback, getFeedback, makeFeedback, updateFeedback, deleteFeedback, countAllFeedback}
