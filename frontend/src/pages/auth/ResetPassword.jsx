import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { resetPassword } from "../../services/authService";
import ThemeToggle from "../../components/atoms/ThemeToggle";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  
  const [form, setForm] = useState({ password: "", confirmPassword: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);

    try {
      const { data } = await resetPassword(token, { password: form.password });
      setMessage(data.message || "Password reset successful.");
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password. The link might be invalid or expired.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page position-relative">
      <div style={{ position: "absolute", top: "20px", right: "20px" }}>
        <ThemeToggle />
      </div>
      <div className="auth-card">
        <div className="text-center mb-4">
          <div className="d-flex align-items-center justify-content-center mb-2" style={{ gap: '12px' }}>
            <img src="/logo.svg" alt="EduFlow Wing" className="logo-image" />
            <div className="auth-logo">EduFlow</div>
          </div>
          <h4 className="mb-2">Reset Password</h4>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
            Enter your new password below.
          </p>
        </div>

        {error && (
          <div className="alert alert-danger py-2" style={{ fontSize: "0.85rem" }}>
            {error}
          </div>
        )}
        {message && (
          <div className="alert alert-success py-2" style={{ fontSize: "0.85rem" }}>
            {message} <br/> Redirecting to login...
          </div>
        )}

        {!message && (
          <form onSubmit={handleSubmit} autoComplete="off">
            <div className="mb-3">
              <label className="form-label" style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                New Password
              </label>
              <div className="position-relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className="form-control pe-5"
                  placeholder="Enter new password"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="btn btn-link position-absolute top-50 end-0 translate-middle-y text-muted-custom text-decoration-none"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ zIndex: 10 }}
                >
                  {showPassword ? "👁️" : "🙈"}
                </button>
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label" style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                Confirm New Password
              </label>
              <div className="position-relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  className="form-control pe-5"
                  placeholder="Confirm new password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={loading}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}

        <p className="text-center mt-4 mb-0" style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
          Remembered your password?{" "}
          <Link to="/login" style={{ color: "var(--primary-light)" }}>
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
