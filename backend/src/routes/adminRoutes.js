const express = require("express");
const router = express.Router();
const {
  getDashboardStats,
  getAllUsers,
  toggleUserStatus,
  approveInstructor,
  getAllCourses,
  deleteCourse,
} = require("../controllers/adminController");
const { protect, restrictTo } = require("../middlewares/auth");

// All admin routes are protected + admin only
router.use(protect, restrictTo("admin"));

router.get("/stats", getDashboardStats);
router.get("/users", getAllUsers);
router.patch("/users/:userId/toggle-status", toggleUserStatus);
router.patch("/users/:userId/approve-instructor", approveInstructor);
router.get("/courses", getAllCourses);
router.delete("/courses/:courseId", deleteCourse);

module.exports = router;
