import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/slices/authSlice";

const navItems = {
  student: [
    { to: "/student/dashboard", label: "Dashboard", icon: "🏠" },
    { to: "/student/courses", label: "Browse Courses", icon: "🔍" },
    { to: "/student/my-courses", label: "My Learning", icon: "📖" },
  ],
  instructor: [
    { to: "/instructor/dashboard", label: "Dashboard", icon: "🏠" },
    { to: "/instructor/courses", label: "My Courses", icon: "📚" },
    { to: "/instructor/courses/new", label: "Create Course", icon: "➕" },
  ],
  admin: [
    { to: "/admin/dashboard", label: "Dashboard", icon: "🏠" },
    { to: "/admin/users", label: "Users", icon: "👥" },
    { to: "/admin/courses", label: "Courses", icon: "📚" },
  ],
};

const Sidebar = ({ isOpen, sidebarRef, onLogoClick }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const items = navItems[user?.role] || [];

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <aside ref={sidebarRef} className={`sidebar ${isOpen ? "open" : ""}`}>
      <div 
        className="sidebar-logo-container" 
        onClick={onLogoClick} 
        style={{ cursor: "pointer" }}
      >
        <img src="/logo.svg" alt="EduFlow Wing" className="sidebar-logo-img" />
        <div className="sidebar-logo">EduFlow</div>
      </div>

      <ul className="sidebar-nav">
        {items.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-3" style={{ borderTop: "1px solid var(--dark-border)" }}>
        <div className="px-2 mb-3">
          <p className="mb-0" style={{ fontSize: "0.85rem", fontWeight: 600 }}>{user?.name}</p>
          <p className="mb-0" style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
            {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
          </p>
        </div>
        <button
          className="btn btn-sm w-100 mb-2"
          style={{ background: "rgba(255,255,255,0.1)", color: "#e2e8f0", border: "1px solid rgba(255,255,255,0.2)" }}
          onClick={() => navigate("/change-password")}
        >
          🔒 Change Password
        </button>
        <button
          className="btn btn-sm w-100"
          style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.3)" }}
          onClick={handleLogout}
        >
          🚪 Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
