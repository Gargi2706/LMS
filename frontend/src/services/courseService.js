import API from "./api";

export const getAllCourses = (search = "") =>
  API.get(`/courses?search=${search}`);

export const getCourseById = (id) => API.get(`/courses/${id}`);

export const createCourse = (formData) =>
  API.post("/courses", formData, { headers: { "Content-Type": "multipart/form-data" } });

export const updateCourse = (id, formData) =>
  API.put(`/courses/${id}`, formData, { headers: { "Content-Type": "multipart/form-data" } });

export const deleteCourse = (id) => API.delete(`/courses/${id}`);

export const togglePublish = (id) => API.patch(`/courses/${id}/toggle-publish`);

export const getInstructorCourses = () => API.get("/courses/instructor/my-courses");

// Lessons
export const getLessons = (courseId) => API.get(`/courses/${courseId}/lessons`);

export const addLesson = (courseId, formData) =>
  API.post(`/courses/${courseId}/lessons`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const deleteLesson = (courseId, lessonId) =>
  API.delete(`/courses/${courseId}/lessons/${lessonId}`);

// Reviews
export const getCourseReviews = (courseId) => API.get(`/courses/${courseId}/reviews`);

export const addReview = (courseId, data) => API.post(`/courses/${courseId}/reviews`, data);
