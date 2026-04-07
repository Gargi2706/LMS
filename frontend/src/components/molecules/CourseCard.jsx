import { Link } from "react-router-dom";

const CourseCard = ({ course, actionLabel, onAction, showProgress, progress = 0 }) => {
  const thumbnail = course.thumbnail
    ? course.thumbnail
    : null;

  return (
    <div className="course-card fade-in-up">
      <div
        className="course-card-img d-flex align-items-center justify-content-center"
        style={
          thumbnail
            ? { backgroundImage: `url(${thumbnail})`, backgroundSize: "cover", backgroundPosition: "center" }
            : { background: "linear-gradient(135deg, #1e293b, #1a1a3e)" }
        }
      >
        {!thumbnail && <span style={{ fontSize: "2.5rem" }}>📚</span>}
      </div>

      <div className="course-card-body">
        <p className="course-card-title">{course.title}</p>
        <p className="course-card-meta mb-2">
          {course.instructor?.name || "Instructor"} &middot; {course.totalLessons || 0} lessons
        </p>

        {showProgress && (
          <div className="mb-2">
            <div className="d-flex justify-content-between mb-1" style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="progress">
              <div className="progress-bar" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}

        {actionLabel && (
          <button
            className="btn btn-primary btn-sm w-100 mt-2"
            onClick={() => onAction && onAction(course)}
          >
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
};

export default CourseCard;
