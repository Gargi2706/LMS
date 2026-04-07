const reviewService = require("../services/reviewService");
const { sendResponse } = require("../utils/ApiResponse");

const addReview = async (req, res, next) => {
  try {
    const review = await reviewService.addReview(
      req.user._id,
      req.params.courseId,
      req.body
    );
    return sendResponse(res, 201, "Review added.", review);
  } catch (error) {
    next(error);
  }
};

const getCourseReviews = async (req, res, next) => {
  try {
    const reviews = await reviewService.getCourseReviews(req.params.courseId);
    return sendResponse(res, 200, "Reviews fetched.", reviews);
  } catch (error) {
    next(error);
  }
};

const deleteReview = async (req, res, next) => {
  try {
    await reviewService.deleteReview(req.params.id, req.user._id);
    return sendResponse(res, 200, "Review deleted.");
  } catch (error) {
    next(error);
  }
};

module.exports = { addReview, getCourseReviews, deleteReview };
