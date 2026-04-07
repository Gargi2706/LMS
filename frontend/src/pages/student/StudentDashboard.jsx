import { useEffect, useState } from "react";
import DashboardLayout from "../../components/templates/DashboardLayout";
import StatCard from "../../components/molecules/StatCard";
import CourseCard from "../../components/molecules/CourseCard";
import Spinner from "../../components/atoms/Spinner";
import EmptyState from "../../components/atoms/EmptyState";
import { getMyEnrollments } from "../../services/enrollmentService";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts";

const StudentDashboard = () => {
  const { user } = useSelector((s) => s.auth);
  const navigate = useNavigate();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyEnrollments()
      .then(({ data }) => setEnrollments(data.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const completed = enrollments.filter((e) => e.status === "completed").length;
  const inProgress = enrollments.filter((e) => e.status === "active").length;

  return (
    <DashboardLayout title={`Welcome back, ${user?.name?.split(" ")[0]} 👋`}>
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <StatCard icon="📚" label="Enrolled Courses" value={enrollments.length} color="#4f46e5" />
        </div>
        <div className="col-md-4">
          <StatCard icon="⏳" label="In Progress" value={inProgress} color="#06b6d4" />
        </div>
        <div className="col-md-4">
          <StatCard icon="✅" label="Completed" value={completed} color="#10b981" />
        </div>
      </div>

      <div className="d-flex align-items-center justify-content-between mb-3">
        <h5 className="mb-0" style={{ fontWeight: 700 }}>Continue Learning</h5>
        <button className="btn btn-sm btn-outline-primary" onClick={() => navigate("/student/courses")}>
          Browse Courses
        </button>
      </div>

      {!loading && enrollments.length > 0 && (
        <div className="card mb-4">
          <div className="card-body row align-items-center">
            <div className="col-md-6">
              <h6 style={{ fontWeight: 600 }}>Your Learning Progress</h6>
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                Keep it up! Consistency is key to mastering new skills.
              </p>
            </div>
            <div className="col-md-6">
              <div style={{ height: 180 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: "Completed", value: completed },
                        { name: "In Progress", value: inProgress },
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={70}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      <Cell fill="#10b981" />
                      <Cell fill="#06b6d4" />
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
      ) : enrollments.length === 0 ? (
        <EmptyState icon="🎓" message="You haven't enrolled in any courses yet. Start learning!" />
      ) : (
        <div className="row g-3">
          {enrollments.map((en) => (
            <div key={en._id} className="col-md-4">
              <CourseCard
                course={en.course}
                showProgress
                progress={en.progress}
                actionLabel="Continue"
                onAction={() => navigate(`/student/my-courses/${en.course._id}`)}
              />
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default StudentDashboard;
