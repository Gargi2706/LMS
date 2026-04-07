import { useEffect, useState } from "react";
import DashboardLayout from "../../components/templates/DashboardLayout";
import StatCard from "../../components/molecules/StatCard";
import Spinner from "../../components/atoms/Spinner";
import { getAdminStats } from "../../services/adminService";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminStats()
      .then(({ data }) => setStats(data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout title="Admin Dashboard">
      {loading ? (
        <Spinner />
      ) : (
        <>
          <div className="row g-3 mb-4">
            <div className="col-md-3">
              <StatCard icon="👥" label="Total Users" value={stats?.totalUsers ?? 0} color="#4f46e5" />
            </div>
            <div className="col-md-3">
              <StatCard icon="📚" label="Total Courses" value={stats?.totalCourses ?? 0} color="#06b6d4" />
            </div>
            <div className="col-md-3">
              <StatCard icon="🎓" label="Enrollments" value={stats?.totalEnrollments ?? 0} color="#10b981" />
            </div>
            <div className="col-md-3">
              <StatCard icon="⏳" label="Pending Instructors" value={stats?.pendingInstructors ?? 0} color="#f59e0b" />
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <h5 className="mb-1" style={{ fontWeight: 700 }}>Platform Overview</h5>
              <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
                Use the sidebar to manage users, approve instructors, and remove inappropriate courses.
              </p>
              <div className="row g-3 mt-2">
                {[
                  { label: "Approval Rate", value: stats?.totalUsers ? `${Math.round(((stats.totalUsers - stats.pendingInstructors) / stats.totalUsers) * 100)}%` : "—", color: "#10b981" },
                  { label: "Avg Enrollments/Course", value: stats?.totalCourses ? (stats.totalEnrollments / stats.totalCourses).toFixed(1) : "—", color: "#4f46e5" },
                ].map((item) => (
                  <div key={item.label} className="col-md-4">
                    <div style={{ background: "var(--dark)", borderRadius: 8, padding: "1rem", border: "1px solid var(--dark-border)" }}>
                      <div style={{ fontSize: "1.5rem", fontWeight: 800, color: item.color }}>{item.value}</div>
                      <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{item.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="card mt-4">
            <div className="card-body">
              <h5 className="mb-4" style={{ fontWeight: 700 }}>System Metrics</h5>
              <div style={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    { name: "Users", value: stats?.totalUsers || 0, color: "#4f46e5" },
                    { name: "Courses", value: stats?.totalCourses || 0, color: "#06b6d4" },
                    { name: "Enrollments", value: stats?.totalEnrollments || 0, color: "#10b981" },
                  ]}>
                    <XAxis dataKey="name" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ backgroundColor: "#1e293b", border: "none", borderRadius: 8 }} />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                      {
                        [
                          { name: "Users", value: stats?.totalUsers || 0, color: "#4f46e5" },
                          { name: "Courses", value: stats?.totalCourses || 0, color: "#06b6d4" },
                          { name: "Enrollments", value: stats?.totalEnrollments || 0, color: "#10b981" },
                        ].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))
                      }
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
};

export default AdminDashboard;
