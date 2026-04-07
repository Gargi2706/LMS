import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/templates/DashboardLayout";
import Spinner from "../../components/atoms/Spinner";
import EmptyState from "../../components/atoms/EmptyState";
import { getLessons, addLesson, deleteLesson, getCourseById } from "../../services/courseService";

const ManageLessons = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", contentType: "video", textContent: "", duration: "", sequence: "" });
  const [videoFile, setVideoFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const [cRes, lRes] = await Promise.all([getCourseById(courseId), getLessons(courseId)]);
      setCourse(cRes.data.data);
      setLessons(lRes.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [courseId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (videoFile) fd.append("video", videoFile);
      await addLesson(courseId, fd);
      setShowForm(false);
      setForm({ title: "", contentType: "video", textContent: "", duration: "", sequence: "" });
      setVideoFile(null);
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add lesson.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (lessonId) => {
    if (!window.confirm("Delete this lesson?")) return;
    await deleteLesson(courseId, lessonId);
    load();
  };

  if (loading) return <DashboardLayout title=""><Spinner /></DashboardLayout>;

  return (
    <DashboardLayout title={`Lessons — ${course?.title}`}>
      <div className="d-flex justify-content-between mb-3">
        <button className="btn btn-sm btn-outline-secondary" onClick={() => navigate(-1)}>← Back</button>
        <button className="btn btn-sm btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "+ Add Lesson"}
        </button>
      </div>

      {showForm && (
        <div className="card mb-4">
          <div className="card-body">
            <h6 className="mb-3" style={{ fontWeight: 700 }}>New Lesson</h6>
            {error && <div className="alert alert-danger py-2">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label" style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Lesson Title *</label>
                  <input className="form-control" placeholder="Lesson title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
                </div>
                <div className="col-md-3">
                  <label className="form-label" style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Type</label>
                  <select className="form-select" value={form.contentType} onChange={(e) => setForm({ ...form, contentType: e.target.value })}>
                    <option value="video">Video</option>
                    <option value="text">Text</option>
                  </select>
                </div>
                <div className="col-md-2">
                  <label className="form-label" style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Sequence</label>
                  <input type="number" className="form-control" placeholder="#" value={form.sequence} onChange={(e) => setForm({ ...form, sequence: e.target.value })} required />
                </div>
                <div className="col-md-1">
                  <label className="form-label" style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Mins</label>
                  <input type="number" className="form-control" placeholder="0" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} />
                </div>
                {form.contentType === "video" ? (
                  <div className="col-12">
                    <label className="form-label" style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Video File</label>
                    <input type="file" className="form-control" accept="video/*" onChange={(e) => setVideoFile(e.target.files[0])} />
                  </div>
                ) : (
                  <div className="col-12">
                    <label className="form-label" style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Text Content</label>
                    <textarea className="form-control" rows={4} value={form.textContent} onChange={(e) => setForm({ ...form, textContent: e.target.value })} />
                  </div>
                )}
              </div>
              <button type="submit" className="btn btn-primary mt-3" disabled={submitting}>
                {submitting ? "Adding..." : "Add Lesson"}
              </button>
            </form>
          </div>
        </div>
      )}

      {lessons.length === 0 ? (
        <EmptyState icon="🎬" message="No lessons yet. Add your first lesson!" />
      ) : (
        <div className="card">
          <div className="card-body p-0">
            <table className="table table-dark mb-0">
              <thead>
                <tr>
                  <th>#</th><th>Title</th><th>Type</th><th>Duration</th><th>Action</th>
                </tr>
              </thead>
              <tbody>
                {lessons.map((l) => (
                  <tr key={l._id}>
                    <td>{l.sequence}</td>
                    <td>{l.title}</td>
                    <td><span className="badge bg-secondary">{l.contentType}</span></td>
                    <td>{l.duration || 0} min</td>
                    <td>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(l._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default ManageLessons;
