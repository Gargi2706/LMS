const express = require("express");
const router = express.Router({ mergeParams: true });
const { addReview, getCourseReviews, deleteReview } = require("../controllers/reviewController");
const { protect, restrictTo } = require("../middlewares/auth");

// GET /api/courses/:courseId/reviews  — public
router.get("/", getCourseReviews);

// POST /api/courses/:courseId/reviews  — student only
router.post("/", protect, restrictTo("student"), addReview);

// DELETE /api/courses/:courseId/reviews/:id
router.delete("/:id", protect, restrictTo("student"), deleteReview);

module.exports = router;
