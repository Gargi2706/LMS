import { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../../services/authService";
import ThemeToggle from "../../components/atoms/ThemeToggle";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const { data } = await forgotPassword({ email });
      setMessage(data.message || "Email sent successfully.");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send reset email.");
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
          <h4 className="mb-2">Forgot Password</h4>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
            Enter your email to receive a password reset link.
          </p>
        </div>

        {error && (
          <div className="alert alert-danger py-2" style={{ fontSize: "0.85rem" }}>
            {error}
          </div>
        )}
        {message && (
          <div className="alert alert-success py-2" style={{ fontSize: "0.85rem" }}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} autoComplete="off">
          <div className="mb-4">
            <label className="form-label" style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
              Email Address
            </label>
            <input
              type="email"
              className="form-control"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 mb-3"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <p className="text-center mb-0" style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
          Remembered your password?{" "}
          <Link to="/login" style={{ color: "var(--primary-light)" }}>
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
