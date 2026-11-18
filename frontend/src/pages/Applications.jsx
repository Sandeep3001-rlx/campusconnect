import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FileCheck,
  Clock,
  Building2,
  Calendar,
  AlertCircle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  Sparkles,
  FileText
} from "lucide-react";
import "../App.css";

function Applications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchMyApplications() {
      const savedUser = localStorage.getItem("user");

      if (!savedUser) {
        setError("Please login to view your submitted applications.");
        setLoading(false);
        return;
      }

      try {
        const user = JSON.parse(savedUser);
        const response = await fetch(`http://127.0.0.1:8000/api/applications/${user.id}`);

        if (!response.ok) {
          throw new Error("Failed to load applications");
        }

        const data = await response.json();
        setApplications(data);
      } catch (err) {
        setError("Unable to load applications. Make sure the backend server is running.");
      } finally {
        setLoading(false);
      }
    }

    fetchMyApplications();
  }, []);

  // Compute status badge style & icon
  function getStatusMeta(status) {
    switch (status) {
      case "Accepted":
        return {
          className: "status-badge accepted",
          icon: <CheckCircle2 size={14} />,
          text: "Accepted"
        };
      case "Rejected":
        return {
          className: "status-badge rejected",
          icon: <XCircle size={14} />,
          text: "Rejected"
        };
      case "Under Review":
        return {
          className: "status-badge under-review",
          icon: <Clock size={14} />,
          text: "Under Review"
        };
      default:
        return {
          className: "status-badge applied",
          icon: <FileCheck size={14} />,
          text: "Applied"
        };
    }
  }

  // Stepper helper
  function getStepStatus(currentStatus, stepIndex) {
    // Steps: 1 = Submitted, 2 = Under Review, 3 = Evaluated, 4 = Decision
    if (currentStatus === "Accepted") {
      return "completed";
    }
    if (currentStatus === "Rejected") {
      return stepIndex === 4 ? "rejected-step" : "completed";
    }
    if (currentStatus === "Under Review") {
      return stepIndex <= 2 ? "completed" : stepIndex === 3 ? "active" : "";
    }
    // Applied
    return stepIndex === 1 ? "completed" : stepIndex === 2 ? "active" : "";
  }

  return (
    <div className="page-container" style={{ maxWidth: "980px" }}>
      <div className="section-title-wrap" style={{ textAlign: "left", marginBottom: "28px" }}>
        <h1 className="section-title" style={{ textAlign: "left" }}>
          My Applications
        </h1>
        <p className="section-desc">
          Track the live status of internships, hackathons, and campus opportunities you applied for.
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "60px 0" }}>
          <p style={{ color: "var(--text-secondary)", fontWeight: "600" }}>
            Loading your application records...
          </p>
        </div>
      ) : error ? (
        <div className="alert-box alert-error" style={{ textAlign: "center", padding: "24px" }}>
          <p>{error}</p>
          <Link to="/login" className="btn-primary" style={{ marginTop: "14px", display: "inline-block" }}>
            Go to Login
          </Link>
        </div>
      ) : applications.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "80px 20px",
            background: "white",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-xl)"
          }}
        >
          <div style={{ fontSize: "40px", marginBottom: "14px" }}>📋</div>
          <h2 style={{ fontSize: "22px", fontWeight: "700", marginBottom: "8px" }}>
            No Applications Yet
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: "14px", marginBottom: "24px" }}>
            Explore verified opportunities across campus and submit your first application.
          </p>
          <Link to="/explore" className="btn-primary">
            Explore Opportunities <ArrowRight size={16} />
          </Link>
        </div>
      ) : (
        <div>
          {applications.map((app) => {
            const meta = getStatusMeta(app.status);

            return (
              <div key={app.id} className="app-tracker-card">
                {/* Top Row: Opportunity info and Live Status Badge */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                      <span className={`tag-badge ${(app.opportunity_type || "internship").toLowerCase()}`}>
                        {app.opportunity_type || "Opportunity"}
                      </span>
                      <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                        Application #{app.id}
                      </span>
                    </div>

                    <h2 style={{ fontSize: "20px", fontWeight: "800", color: "#0f172a", marginBottom: "4px" }}>
                      {app.opportunity_title}
                    </h2>
                    <p style={{ fontSize: "14px", fontWeight: "600", color: "var(--primary)" }}>
                      {app.opportunity_organization}
                    </p>
                  </div>

                  <div className={meta.className}>
                    {meta.icon}
                    <span>{meta.text}</span>
                  </div>
                </div>

                {/* Progress Stepper representing live pipeline */}
                <div className="stepper-container">
                  <div className={`stepper-step ${getStepStatus(app.status, 1)}`}>
                    <div className="step-circle">✓</div>
                    <span className="step-label">Submitted</span>
                  </div>

                  <div className={`stepper-line ${getStepStatus(app.status, 2) === "completed" ? "completed" : ""}`} />

                  <div className={`stepper-step ${getStepStatus(app.status, 2)}`}>
                    <div className="step-circle">2</div>
                    <span className="step-label">Under Review</span>
                  </div>

                  <div className={`stepper-line ${getStepStatus(app.status, 3) === "completed" ? "completed" : ""}`} />

                  <div className={`stepper-step ${getStepStatus(app.status, 3)}`}>
                    <div className="step-circle">3</div>
                    <span className="step-label">Evaluation</span>
                  </div>

                  <div className={`stepper-line ${getStepStatus(app.status, 4) === "completed" ? "completed" : ""}`} />

                  <div className={`stepper-step ${getStepStatus(app.status, 4)}`}>
                    <div className="step-circle">
                      {app.status === "Accepted" ? "✓" : app.status === "Rejected" ? "✕" : "4"}
                    </div>
                    <span className="step-label">
                      {app.status === "Accepted" ? "Accepted 🎉" : app.status === "Rejected" ? "Rejected" : "Decision"}
                    </span>
                  </div>
                </div>

                {/* Organizer Notes if available */}
                {app.notes && (
                  <div
                    style={{
                      background: "var(--bg-subtle)",
                      borderLeft: "3px solid var(--primary)",
                      padding: "10px 14px",
                      borderRadius: "0 var(--radius-sm) var(--radius-sm) 0",
                      fontSize: "13px",
                      color: "var(--text-secondary)",
                      margin: "14px 0"
                    }}
                  >
                    <strong>Organizer Feedback:</strong> "{app.notes}"
                  </div>
                )}

                {/* Meta details & Action */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "12px",
                    paddingTop: "14px",
                    borderTop: "1px solid var(--border)",
                    fontSize: "13px",
                    color: "var(--text-muted)"
                  }}
                >
                  <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                    <span>📄 Resume: {app.resume_name || "Uploaded"}</span>
                    <span>📧 {app.email}</span>
                  </div>

                  <Link
                    to={`/opportunity/${app.opportunity_id}`}
                    className="btn-secondary"
                    style={{ padding: "6px 14px", fontSize: "13px" }}
                  >
                    View Opportunity Details
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Applications;
