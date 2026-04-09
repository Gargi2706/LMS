import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { changePassword } from "../../services/authService";
import DashboardLayout from "../../components/templates/DashboardLayout";

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword !== confirmPassword) {
      return setError("New passwords do not match.");
    }
    if (newPassword.length < 6) {
      return setError("New password must be at least 6 characters.");
    }

    setLoading(true);
    try {
      const res = await changePassword({ oldPassword, newPassword });
      setSuccess(res.data.message || "Password updated successfully.");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to change password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout title="Change Password">
      <div className="card fade-in-up" style={{ maxWidth: "500px", margin: "2rem auto" }}>
        <div className="card-body p-4">
          {error && <div className="alert alert-danger py-2">{error}</div>}
          {success && <div className="alert alert-success py-2">{success}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label text-muted-custom">Current Password</label>
              <div className="position-relative">
                <input 
                  type={showOldPassword ? "text" : "password"} 
                  className="form-control pe-5" 
                  value={oldPassword} 
                  onChange={(e) => setOldPassword(e.target.value)} 
                  required 
                />
                <button
                  type="button"
                  className="btn btn-link position-absolute top-50 end-0 translate-middle-y text-muted-custom text-decoration-none"
                  onClick={() => setShowOldPassword(!showOldPassword)}
                  style={{ zIndex: 10 }}
                >
                  {showOldPassword ? "👁️" : "🙈"}
                </button>
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label text-muted-custom">New Password</label>
              <div className="position-relative">
                <input 
                  type={showNewPassword ? "text" : "password"} 
                  className="form-control pe-5" 
                  value={newPassword} 
                  onChange={(e) => setNewPassword(e.target.value)} 
                  required 
                />
                <button
                  type="button"
                  className="btn btn-link position-absolute top-50 end-0 translate-middle-y text-muted-custom text-decoration-none"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  style={{ zIndex: 10 }}
                >
                  {showNewPassword ? "👁️" : "🙈"}
                </button>
              </div>
            </div>
            <div className="mb-4">
              <label className="form-label text-muted-custom">Confirm New Password</label>
              <div className="position-relative">
                <input 
                  type={showConfirmPassword ? "text" : "password"} 
                  className="form-control pe-5" 
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)} 
                  required 
                />
                <button
                  type="button"
                  className="btn btn-link position-absolute top-50 end-0 translate-middle-y text-muted-custom text-decoration-none"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{ zIndex: 10 }}
                >
                  {showConfirmPassword ? "👁️" : "🙈"}
                </button>
              </div>
            </div>
            
            <div className="d-flex justify-content-end gap-2">
              <button type="button" className="btn btn-outline-primary" onClick={() => navigate(-1)} disabled={loading}>
                Back
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? "Updating..." : "Update Password"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ChangePassword;
