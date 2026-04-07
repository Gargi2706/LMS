import { useEffect, useState } from "react";
import { getCourseReviews, addReview } from "../../services/courseService";
import { useSelector } from "react-redux";

const CourseReviews = ({ courseId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { user } = useSelector((s) => s.auth);

  const loadReviews = async () => {
    try {
      const { data } = await getCourseReviews(courseId);
      setReviews(data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (courseId) loadReviews();
  }, [courseId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setSubmitting(true);
    try {
      await addReview(courseId, { rating, comment });
      setComment("");
      setRating(5);
      loadReviews();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  const isStudent = user?.role === "student";

  return (
    <div className="card mt-4">
      <div className="card-body">
        <h5 className="mb-4" style={{ fontWeight: 700 }}>Course Reviews</h5>

        {/* Form for students to leave a review */}
        {isStudent && (
          <form onSubmit={handleSubmit} className="mb-4 p-3 rounded" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--dark-border)" }}>
            <h6 style={{ fontWeight: 600 }}>Leave a Review</h6>
            <div className="mb-2">
              <label className="form-label" style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Rating</label>
              <select className="form-select w-auto" value={rating} onChange={(e) => setRating(Number(e.target.value))}>
                {[5, 4, 3, 2, 1].map(r => <option key={r} value={r}>{r} Stars</option>)}
              </select>
            </div>
            <div className="mb-2">
              <textarea
                className="form-control"
                rows="3"
                placeholder="What did you think of this course?"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
              ></textarea>
            </div>
            <button type="submit" className="btn btn-sm btn-primary" disabled={submitting}>
              {submitting ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        )}

        {/* Existing Reviews */}
        {loading ? (
          <div>Loading reviews...</div>
        ) : reviews.length === 0 ? (
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>No reviews yet. Be the first to review!</p>
        ) : (
          <div className="d-flex flex-column gap-3">
            {reviews.map((r) => (
              <div key={r._id} className="p-3 rounded" style={{ background: "var(--dark)", border: "1px solid var(--dark-border)" }}>
                <div className="d-flex justify-content-between mb-2">
                  <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>{r.user?.name || "Unknown User"}</span>
                  <span style={{ color: "#facc15", fontSize: "0.9rem" }}>{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</span>
                </div>
                <p className="mb-0" style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>{r.comment}</p>
                <div className="mt-2 text-end" style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                  {new Date(r.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseReviews;
