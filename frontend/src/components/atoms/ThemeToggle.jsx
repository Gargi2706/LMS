import { useTheme } from "../../hooks/useTheme";

const ThemeToggle = ({ className = "" }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      className={`btn btn-outline-secondary d-flex align-items-center justify-content-center p-2 rounded-circle ${className}`}
      onClick={toggleTheme}
      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      style={{
        width: "40px",
        height: "40px",
        border: "1px solid var(--dark-border)",
        background: "var(--dark-card)",
        color: "var(--text-main)",
      }}
    >
      {theme === "dark" ? "☀️" : "🌙"}
    </button>
  );
};

export default ThemeToggle;
