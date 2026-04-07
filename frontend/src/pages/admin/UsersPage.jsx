import { useEffect, useState } from "react";
import DashboardLayout from "../../components/templates/DashboardLayout";
import Spinner from "../../components/atoms/Spinner";
import EmptyState from "../../components/atoms/EmptyState";
import StatusBadge from "../../components/atoms/StatusBadge";
import { getAllUsers, toggleUserStatus, approveInstructor } from "../../services/adminService";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const load = () => {
    getAllUsers()
      .then(({ data }) => setUsers(data.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleToggle = async (userId) => {
    await toggleUserStatus(userId);
    load();
  };

  const handleApprove = async (userId) => {
    await approveInstructor(userId);
    load();
  };

  const filtered = users.filter((u) => filter === "all" || u.role === filter);

  return (
    <DashboardLayout title="User Management">
      <div className="d-flex gap-2 mb-4">
        {["all", "student", "instructor"].map((f) => (
          <button
            key={f}
            className={`btn btn-sm ${filter === f ? "btn-primary" : "btn-outline-secondary"}`}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
        <span className="ms-auto" style={{ color: "var(--text-muted)", fontSize: "0.85rem", alignSelf: "center" }}>
          {filtered.length} users
        </span>
      </div>

      {loading ? <Spinner /> : filtered.length === 0 ? (
        <EmptyState icon="👤" message="No users found." />
      ) : (
        <div className="card">
          <div className="card-body p-0">
            <table className="table table-dark mb-0">
              <thead>
                <tr>
                  <th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Approved</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => (
                  <tr key={u._id}>
                    <td style={{ fontWeight: 500 }}>{u.name}</td>
                    <td style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>{u.email}</td>
                    <td><span className="badge bg-secondary">{u.role}</span></td>
                    <td><StatusBadge status={u.status} /></td>
                    <td>
                      {u.role === "instructor"
                        ? u.isApproved
                          ? <span style={{ color: "#10b981", fontSize: "0.8rem" }}>✅ Yes</span>
                          : <span style={{ color: "#f59e0b", fontSize: "0.8rem" }}>⏳ Pending</span>
                        : <span style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>—</span>}
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <button
                          className={`btn btn-sm ${u.status === "active" ? "btn-outline-danger" : "btn-outline-success"}`}
                          onClick={() => handleToggle(u._id)}
                        >
                          {u.status === "active" ? "Block" : "Unblock"}
                        </button>
                        {u.role === "instructor" && !u.isApproved && (
                          <button className="btn btn-sm btn-outline-success" onClick={() => handleApprove(u._id)}>
                            Approve
                          </button>
                        )}
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

export default UsersPage;
