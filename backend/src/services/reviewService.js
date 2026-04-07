const Review = require("../models/Review");
const Enrollment = require("../models/Enrollment");
const ApiError = require("../utils/ApiError");

const addReview = async (studentId, courseId, { rating, comment }) => {
  // Must be enrolled to review
  const enrollment = await Enrollment.findOne({ student: studentId, course: courseId });
  if (!enrollment) throw new ApiError(403, "You must be enrolled to leave a review.");

  const existing = await Review.findOne({ student: studentId, course: courseId });
  if (existing) throw new ApiError(400, "You have already reviewed this course.");

  const review = await Review.create({
    student: studentId,
    course: courseId,
    rating,
    comment,
  });

  return await review.populate("student", "name");
};

const getCourseReviews = async (courseId) => {
  return await Review.find({ course: courseId })
    .populate("student", "name")
    .sort({ createdAt: -1 });
};

const deleteReview = async (reviewId, studentId) => {
  const review = await Review.findById(reviewId);
  if (!review) throw new ApiError(404, "Review not found.");
  if (review.student.toString() !== studentId.toString())
    throw new ApiError(403, "Not authorized.");
  await review.deleteOne();
};

module.exports = { addReview, getCourseReviews, deleteReview };
