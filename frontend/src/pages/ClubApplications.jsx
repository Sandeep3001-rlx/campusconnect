import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FileCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Mail,
  Phone,
  FileText,
  User,
  ArrowLeft,
  Filter
} from "lucide-react";
import "../App.css";

function ClubApplications() {
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (!saved) {
      navigate("/login");
      return;
    }

    try {
      const user = JSON.parse(saved);
      if (user.role !== "club" && user.role !== "admin") {
        navigate("/explore");
        return;
      }

      async function fetchClubApplications() {
        try {
          const res = await fetch(`http://127.0.0.1:8000/api/clubs/${user.id}/applications`);
          if (res.ok) {
            const data = await res.json();
            setApplications(data);
          }
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      }
      fetchClubApplications();
    } catch (e) {
      navigate("/login");
    }
  }, [navigate]);

  async function updateStatus(applicationId, newStatus) {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/applications/${applicationId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();

      if (!res.ok) {
        setFeedback(data.detail || "Failed to update application status.");
        return;
      }

      // Optimistically update list state
      setApplications((prev) =>
        prev.map((app) =>
          app.id === applicationId ? { ...app, status: data.status } : app
        )
      );

      setFeedback(`Application #${applicationId} moved to "${newStatus}"! Notification sent to student.`);
      setTimeout(() => setFeedback(""), 4000);
    } catch (err) {
      setFeedback("Network error. Please try again.");
    }
  }

  const filtered = applications.filter((app) => {
    if (filterStatus === "All") return true;
    return app.status === filterStatus;
  });

  return (
    <div className="page-container" style={{ maxWidth: "1000px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px", marginBottom: "24px" }}>
        <div>
          <Link to="/club/dashboard" className="btn-secondary" style={{ padding: "6px 14px", fontSize: "13px", marginBottom: "12px" }}>
            <ArrowLeft size={14} /> Back to Dashboard
          </Link>
          <h1 className="section-title" style={{ textAlign: "left", marginBottom: "4px" }}>
            Candidate Applications
          </h1>
          <p className="section-desc">
            Review student applicants, assess submissions, and update decision statuses.
          </p>
        </div>
      </div>

      {feedback && (
        <div className="alert-box alert-success" style={{ marginBottom: "20px" }}>
          {feedback}
        </div>
      )}

      {/* Filter Tabs */}
      <div className="filter-tabs" style={{ justifyContent: "flex-start", margin: "16px 0 24px" }}>
        {["All", "Applied", "Under Review", "Accepted", "Rejected"].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`filter-btn ${filterStatus === status ? "active" : ""}`}
            style={{ fontSize: "13px", padding: "6px 14px" }}
          >
            {status} ({status === "All" ? applications.length : applications.filter((a) => a.status === status).length})
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "60px 0" }}>
          <p style={{ color: "var(--text-secondary)", fontWeight: "600" }}>
            Loading candidate records...
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "60px 20px",
            background: "white",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-xl)"
          }}
        >
          <div style={{ fontSize: "36px", marginBottom: "12px" }}>📂</div>
          <h3 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "6px" }}>
            No applications found in this category
          </h3>
          <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>
            When students submit applications to your opportunities, they will show up here.
          </p>
        </div>
      ) : (
        <div>
          {filtered.map((app) => (
            <div key={app.id} className="applicant-card">
              <div className="applicant-header">
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                    <h3 style={{ fontSize: "18px", fontWeight: "800", color: "#0f172a" }}>
                      {app.name}
                    </h3>
                    <span className={`status-badge ${app.status.toLowerCase().replace(/\s+/g, "-")}`}>
                      {app.status}
                    </span>
                  </div>
                  <p style={{ fontSize: "14px", fontWeight: "600", color: "var(--primary)" }}>
                    Applied for: {app.opportunity_title}
                  </p>
                </div>

                <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                  Application ID #{app.id}
                </div>
              </div>

              {/* Applicant Metadata */}
              <div className="applicant-details-grid">
                <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px" }}>
                  <Mail size={15} color="var(--primary)" />
                  <a href={`mailto:${app.email}`} style={{ color: "var(--text-primary)", fontWeight: "600" }}>
                    {app.email}
                  </a>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px" }}>
                  <Phone size={15} color="var(--primary)" />
                  <span style={{ fontWeight: "600" }}>{app.phone}</span>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px" }}>
                  <FileText size={15} color="var(--primary)" />
                  <span style={{ fontWeight: "600" }}>Resume: {app.resume_name || "Provided"}</span>
                </div>
              </div>

              {/* Statement of Interest */}
              <div>
                <span style={{ fontSize: "12px", fontWeight: "700", color: "var(--text-muted)", display: "block", marginBottom: "4px" }}>
                  APPLICANT STATEMENT
                </span>
                <div className="applicant-reason-box">
                  "{app.reason}"
                </div>
              </div>

              {/* Action Decision Buttons */}
              <div className="applicant-actions">
                <button
                  type="button"
                  className="btn-success"
                  onClick={() => updateStatus(app.id, "Accepted")}
                  disabled={app.status === "Accepted"}
                  title="Mark student as Accepted"
                >
                  <CheckCircle2 size={16} /> Accept Candidate
                </button>

                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => updateStatus(app.id, "Under Review")}
                  disabled={app.status === "Under Review"}
                  title="Move to Under Review"
                >
                  <Clock size={16} /> Move to Review
                </button>

                <button
                  type="button"
                  className="btn-danger"
                  onClick={() => updateStatus(app.id, "Rejected")}
                  disabled={app.status === "Rejected"}
                  title="Mark student as Rejected"
                >
                  <XCircle size={16} /> Reject Application
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ClubApplications;
