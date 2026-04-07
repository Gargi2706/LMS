const express = require("express");
const router = express.Router();
const {
  createCourse,
  getAllPublishedCourses,
  getInstructorCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  togglePublish,
} = require("../controllers/courseController");
const { protect, restrictTo, requireApproved } = require("../middlewares/auth");
const upload = require("../middlewares/upload");

// Public
router.get("/", getAllPublishedCourses);
router.get("/:id", getCourseById);

// Instructor only
router.post(
  "/",
  protect,
  restrictTo("instructor"),
  requireApproved,
  upload.single("thumbnail"),
  createCourse
);

router.get(
  "/instructor/my-courses",
  protect,
  restrictTo("instructor"),
  getInstructorCourses
);

router.put(
  "/:id",
  protect,
  restrictTo("instructor"),
  requireApproved,
  upload.single("thumbnail"),
  updateCourse
);

router.delete("/:id", protect, restrictTo("instructor"), deleteCourse);

router.patch("/:id/toggle-publish", protect, restrictTo("instructor"), togglePublish);

module.exports = router;
