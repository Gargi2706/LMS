import API from "./api";

export const getAdminStats = () => API.get("/admin/stats");
export const getAllUsers = () => API.get("/admin/users");
export const toggleUserStatus = (userId) => API.patch(`/admin/users/${userId}/toggle-status`);
export const approveInstructor = (userId) => API.patch(`/admin/users/${userId}/approve-instructor`);
export const getAllCoursesAdmin = () => API.get("/admin/courses");
export const adminDeleteCourse = (courseId) => API.delete(`/admin/courses/${courseId}`);
