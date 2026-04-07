const express = require("express");
const router = express.Router();
const {
  enrollInCourse,
  getMyEnrollments,
  getEnrolledStudents,
  markLessonComplete,
} = require("../controllers/enrollmentController");
const { protect, restrictTo } = require("../middlewares/auth");

// POST /api/enrollments/:courseId  — student enrolls
router.post("/:courseId", protect, restrictTo("student"), enrollInCourse);

// GET /api/enrollments/my  — student sees their enrollments
router.get("/my", protect, restrictTo("student"), getMyEnrollments);

// GET /api/enrollments/course/:courseId/students — instructor sees enrolled students
router.get(
  "/course/:courseId/students",
  protect,
  restrictTo("instructor"),
  getEnrolledStudents
);

// PATCH /api/enrollments/:courseId/lessons/:lessonId/complete  — student marks lesson done
router.patch(
  "/:courseId/lessons/:lessonId/complete",
  protect,
  restrictTo("student"),
  markLessonComplete
);

module.exports = router;
