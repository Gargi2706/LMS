import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store";
import ProtectedRoute from "./components/templates/ProtectedRoute";

// Auth
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ChangePassword from "./pages/auth/ChangePassword";

// Student
import StudentDashboard from "./pages/student/StudentDashboard";
import CourseCatalog from "./pages/student/CourseCatalog";
import LessonPlayer from "./pages/student/LessonPlayer";

// Instructor
import InstructorDashboard from "./pages/instructor/InstructorDashboard";
import InstructorCourses from "./pages/instructor/InstructorCourses";
import CourseForm from "./pages/instructor/CourseForm";
import ManageLessons from "./pages/instructor/ManageLessons";

// Admin
import AdminDashboard from "./pages/admin/AdminDashboard";
import UsersPage from "./pages/admin/UsersPage";
import AdminCoursesPage from "./pages/admin/AdminCoursesPage";

// Unauthorized
const Unauthorized = () => (
  <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "1rem" }}>
    <div style={{ fontSize: "4rem" }}>🚫</div>
    <h2>Access Denied</h2>
    <p style={{ color: "var(--text-muted)" }}>You don't have permission to view this page.</p>
  </div>
);

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/change-password" element={
            <ProtectedRoute roles={["student", "instructor", "admin"]}><ChangePassword /></ProtectedRoute>
          } />

          {/* Student routes */}
          <Route path="/student/dashboard" element={
            <ProtectedRoute roles={["student"]}><StudentDashboard /></ProtectedRoute>
          } />
          <Route path="/student/courses" element={
            <ProtectedRoute roles={["student"]}><CourseCatalog /></ProtectedRoute>
          } />
          <Route path="/student/my-courses" element={
            <ProtectedRoute roles={["student"]}><StudentDashboard /></ProtectedRoute>
          } />
          <Route path="/student/my-courses/:courseId" element={
            <ProtectedRoute roles={["student"]}><LessonPlayer /></ProtectedRoute>
          } />

          {/* Instructor routes */}
          <Route path="/instructor/dashboard" element={
            <ProtectedRoute roles={["instructor"]}><InstructorDashboard /></ProtectedRoute>
          } />
          <Route path="/instructor/courses" element={
            <ProtectedRoute roles={["instructor"]}><InstructorCourses /></ProtectedRoute>
          } />
          <Route path="/instructor/courses/new" element={
            <ProtectedRoute roles={["instructor"]}><CourseForm /></ProtectedRoute>
          } />
          <Route path="/instructor/courses/:id/edit" element={
            <ProtectedRoute roles={["instructor"]}><CourseForm /></ProtectedRoute>
          } />
          <Route path="/instructor/courses/:courseId/lessons" element={
            <ProtectedRoute roles={["instructor"]}><ManageLessons /></ProtectedRoute>
          } />

          {/* Admin routes */}
          <Route path="/admin/dashboard" element={
            <ProtectedRoute roles={["admin"]}><AdminDashboard /></ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedRoute roles={["admin"]}><UsersPage /></ProtectedRoute>
          } />
          <Route path="/admin/courses" element={
            <ProtectedRoute roles={["admin"]}><AdminCoursesPage /></ProtectedRoute>
          } />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
