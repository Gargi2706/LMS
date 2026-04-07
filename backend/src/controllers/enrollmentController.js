const enrollmentService = require("../services/enrollmentService");
const { sendResponse } = require("../utils/ApiResponse");

const enrollInCourse = async (req, res, next) => {
  try {
    const enrollment = await enrollmentService.enrollInCourse(
      req.user._id,
      req.params.courseId
    );
    return sendResponse(res, 201, "Enrolled successfully.", enrollment);
  } catch (error) {
    next(error);
  }
};

const getMyEnrollments = async (req, res, next) => {
  try {
    const enrollments = await enrollmentService.getStudentEnrollments(req.user._id);
    return sendResponse(res, 200, "Enrollments fetched.", enrollments);
  } catch (error) {
    next(error);
  }
};

const getEnrolledStudents = async (req, res, next) => {
  try {
    const students = await enrollmentService.getEnrolledStudentsForCourse(
      req.params.courseId,
      req.user._id
    );
    return sendResponse(res, 200, "Enrolled students fetched.", students);
  } catch (error) {
    next(error);
  }
};

const markLessonComplete = async (req, res, next) => {
  try {
    const { courseId, lessonId } = req.params;
    const enrollment = await enrollmentService.markLessonComplete(
      req.user._id,
      courseId,
      lessonId
    );
    return sendResponse(res, 200, "Lesson marked as complete.", enrollment);
  } catch (error) {
    next(error);
  }
};

module.exports = { enrollInCourse, getMyEnrollments, getEnrolledStudents, markLessonComplete };
