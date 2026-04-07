const Lesson = require("../models/Lesson");
const Course = require("../models/Course");
const ApiError = require("../utils/ApiError");

const addLesson = async (courseId, instructorId, data, videoPath) => {
  const course = await Course.findById(courseId);
  if (!course) throw new ApiError(404, "Course not found.");
  if (course.instructor.toString() !== instructorId.toString())
    throw new ApiError(403, "Not authorized.");

  const lesson = await Lesson.create({
    course: courseId,
    ...data,
    videoUrl: videoPath || "",
  });

  // Update total lessons count
  await Course.findByIdAndUpdate(courseId, { $inc: { totalLessons: 1 } });

  return lesson;
};

const getLessonsByCourse = async (courseId) => {
  return await Lesson.find({ course: courseId }).sort({ sequence: 1 });
};

const getLessonById = async (lessonId) => {
  const lesson = await Lesson.findById(lessonId);
  if (!lesson) throw new ApiError(404, "Lesson not found.");
  return lesson;
};

const updateLesson = async (lessonId, instructorId, data, videoPath) => {
  const lesson = await Lesson.findById(lessonId).populate("course");
  if (!lesson) throw new ApiError(404, "Lesson not found.");
  if (lesson.course.instructor.toString() !== instructorId.toString())
    throw new ApiError(403, "Not authorized.");

  if (videoPath) data.videoUrl = videoPath;
  Object.assign(lesson, data);
  await lesson.save();
  return lesson;
};

const deleteLesson = async (lessonId, instructorId) => {
  const lesson = await Lesson.findById(lessonId).populate("course");
  if (!lesson) throw new ApiError(404, "Lesson not found.");
  if (lesson.course.instructor.toString() !== instructorId.toString())
    throw new ApiError(403, "Not authorized.");

  await Course.findByIdAndUpdate(lesson.course._id, { $inc: { totalLessons: -1 } });
  await lesson.deleteOne();
};

module.exports = { addLesson, getLessonsByCourse, getLessonById, updateLesson, deleteLesson };
