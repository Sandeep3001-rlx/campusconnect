import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  FileCheck,
  User,
  Mail,
  Phone,
  FileText,
  Upload,
  AlertCircle,
  ArrowLeft,
  CheckCircle2
} from "lucide-react";
import "../App.css";

function ApplicationForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [opportunity, setOpportunity] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [resumeName, setResumeName] = useState("");
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // 1. Check logged in user
    const saved = localStorage.getItem("user");
    if (saved) {
      try {
        const u = JSON.parse(saved);
        setName(u.name || "");
        setEmail(u.email || "");
      } catch (e) {}
    }

    // 2. Fetch Opportunity details
    async function fetchOpportunity() {
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/opportunities/${id}`);
        if (res.ok) {
          const data = await res.json();
          setOpportunity(data);
        }
      } catch (err) {}
    }
    fetchOpportunity();
  }, [id]);

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (file) {
      setResumeName(file.name);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const savedUser = localStorage.getItem("user");
    if (!savedUser) {
      setMessage("Please login to submit your application.");
      setIsSuccess(false);
      return;
    }

    const user = JSON.parse(savedUser);

    if (!name || !email || !phone || !reason) {
      setMessage("Please fill out all required fields marked with *.");
      setIsSuccess(false);
      return;
    }

    if (!email.includes("@")) {
      setMessage("Please enter a valid email address.");
      setIsSuccess(false);
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("http://127.0.0.1:8000/api/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user.id,
          opportunity_id: Number(id),
          name,
          email,
          phone,
          resume_name: resumeName || `${name.replace(/\s+/g, "_")}_Resume.pdf`,
          reason,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.detail || "Application submission failed.");
        setIsSuccess(false);
        setLoading(false);
        return;
      }

      setIsSuccess(true);
      setMessage("Application submitted successfully! Redirecting to tracker...");

      setTimeout(() => {
        navigate("/applications");
      }, 1200);
    } catch (err) {
      setMessage("Unable to submit application. Ensure the backend server is reachable.");
      setIsSuccess(false);
    }

    setLoading(false);
  }

  return (
    <div className="page-container" style={{ maxWidth: "680px" }}>
      <Link
        to={`/opportunity/${id}`}
        className="btn-secondary"
        style={{ padding: "6px 14px", fontSize: "13px", marginBottom: "20px" }}
      >
        <ArrowLeft size={14} /> Back to Opportunity
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
            <FileCheck size={22} />
          </div>
          <h1 style={{ fontSize: "24px", fontWeight: "800", color: "#0f172a" }}>
            Submit Application
          </h1>
          {opportunity && (
            <p style={{ color: "var(--primary)", fontWeight: "700", marginTop: "4px" }}>
              {opportunity.title} · {opportunity.organization}
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name *</label>
            <div className="input-with-icon">
              <User className="input-icon" size={18} />
              <input
                type="text"
                className="form-input"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
            <div className="form-group">
              <label>Email Address *</label>
              <div className="input-with-icon">
                <Mail className="input-icon" size={18} />
                <input
                  type="email"
                  className="form-input"
                  placeholder="name@college.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Phone / WhatsApp *</label>
              <div className="input-with-icon">
                <Phone className="input-icon" size={18} />
                <input
                  type="tel"
                  className="form-input"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>Upload Resume (PDF / DOC) *</label>
            <div
              style={{
                border: "2px dashed var(--border)",
                borderRadius: "var(--radius-md)",
                padding: "20px",
                textAlign: "center",
                background: "var(--bg-subtle)",
                cursor: "pointer"
              }}
              onClick={() => document.getElementById("resume-input").click()}
            >
              <Upload size={24} style={{ color: "var(--primary)", margin: "0 auto 8px" }} />
              <p style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-primary)" }}>
                {resumeName ? `Selected: ${resumeName}` : "Click to select or drop resume here"}
              </p>
              <small style={{ color: "var(--text-muted)" }}>Supports PDF, DOC, DOCX up to 10MB</small>
              <input
                id="resume-input"
                type="file"
                style={{ display: "none" }}
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Statement of Interest / Why are you a great fit? *</label>
            <textarea
              className="form-textarea"
              placeholder="Highlight relevant projects, coursework, or why this opportunity excites you..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
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
            {loading ? "Submitting Application..." : "Submit Application"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ApplicationForm;
