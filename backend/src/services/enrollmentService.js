const Enrollment = require("../models/Enrollment");
const Course = require("../models/Course");
const Lesson = require("../models/Lesson");
const ApiError = require("../utils/ApiError");

const enrollInCourse = async (studentId, courseId) => {
  const course = await Course.findById(courseId);
  if (!course) throw new ApiError(404, "Course not found.");
  if (!course.isPublished) throw new ApiError(400, "Course is not published yet.");

  const existing = await Enrollment.findOne({ student: studentId, course: courseId });
  if (existing) throw new ApiError(400, "Already enrolled in this course.");

  const enrollment = await Enrollment.create({ student: studentId, course: courseId });
  return enrollment;
};

const getStudentEnrollments = async (studentId) => {
  return await Enrollment.find({ student: studentId })
    .populate("course", "title description thumbnail instructor totalLessons isPublished")
    .sort({ createdAt: -1 });
};

const getEnrolledStudentsForCourse = async (courseId, instructorId) => {
  const course = await Course.findById(courseId);
  if (!course) throw new ApiError(404, "Course not found.");
  if (course.instructor.toString() !== instructorId.toString())
    throw new ApiError(403, "Not authorized.");

  return await Enrollment.find({ course: courseId }).populate("student", "name email");
};

const markLessonComplete = async (studentId, courseId, lessonId) => {
  const enrollment = await Enrollment.findOne({ student: studentId, course: courseId });
  if (!enrollment) throw new ApiError(404, "Enrollment not found.");

  // Check lesson belongs to course
  const lesson = await Lesson.findOne({ _id: lessonId, course: courseId });
  if (!lesson) throw new ApiError(404, "Lesson not found in this course.");

  if (!enrollment.completedLessons.includes(lessonId)) {
    enrollment.completedLessons.push(lessonId);
  }

  // Recalculate progress
  const totalLessons = await Lesson.countDocuments({ course: courseId });
  enrollment.progress =
    totalLessons > 0
      ? Math.round((enrollment.completedLessons.length / totalLessons) * 100)
      : 0;

  if (enrollment.progress === 100) enrollment.status = "completed";

  await enrollment.save();
  return enrollment;
};

module.exports = {
  enrollInCourse,
  getStudentEnrollments,
  getEnrolledStudentsForCourse,
  markLessonComplete,
};
