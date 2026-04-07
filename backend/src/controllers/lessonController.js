const lessonService = require("../services/lessonService");
const { sendResponse } = require("../utils/ApiResponse");

const addLesson = async (req, res, next) => {
  try {
    const videoPath = req.file ? `/uploads/videos/${req.file.filename}` : "";
    const lesson = await lessonService.addLesson(
      req.params.courseId,
      req.user._id,
      req.body,
      videoPath
    );
    return sendResponse(res, 201, "Lesson added successfully.", lesson);
  } catch (error) {
    next(error);
  }
};

const getLessonsByCourse = async (req, res, next) => {
  try {
    const lessons = await lessonService.getLessonsByCourse(req.params.courseId);
    return sendResponse(res, 200, "Lessons fetched.", lessons);
  } catch (error) {
    next(error);
  }
};

const getLessonById = async (req, res, next) => {
  try {
    const lesson = await lessonService.getLessonById(req.params.id);
    return sendResponse(res, 200, "Lesson fetched.", lesson);
  } catch (error) {
    next(error);
  }
};

const updateLesson = async (req, res, next) => {
  try {
    const videoPath = req.file ? `/uploads/videos/${req.file.filename}` : null;
    const lesson = await lessonService.updateLesson(
      req.params.id,
      req.user._id,
      req.body,
      videoPath
    );
    return sendResponse(res, 200, "Lesson updated successfully.", lesson);
  } catch (error) {
    next(error);
  }
};

const deleteLesson = async (req, res, next) => {
  try {
    await lessonService.deleteLesson(req.params.id, req.user._id);
    return sendResponse(res, 200, "Lesson deleted successfully.");
  } catch (error) {
    next(error);
  }
};

module.exports = { addLesson, getLessonsByCourse, getLessonById, updateLesson, deleteLesson };
