import { useEffect, useState } from "react";
import DashboardLayout from "../../components/templates/DashboardLayout";
import CourseCard from "../../components/molecules/CourseCard";
import Spinner from "../../components/atoms/Spinner";
import EmptyState from "../../components/atoms/EmptyState";
import { getAllCourses } from "../../services/courseService";
import { enrollInCourse } from "../../services/enrollmentService";
import { useNavigate } from "react-router-dom";

const CourseCatalog = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [enrolling, setEnrolling] = useState(null);
  const [toast, setToast] = useState("");

  const fetchCourses = (q = "") => {
    setLoading(true);
    getAllCourses(q)
      .then(({ data }) => setCourses(data.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchCourses(); }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchCourses(search);
  };

  const handleEnroll = async (course) => {
    setEnrolling(course._id);
    try {
      await enrollInCourse(course._id);
      setToast(`✅ Enrolled in "${course.title}"!`);
      setTimeout(() => setToast(""), 3000);
    } catch (err) {
      setToast(err.response?.data?.message || "Enrollment failed.");
      setTimeout(() => setToast(""), 3000);
    } finally {
      setEnrolling(null);
    }
  };

  return (
    <DashboardLayout title="Browse Courses">
      {toast && (
        <div className="alert py-2 mb-3" style={{ background: "rgba(16,185,129,0.15)", border: "1px solid #10b981", color: "#10b981", borderRadius: 8 }}>
          {toast}
        </div>
      )}

      <form onSubmit={handleSearch} className="d-flex gap-2 mb-4">
        <input
          id="course-search"
          type="text"
          className="form-control"
          placeholder="Search courses by title, category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit" className="btn btn-primary px-4">Search</button>
      </form>

      {loading ? (
        <Spinner />
      ) : courses.length === 0 ? (
        <EmptyState icon="🔍" message="No courses found. Try a different search." />
      ) : (
        <div className="row g-3">
          {courses.map((course) => (
            <div key={course._id} className="col-md-4">
              <CourseCard
                course={course}
                actionLabel={enrolling === course._id ? "Enrolling..." : "Enroll Now"}
                onAction={handleEnroll}
              />
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default CourseCatalog;
