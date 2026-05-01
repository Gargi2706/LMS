import { useState } from "react";
import { Link } from "react-router-dom";
import placeholderImage from "../../assets/hero.png";

const getImageUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  const rawBaseUrl = import.meta.env.VITE_API_URL;
  const baseUrl = rawBaseUrl
    ? rawBaseUrl.replace(/\/+$/g, "").replace(/\/api$/g, "")
    : window.location.origin;
  return new URL(path, baseUrl).href;
};

const CourseCard = ({ course, actionLabel, onAction, showProgress, progress = 0 }) => {
  const [imageFailed, setImageFailed] = useState(false);
  const remoteThumbnail = course.thumbnail ? getImageUrl(course.thumbnail) : "";
  const thumbnail = course.thumbnail && !imageFailed ? remoteThumbnail : placeholderImage;

  return (
    <div className="course-card fade-in-up">
      <div
        className="course-card-img d-flex align-items-center justify-content-center"
        style={{ backgroundImage: `url(${thumbnail})`, backgroundSize: "cover", backgroundPosition: "center" }}
      >
        {course.thumbnail && !imageFailed && (
          <img
            src={remoteThumbnail}
            alt={course.title}
            style={{ display: "none" }}
            onError={() => setImageFailed(true)}
          />
        )}
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
