const Course = require("../models/Course");
const Lesson = require("../models/Lesson");
const ApiError = require("../utils/ApiError");

const createCourse = async (instructorId, data, thumbnailPath) => {
  const course = await Course.create({
    ...data,
    instructor: instructorId,
    thumbnail: thumbnailPath || "",
  });
  return course;
};

const getAllPublishedCourses = async (search = "") => {
  const query = { isPublished: true };
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { category: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }
  return await Course.find(query).populate("instructor", "name email").sort({ createdAt: -1 });
};

const getInstructorCourses = async (instructorId) => {
  return await Course.find({ instructor: instructorId }).sort({ createdAt: -1 });
};

const getCourseById = async (courseId) => {
  const course = await Course.findById(courseId).populate("instructor", "name email");
  if (!course) throw new ApiError(404, "Course not found.");
  return course;
};

const updateCourse = async (courseId, instructorId, data, thumbnailPath) => {
  const course = await Course.findById(courseId);
  if (!course) throw new ApiError(404, "Course not found.");
  if (course.instructor.toString() !== instructorId.toString())
    throw new ApiError(403, "You are not authorized to update this course.");

  if (thumbnailPath) data.thumbnail = thumbnailPath;
  Object.assign(course, data);
  await course.save();
  return course;
};

const deleteCourse = async (courseId, instructorId, isAdmin = false) => {
  const course = await Course.findById(courseId);
  if (!course) throw new ApiError(404, "Course not found.");
  if (!isAdmin && course.instructor.toString() !== instructorId.toString())
    throw new ApiError(403, "You are not authorized to delete this course.");

  await Lesson.deleteMany({ course: courseId });
  await course.deleteOne();
};

const togglePublish = async (courseId, instructorId) => {
  const course = await Course.findById(courseId);
  if (!course) throw new ApiError(404, "Course not found.");
  if (course.instructor.toString() !== instructorId.toString())
    throw new ApiError(403, "Not authorized.");

  course.isPublished = !course.isPublished;
  await course.save();
  return course;
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
