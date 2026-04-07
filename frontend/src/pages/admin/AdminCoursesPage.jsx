import { useEffect, useState } from "react";
import DashboardLayout from "../../components/templates/DashboardLayout";
import Spinner from "../../components/atoms/Spinner";
import EmptyState from "../../components/atoms/EmptyState";
import StatusBadge from "../../components/atoms/StatusBadge";
import { getAllCoursesAdmin, adminDeleteCourse } from "../../services/adminService";

const AdminCoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    getAllCoursesAdmin()
      .then(({ data }) => setCourses(data.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleDelete = async (courseId) => {
    if (!window.confirm("Delete this course permanently?")) return;
    await adminDeleteCourse(courseId);
    load();
  };

  return (
    <DashboardLayout title="All Courses">
      <div className="d-flex justify-content-end mb-3">
        <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>{courses.length} courses total</span>
      </div>

      {loading ? <Spinner /> : courses.length === 0 ? (
        <EmptyState icon="📚" message="No courses on the platform yet." />
      ) : (
        <div className="card">
          <div className="card-body p-0">
            <table className="table table-dark mb-0">
              <thead>
                <tr>
                  <th>Title</th><th>Instructor</th><th>Lessons</th><th>Status</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((c) => (
                  <tr key={c._id}>
                    <td style={{ fontWeight: 500 }}>{c.title}</td>
                    <td style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>{c.instructor?.name}</td>
                    <td>{c.totalLessons}</td>
                    <td><StatusBadge status={c.isPublished ? "published" : "draft"} /></td>
                    <td>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(c._id)}>
                        Remove
                      </button>
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

export default AdminCoursesPage;
