const EmptyState = ({ icon = "📭", message = "Nothing here yet." }) => (
  <div className="text-center py-5">
    <div style={{ fontSize: "3rem" }}>{icon}</div>
    <p className="mt-3" style={{ color: "var(--text-muted)" }}>{message}</p>
  </div>
);

export default EmptyState;
