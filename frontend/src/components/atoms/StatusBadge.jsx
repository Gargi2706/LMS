const StatusBadge = ({ status }) => {
  const map = {
    active: "success",
    blocked: "danger",
    completed: "primary",
    published: "success",
    draft: "warning",
  };
  const variant = map[status] || "secondary";
  return (
    <span className={`badge bg-${variant} status-badge`}>
      {status?.charAt(0).toUpperCase() + status?.slice(1)}
    </span>
  );
};

export default StatusBadge;
