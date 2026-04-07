const adminService = require("../services/adminService");
const { sendResponse } = require("../utils/ApiResponse");

const getDashboardStats = async (req, res, next) => {
  try {
    const stats = await adminService.getDashboardStats();
    return sendResponse(res, 200, "Dashboard stats fetched.", stats);
  } catch (error) {
    next(error);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const users = await adminService.getAllUsers();
    return sendResponse(res, 200, "Users fetched.", users);
  } catch (error) {
    next(error);
  }
};

const toggleUserStatus = async (req, res, next) => {
  try {
    const user = await adminService.toggleUserStatus(req.params.userId);
    return sendResponse(
      res,
      200,
      `User ${user.status === "active" ? "unblocked" : "blocked"} successfully.`,
      user
    );
  } catch (error) {
    next(error);
  }
};

const approveInstructor = async (req, res, next) => {
  try {
    const user = await adminService.approveInstructor(req.params.userId);
    return sendResponse(res, 200, "Instructor approved.", user);
  } catch (error) {
    next(error);
  }
};

const getAllCourses = async (req, res, next) => {
  try {
    const courses = await adminService.getAllCourses();
    return sendResponse(res, 200, "All courses fetched.", courses);
  } catch (error) {
    next(error);
  }
};

const deleteCourse = async (req, res, next) => {
  try {
    await adminService.adminDeleteCourse(req.params.courseId);
    return sendResponse(res, 200, "Course deleted by admin.");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
  getAllUsers,
  toggleUserStatus,
  approveInstructor,
  getAllCourses,
  deleteCourse,
};
