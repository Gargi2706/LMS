const User = require("../models/User");
const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");
const ApiError = require("../utils/ApiError");

const getDashboardStats = async () => {
  const [totalUsers, totalCourses, totalEnrollments, pendingInstructors] =
    await Promise.all([
      User.countDocuments(),
      Course.countDocuments(),
      Enrollment.countDocuments(),
      User.countDocuments({ role: "instructor", isApproved: false }),
    ]);

  return { totalUsers, totalCourses, totalEnrollments, pendingInstructors };
};

const getAllUsers = async () => {
  return await User.find({ role: { $ne: "admin" } })
    .select("-password")
    .sort({ createdAt: -1 });
};

const toggleUserStatus = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, "User not found.");
  if (user.role === "admin") throw new ApiError(403, "Cannot modify admin account.");

  user.status = user.status === "active" ? "blocked" : "active";
  await user.save();
  return user;
};

const approveInstructor = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, "User not found.");
  if (user.role !== "instructor") throw new ApiError(400, "User is not an instructor.");

  user.isApproved = true;
  await user.save();
  return user;
};

const getAllCourses = async () => {
  return await Course.find()
    .populate("instructor", "name email")
    .sort({ createdAt: -1 });
};

const adminDeleteCourse = async (courseId) => {
  const { deleteCourse } = require("./courseService");
  await deleteCourse(courseId, null, true);
};

module.exports = {
  getDashboardStats,
  getAllUsers,
  toggleUserStatus,
  approveInstructor,
  getAllCourses,
  adminDeleteCourse,
};
