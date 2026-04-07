import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../../components/templates/DashboardLayout";
import { createCourse, updateCourse, getCourseById } from "../../services/courseService";

const CourseForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({ title: "", description: "", category: "" });
  const [thumbnail, setThumbnail] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isEdit) {
      getCourseById(id).then(({ data }) => {
        const c = data.data;
        setForm({ title: c.title, description: c.description, category: c.category || "" });
        if (c.thumbnail) setPreview(`http://localhost:5000${c.thumbnail}`);
      });
    }
  }, [id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleFile = (e) => {
    const file = e.target.files[0];
    setThumbnail(file);
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("description", form.description);
      fd.append("category", form.category);
      if (thumbnail) fd.append("thumbnail", thumbnail);

      if (isEdit) {
        await updateCourse(id, fd);
      } else {
        await createCourse(fd);
      }
      navigate("/instructor/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save course.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout title={isEdit ? "Edit Course" : "Create New Course"}>
      <div className="row justify-content-center">
        <div className="col-lg-7">
          <div className="card">
            <div className="card-body p-4">
              {error && <div className="alert alert-danger py-2">{error}</div>}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label" style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Course Title *</label>
                  <input name="title" className="form-control" placeholder="e.g. Complete Web Development Bootcamp" value={form.title} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                  <label className="form-label" style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Category</label>
                  <input name="category" className="form-control" placeholder="e.g. Web Development, Data Science" value={form.category} onChange={handleChange} />
                </div>
                <div className="mb-3">
                  <label className="form-label" style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Description *</label>
                  <textarea name="description" className="form-control" rows={4} placeholder="Describe what students will learn..." value={form.description} onChange={handleChange} required />
                </div>
                <div className="mb-4">
                  <label className="form-label" style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Course Thumbnail</label>
                  {preview && (
                    <img src={preview} alt="preview" style={{ width: "100%", height: 160, objectFit: "cover", borderRadius: 8, marginBottom: "0.75rem" }} />
                  )}
                  <input id="thumbnail-upload" type="file" className="form-control" accept="image/*" onChange={handleFile} />
                </div>
                <div className="d-flex gap-2">
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? "Saving..." : isEdit ? "Update Course" : "Create Course"}
                  </button>
                  <button type="button" className="btn btn-outline-secondary" onClick={() => navigate(-1)}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CourseForm;
