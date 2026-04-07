import { useEffect, useState } from "react";
import DashboardLayout from "../../components/templates/DashboardLayout";
import StatCard from "../../components/molecules/StatCard";
import Spinner from "../../components/atoms/Spinner";
import EmptyState from "../../components/atoms/EmptyState";
import StatusBadge from "../../components/atoms/StatusBadge";
import { getInstructorCourses, togglePublish, deleteCourse } from "../../services/courseService";
import { getEnrolledStudents } from "../../services/enrollmentService";
import { useNavigate } from "react-router-dom";
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts";

const InstructorDashboard = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    getInstructorCourses()
      .then(({ data }) => setCourses(data.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleToggle = async (id) => {
    await togglePublish(id);
    load();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this course and all its lessons?")) return;
    await deleteCourse(id);
    load();
  };

  const published = courses.filter((c) => c.isPublished).length;

  return (
    <DashboardLayout title="Instructor Dashboard">
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <StatCard icon="📚" label="Total Courses" value={courses.length} color="#4f46e5" />
        </div>
        <div className="col-md-4">
          <StatCard icon="✅" label="Published" value={published} color="#10b981" />
        </div>
        <div className="col-md-4">
          <StatCard icon="📝" label="Drafts" value={courses.length - published} color="#f59e0b" />
        </div>
      </div>

      <div className="d-flex align-items-center justify-content-between mb-3">
        <h5 className="mb-0" style={{ fontWeight: 700 }}>My Courses</h5>
        <button className="btn btn-primary btn-sm" onClick={() => navigate("/instructor/courses/new")}>
          + New Course
        </button>
      </div>

      {!loading && courses.length > 0 && (
        <div className="card mb-4">
          <div className="card-body row align-items-center">
            <div className="col-md-6">
              <h6 style={{ fontWeight: 600 }}>Course Status Overview</h6>
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                A quick look at your published vs draft courses. Keep creating!
              </p>
            </div>
            <div className="col-md-6">
              <div style={{ height: 180 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: "Published", value: published },
                        { name: "Drafts", value: courses.length - published },
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={70}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      <Cell fill="#10b981" />
                      <Cell fill="#f59e0b" />
                    </Pie>
                    <RechartsTooltip contentStyle={{ backgroundColor: "#1e293b", border: "none", borderRadius: 8, color: "#fff" }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <Spinner />
      ) : courses.length === 0 ? (
        <EmptyState icon="📭" message="You haven't created any courses yet." />
      ) : (
        <div className="card">
          <div className="card-body p-0">
            <table className="table table-dark mb-0">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Lessons</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course) => (
                  <tr key={course._id}>
                    <td style={{ fontWeight: 500 }}>{course.title}</td>
                    <td>{course.totalLessons}</td>
                    <td>
                      <StatusBadge status={course.isPublished ? "published" : "draft"} />
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => navigate(`/instructor/courses/${course._id}/lessons`)}
                        >
                          Lessons
                        </button>
                        <button
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() => navigate(`/instructor/courses/${course._id}/edit`)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-sm"
                          style={{ background: course.isPublished ? "rgba(245,158,11,0.15)" : "rgba(16,185,129,0.15)", color: course.isPublished ? "#f59e0b" : "#10b981", border: `1px solid ${course.isPublished ? "#f59e0b" : "#10b981"}` }}
                          onClick={() => handleToggle(course._id)}
                        >
                          {course.isPublished ? "Unpublish" : "Publish"}
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(course._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default InstructorDashboard;
