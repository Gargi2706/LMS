import API from "./api";

export const enrollInCourse = (courseId) => API.post(`/enrollments/${courseId}`);

export const getMyEnrollments = () => API.get("/enrollments/my");

export const markLessonComplete = (courseId, lessonId) =>
  API.patch(`/enrollments/${courseId}/lessons/${lessonId}/complete`);

export const getEnrolledStudents = (courseId) =>
  API.get(`/enrollments/course/${courseId}/students`);
