import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Briefcase,
  Building,
  MapPin,
  Calendar,
  Sparkles,
  FileText,
  ArrowLeft,
  PlusCircle
} from "lucide-react";
import "../App.css";

function CreateOpportunity() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [organization, setOrganization] = useState("");
  const [type, setType] = useState("Internship");
  const [location, setLocation] = useState("");
  const [deadline, setDeadline] = useState("");
  const [skillsRequired, setSkillsRequired] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // Pre-fill organization name if available
  useState(() => {
    const saved = localStorage.getItem("user");
    if (saved) {
      try {
        const u = JSON.parse(saved);
        if (u.role === "club") {
          setOrganization(u.name || "");
        }
      } catch (e) {}
    }
  });

  async function handleSubmit(e) {
    e.preventDefault();

    const saved = localStorage.getItem("user");
    if (!saved) {
      navigate("/login");
      return;
    }

    const user = JSON.parse(saved);

    if (!title || !organization || !location || !deadline || !description) {
      setMessage("Please fill in all required fields marked with *.");
      setIsSuccess(false);
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("http://127.0.0.1:8000/api/opportunities", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          organization,
          type,
          location,
          description,
          deadline,
          club_id: user.id,
          skills_required: skillsRequired || "General Skills",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.detail || "Unable to create opportunity.");
        setIsSuccess(false);
        setLoading(false);
        return;
      }

      setIsSuccess(true);
      setMessage("Opportunity created and published successfully!");

      setTimeout(() => {
        navigate("/club/opportunities");
      }, 1000);
    } catch (err) {
      setMessage("Unable to connect to backend server.");
      setIsSuccess(false);
    }

    setLoading(false);
  }

  return (
    <div className="page-container" style={{ maxWidth: "720px" }}>
      <Link
        to="/club/dashboard"
        className="btn-secondary"
        style={{ padding: "6px 14px", fontSize: "13px", marginBottom: "20px" }}
      >
        <ArrowLeft size={14} /> Back to Dashboard
      </Link>

      <div
        style={{
          background: "white",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-xl)",
          padding: "36px",
          boxShadow: "var(--shadow-lg)"
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div className="logo-icon-box" style={{ margin: "0 auto 14px" }}>
            <PlusCircle size={22} />
          </div>
          <h1 style={{ fontSize: "24px", fontWeight: "800", color: "#0f172a" }}>
            Post New Opportunity
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
            Publish an internship, hackathon, workshop or campus event for students.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Opportunity Title *</label>
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: "14px" }}
              placeholder="e.g. AI & Cloud Solutions Intern / Campus Hackathon 2026"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
            <div className="form-group">
              <label>Organization / Club Name *</label>
              <input
                type="text"
                className="form-input"
                style={{ paddingLeft: "14px" }}
                placeholder="e.g. Google Developer Student Club"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Opportunity Type *</label>
              <select
                className="form-input"
                style={{ paddingLeft: "14px" }}
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="Internship">Internship</option>
                <option value="Hackathon">Hackathon</option>
                <option value="Workshop">Workshop</option>
                <option value="Event">Campus Event</option>
              </select>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
            <div className="form-group">
              <label>Location *</label>
              <input
                type="text"
                className="form-input"
                style={{ paddingLeft: "14px" }}
                placeholder="e.g. Bengaluru Campus / Remote"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Deadline or Event Date *</label>
              <input
                type="text"
                className="form-input"
                style={{ paddingLeft: "14px" }}
                placeholder="e.g. 30 November 2026"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Required Skills (comma-separated for Smart Recommendations)</label>
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: "14px" }}
              placeholder="e.g. React, Python, Machine Learning, Git"
              value={skillsRequired}
              onChange={(e) => setSkillsRequired(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Detailed Description & Responsibilities *</label>
            <textarea
              className="form-textarea"
              placeholder="Describe what the student will be doing, perks, stipend, certificate, prerequisites..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
            />
          </div>

          {message && (
            <div className={`alert-box ${isSuccess ? "alert-success" : "alert-error"}`}>
              {message}
            </div>
          )}

          <button
            type="submit"
            className="btn-primary"
            style={{ width: "100%", padding: "14px", fontSize: "15px", marginTop: "10px" }}
            disabled={loading}
          >
            {loading ? "Publishing Opportunity..." : "Publish Opportunity Now"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateOpportunity;
