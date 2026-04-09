import { useEffect, useState } from "react";
import DashboardLayout from "../../components/templates/DashboardLayout";
import Spinner from "../../components/atoms/Spinner";
import EmptyState from "../../components/atoms/EmptyState";
import StatusBadge from "../../components/atoms/StatusBadge";
import { getInstructorCourses } from "../../services/courseService";
import { getEnrolledStudents } from "../../services/enrollmentService";
import { useNavigate } from "react-router-dom";

const InstructorCourses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedCourseId, setExpandedCourseId] = useState(null);
  
  // Cache of courseId -> students array
  const [enrollmentsMap, setEnrollmentsMap] = useState({});
  const [loadingStudents, setLoadingStudents] = useState({});

  useEffect(() => {
    getInstructorCourses()
      .then(({ data }) => setCourses(data.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const toggleExpand = async (courseId) => {
    if (expandedCourseId === courseId) {
      setExpandedCourseId(null);
      return;
    }
    
    setExpandedCourseId(courseId);
    
    // Fetch if not cached
    if (!enrollmentsMap[courseId]) {
      setLoadingStudents((prev) => ({ ...prev, [courseId]: true }));
      try {
        const { data } = await getEnrolledStudents(courseId);
        setEnrollmentsMap((prev) => ({ ...prev, [courseId]: data.data || [] }));
      } catch (err) {
        console.error("Failed to fetch enrollments", err);
      } finally {
        setLoadingStudents((prev) => ({ ...prev, [courseId]: false }));
      }
    }
  };

  return (
    <DashboardLayout title="My Courses">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h5 className="mb-0" style={{ fontWeight: 700 }}>Course Enrollments & Management</h5>
        <button className="btn btn-primary btn-sm" onClick={() => navigate("/instructor/courses/new")}>
          + New Course
        </button>
      </div>

      {loading ? (
        <Spinner />
      ) : courses.length === 0 ? (
        <EmptyState icon="📭" message="You haven't created any courses yet." />
      ) : (
        <div className="d-flex flex-column gap-3">
          {courses.map((course) => {
            const isExpanded = expandedCourseId === course._id;
            const students = enrollmentsMap[course._id] || [];
            const isLoadingStudents = loadingStudents[course._id];

            return (
              <div key={course._id} className="card overflow-hidden">
                <div 
                  className="card-body d-flex align-items-center justify-content-between" 
                  style={{ cursor: "pointer", background: isExpanded ? "rgba(79, 70, 229, 0.05)" : "transparent" }}
                  onClick={() => toggleExpand(course._id)}
                >
                  <div>
                    <h6 className="mb-1" style={{ fontWeight: 600 }}>{course.title}</h6>
                    <div className="d-flex align-items-center gap-3" style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                      <span><StatusBadge status={course.isPublished ? "published" : "draft"} /></span>
                      <span>Total Lessons: {course.totalLessons}</span>
                    </div>
                  </div>
                  <div className="d-flex align-items-center gap-3">
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/instructor/courses/${course._id}/edit`);
                      }}
                    >
                      Edit
                    </button>
                    <span style={{ fontSize: "1.2rem", color: "var(--text-muted)", transition: "transform 0.2s", transform: isExpanded ? "rotate(180deg)" : "none" }}>
                      ▼
                    </span>
                  </div>
                </div>

                {/* Expanded Student List */}
                {isExpanded && (
                  <div className="card-footer border-top border-dark-custom p-0 bg-dark">
                    {isLoadingStudents ? (
                      <div className="p-4 text-center">
                        <Spinner />
                      </div>
                    ) : students.length === 0 ? (
                      <div className="p-4 text-center text-muted-custom" style={{ fontSize: "0.9rem" }}>
                        No students enrolled in this course yet.
                      </div>
                    ) : (
                      <table className="table table-dark mb-0">
                        <thead>
                          <tr>
                            <th className="px-4">Student Name</th>
                            <th>Email</th>
                            <th>Progress</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {students.map((enrollment) => (
                            <tr key={enrollment._id}>
                              <td className="px-4 py-3">{enrollment.student.name}</td>
                              <td className="py-3 text-muted-custom">{enrollment.student.email}</td>
                              <td className="py-3">
                                <div className="d-flex align-items-center gap-2">
                                  <div className="progress w-100" style={{ height: "6px", maxWidth: "100px" }}>
                                    <div className="progress-bar" style={{ width: `${enrollment.progress}%` }}></div>
                                  </div>
                                  <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{enrollment.progress}%</span>
                                </div>
                              </td>
                              <td className="py-3">
                                <span className={`badge ${enrollment.status === "completed" ? "bg-success" : "bg-primary"}`}>
                                  {enrollment.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
};

export default InstructorCourses;
