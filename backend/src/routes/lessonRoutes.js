const express = require("express");
const router = express.Router({ mergeParams: true }); // mergeParams to access :courseId from parent
const {
  addLesson,
  getLessonsByCourse,
  getLessonById,
  updateLesson,
  deleteLesson,
} = require("../controllers/lessonController");
const { protect, restrictTo, requireApproved } = require("../middlewares/auth");
const upload = require("../middlewares/upload");

// GET /api/courses/:courseId/lessons — anyone can view lessons
router.get("/", protect, getLessonsByCourse);

// GET /api/courses/:courseId/lessons/:id
router.get("/:id", protect, getLessonById);

// POST /api/courses/:courseId/lessons — instructor only
router.post(
  "/",
  protect,
  restrictTo("instructor"),
  requireApproved,
  upload.single("video"),
  addLesson
);

// PUT /api/courses/:courseId/lessons/:id
router.put(
  "/:id",
  protect,
  restrictTo("instructor"),
  requireApproved,
  upload.single("video"),
  updateLesson
);

// DELETE /api/courses/:courseId/lessons/:id
router.delete("/:id", protect, restrictTo("instructor"), deleteLesson);

module.exports = router;
