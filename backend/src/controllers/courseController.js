const courseService = require("../services/courseService");
const { sendResponse } = require("../utils/ApiResponse");

const createCourse = async (req, res, next) => {
  try {
    const thumbnailPath = req.file
      ? `/uploads/images/${req.file.filename}`
      : "";
    const course = await courseService.createCourse(
      req.user._id,
      req.body,
      thumbnailPath
    );
    return sendResponse(res, 201, "Course created successfully.", course);
  } catch (error) {
    next(error);
  }
};

const getAllPublishedCourses = async (req, res, next) => {
  try {
    const { search } = req.query;
    const courses = await courseService.getAllPublishedCourses(search);
    return sendResponse(res, 200, "Courses fetched.", courses);
  } catch (error) {
    next(error);
  }
};

const getInstructorCourses = async (req, res, next) => {
  try {
    const courses = await courseService.getInstructorCourses(req.user._id);
    return sendResponse(res, 200, "Your courses fetched.", courses);
  } catch (error) {
    next(error);
  }
};

const getCourseById = async (req, res, next) => {
  try {
    const course = await courseService.getCourseById(req.params.id);
    return sendResponse(res, 200, "Course fetched.", course);
  } catch (error) {
    next(error);
  }
};

const updateCourse = async (req, res, next) => {
  try {
    const thumbnailPath = req.file
      ? `/uploads/images/${req.file.filename}`
      : null;
    const course = await courseService.updateCourse(
      req.params.id,
      req.user._id,
      req.body,
      thumbnailPath
    );
    return sendResponse(res, 200, "Course updated successfully.", course);
  } catch (error) {
    next(error);
  }
};

const deleteCourse = async (req, res, next) => {
  try {
    await courseService.deleteCourse(req.params.id, req.user._id);
    return sendResponse(res, 200, "Course deleted successfully.");
  } catch (error) {
    next(error);
  }
};

const togglePublish = async (req, res, next) => {
  try {
    const course = await courseService.togglePublish(req.params.id, req.user._id);
    return sendResponse(
      res,
      200,
      `Course ${course.isPublished ? "published" : "unpublished"} successfully.`,
      course
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createCourse,
  getAllPublishedCourses,
  getInstructorCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  togglePublish,
};
