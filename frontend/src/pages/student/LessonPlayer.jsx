import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DashboardLayout from "../../components/templates/DashboardLayout";
import Spinner from "../../components/atoms/Spinner";
import { getLessons } from "../../services/courseService";
import { getCourseById } from "../../services/courseService";
import { getMyEnrollments, markLessonComplete } from "../../services/enrollmentService";
import CourseReviews from "../../components/organisms/CourseReviews";

const LessonPlayer = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [enrollment, setEnrollment] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [cRes, lRes, eRes] = await Promise.all([
          getCourseById(courseId),
          getLessons(courseId),
          getMyEnrollments(),
        ]);
        setCourse(cRes.data.data);
        setLessons(lRes.data.data || []);
        const en = (eRes.data.data || []).find((e) => e.course?._id === courseId);
        setEnrollment(en);
        if (lRes.data.data?.length > 0) setActiveLesson(lRes.data.data[0]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [courseId]);

  const handleMarkComplete = async () => {
    if (!activeLesson) return;
    try {
      const { data } = await markLessonComplete(courseId, activeLesson._id);
      setEnrollment(data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const isCompleted = (lessonId) =>
    enrollment?.completedLessons?.includes(lessonId);

  if (loading) return <DashboardLayout title=""><Spinner /></DashboardLayout>;

  return (
    <DashboardLayout title={course?.title}>
      <div className="row g-3">
        {/* Lesson player */}
        <div className="col-lg-8">
          <div className="card mb-3">
            <div className="card-body">
              {activeLesson ? (
                <>
                  <h5 style={{ fontWeight: 700, marginBottom: "1rem" }}>
                    {activeLesson.title}
                  </h5>
                  {activeLesson.contentType === "video" && activeLesson.videoUrl ? (
                    <video
                      src={activeLesson.videoUrl}
                      controls
                      style={{ width: "100%", borderRadius: 8, background: "#000" }}
                    />
                  ) : (
                    <div
                      style={{ minHeight: 160, color: "var(--text-muted)", whiteSpace: "pre-wrap" }}
                    >
                      {activeLesson.textContent || "No content available."}
                    </div>
                  )}
                  <div className="mt-3 d-flex align-items-center gap-3">
                    <button
                      className="btn btn-sm btn-success"
                      onClick={handleMarkComplete}
                      disabled={isCompleted(activeLesson._id)}
                    >
                      {isCompleted(activeLesson._id) ? "✅ Completed" : "Mark as Complete"}
                    </button>
                    <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                      Progress: {enrollment?.progress ?? 0}%
                    </span>
                  </div>
                </>
              ) : (
                <p style={{ color: "var(--text-muted)" }}>Select a lesson to start.</p>
              )}
            </div>
          </div>
          
          <CourseReviews courseId={courseId} />
        </div>

        {/* Lesson list */}
        <div className="col-lg-4">
          <div className="card">
            <div className="card-body">
              <h6 className="mb-3" style={{ fontWeight: 700 }}>
                Course Content
                <span className="ms-2" style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                  {lessons.length} lessons
                </span>
              </h6>
              {lessons.map((lesson) => (
                <div
                  key={lesson._id}
                  className={`lesson-item ${activeLesson?._id === lesson._id ? "active" : ""}`}
                  onClick={() => setActiveLesson(lesson)}
                >
                  <span>{isCompleted(lesson._id) ? "✅" : "▶️"}</span>
                  <div style={{ flex: 1 }}>
                    <p className="mb-0" style={{ fontSize: "0.85rem", fontWeight: 500 }}>
                      {lesson.title}
                    </p>
                    <p className="mb-0" style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                      {lesson.contentType} · {lesson.duration || 0} min
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default LessonPlayer;
