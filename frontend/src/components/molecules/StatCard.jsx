const StatCard = ({ icon, label, value, color = "#4f46e5" }) => (
  <div className="stat-card fade-in-up">
    <div className="stat-icon" style={{ background: `${color}22`, color }}>
      {icon}
    </div>
    <div className="stat-value">{value}</div>
    <div className="stat-label">{label}</div>
  </div>
);

export default StatCard;
