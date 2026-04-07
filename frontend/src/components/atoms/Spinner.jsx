const Spinner = ({ size = "md" }) => {
  const dim = size === "sm" ? "20px" : "40px";
  return (
    <div className="loader-container">
      <div className="spinner" style={{ width: dim, height: dim }} />
    </div>
  );
};

export default Spinner;
