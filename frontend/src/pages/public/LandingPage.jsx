import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAllCourses } from "../../services/courseService";
import Spinner from "../../components/atoms/Spinner";

const LandingPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getAllCourses()
      .then((res) => setCourses(res.data.data || []))
      .catch((err) => console.error("Failed to load courses:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--bg-dark)", color: "var(--text-light)" }}>
      {/* Navigation */}
      <nav className="navbar navbar-expand-lg border-bottom px-4 py-3" style={{ borderColor: "var(--border-dark)" }}>
        <div className="container-fluid align-items-center">
          <div className="d-flex align-items-center gap-2" style={{ userSelect: "none" }}>
            <img src="/logo.svg" alt="EduFlow Wing" style={{ width: 32, height: 32 }} />
            <span style={{ fontSize: "1.4rem", fontWeight: 800, letterSpacing: "-0.5px", background: "linear-gradient(90deg, #a5b4fc, #818cf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              EduFlow
            </span>
          </div>
          <div className="d-flex gap-3 ms-auto">
            <Link to="/login" className="btn btn-outline-light px-4" style={{ borderRadius: "8px", fontWeight: "600" }}>Login</Link>
            <Link to="/register" className="btn btn-primary px-4" style={{ borderRadius: "8px", fontWeight: "600" }}>Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="text-center py-5" style={{ background: "linear-gradient(180deg, rgba(79, 70, 229, 0.1) 0%, rgba(15, 23, 42, 0) 100%)", paddingBottom: "6rem !important", paddingTop: "5rem !important" }}>
        <div className="container py-5">
          <h1 className="display-4 fw-bold mb-4" style={{ letterSpacing: "-1px" }}>
            Unlock Your Potential with <span style={{ color: "var(--primary-light)" }}>EduFlow</span>
          </h1>
          <p className="lead mb-5 mx-auto" style={{ maxWidth: "600px", color: "var(--text-muted)" }}>
            Join thousands of learners and top-tier instructors building the future of education. Dive into our expansive catalog of premium courses today.
          </p>
          <div className="d-flex justify-content-center gap-3">
            <button onClick={() => { document.getElementById('courses').scrollIntoView({ behavior: 'smooth' }) }} className="btn btn-lg btn-primary px-5" style={{ borderRadius: "30px", fontWeight: "600", padding: "12px 0" }}>
              Explore Courses
            </button>
            <Link to="/register" className="btn btn-lg btn-outline-light px-5" style={{ borderRadius: "30px", fontWeight: "600", padding: "12px 0" }}>
              Become an Instructor
            </Link>
          </div>
        </div>
      </header>

      {/* Courses Section */}
      <main id="courses" className="container py-5 mt-4 mb-5">
        <div className="d-flex justify-content-between align-items-end mb-4">
          <div>
            <h2 className="fw-bold mb-2">Featured Courses</h2>
            <p style={{ color: "var(--text-muted)" }}>Discover new skills and elevate your career.</p>
          </div>
        </div>

        {loading ? (
          <div className="d-flex justify-content-center py-5">
            <Spinner />
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-5 card bg-dark-card border-dark-custom">
            <div className="card-body">
              <span style={{ fontSize: "3rem" }}>📭</span>
              <h5 className="mt-3">No courses available right now.</h5>
              <p className="text-muted text-sm">Check back later or register to create your own!</p>
            </div>
          </div>
        ) : (
          <div className="row g-4">
            {courses.map((course) => (
              <div key={course._id} className="col-12 col-md-6 col-lg-4">
                <div className="card h-100 bg-dark-card border-dark-custom overflow-hidden shadow-sm" style={{ transition: "transform 0.2s", cursor: "pointer" }} onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-5px)"} onMouseLeave={(e) => e.currentTarget.style.transform = "none"} onClick={() => navigate('/login')}>
                  <div style={{ height: "180px", backgroundColor: "rgba(255,255,255,0.05)", position: "relative" }}>
                    {course.thumbnail ? (
                      <img src={`http://localhost:5050${course.thumbnail}`} alt={course.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <div className="d-flex align-items-center justify-content-center w-100 h-100 placeholder-wave">
                        <span style={{ fontSize: "3rem" }}>📚</span>
                      </div>
                    )}
                    <span className="badge bg-primary position-absolute top-0 end-0 m-3 px-3 py-2 rounded-pill">
                      {course.category}
                    </span>
                  </div>
                  <div className="card-body d-flex flex-column p-4">
                    <h5 className="card-title fw-bold text-truncate mb-2" title={course.title}>{course.title}</h5>
                    <p className="card-text text-muted mb-4" style={{ fontSize: "0.9rem", display: "-webkit-box", WebkitLineClamp: "3", WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                      {course.description}
                    </p>
                    <div className="mt-auto d-flex align-items-center justify-content-between">
                      <div className="d-flex align-items-center gap-2">
                        <div className="rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{ width: "32px", height: "32px", backgroundColor: "var(--primary-dark)", color: "var(--primary-light)", fontSize: "0.8rem" }}>
                          {course.instructor?.name?.charAt(0).toUpperCase() || "I"}
                        </div>
                        <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                          {course.instructor?.name || "Unknown Instructor"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="py-4 border-top text-center" style={{ borderColor: "var(--border-dark)", background: "var(--bg-dark)" }}>
        <p className="mb-0 text-muted" style={{ fontSize: "0.85rem" }}>© 2026 EduFlow Learning Management System. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
