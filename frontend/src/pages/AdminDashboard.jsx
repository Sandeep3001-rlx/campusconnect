import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShieldAlert,
  Users,
  Briefcase,
  CheckCircle2,
  XCircle,
  FileCheck,
  Building2,
  Clock,
  ArrowLeft
} from "lucide-react";
import "../App.css";

function AdminDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [activeTab, setActiveTab] = useState("opportunities");
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (!saved) {
      navigate("/login");
      return;
    }

    try {
      const u = JSON.parse(saved);
      if (u.role !== "admin" && u.role !== "club") {
        navigate("/explore");
        return;
      }

      async function fetchAdminData() {
        try {
          const [statsRes, usersRes, oppsRes] = await Promise.all([
            fetch("http://127.0.0.1:8000/api/admin/stats"),
            fetch("http://127.0.0.1:8000/api/admin/users"),
            fetch("http://127.0.0.1:8000/api/opportunities?status_filter=All")
          ]);

          if (statsRes.ok) setStats(await statsRes.json());
          if (usersRes.ok) setUsers(await usersRes.json());
          if (oppsRes.ok) setOpportunities(await oppsRes.json());
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      }
      fetchAdminData();
    } catch (e) {
      navigate("/login");
    }
  }, [navigate]);

  async function updateOppStatus(id, newStatus) {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/admin/opportunities/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        setOpportunities((prev) =>
          prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
        );
        setFeedback(`Opportunity #${id} marked as "${newStatus}".`);
        setTimeout(() => setFeedback(""), 3500);
      }
    } catch (err) {
      setFeedback("Failed to update status.");
    }
  }

  return (
    <div className="page-container">
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px", marginBottom: "28px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--primary)", fontWeight: "700", fontSize: "14px", marginBottom: "4px" }}>
            <ShieldAlert size={16} /> Campus Administrator Portal
          </div>
          <h1 className="section-title" style={{ textAlign: "left", marginBottom: "4px" }}>
            Platform Administration
          </h1>
          <p className="section-desc">
            Monitor registered student & club accounts, moderate submitted opportunities, and inspect activity.
          </p>
        </div>
      </div>

      {feedback && (
        <div className="alert-box alert-success" style={{ marginBottom: "20px" }}>
          {feedback}
        </div>
      )}

      {/* KPI Stats Strip */}
      {stats && (
        <div className="kpi-grid">
          <div className="kpi-card">
            <div className="kpi-icon-wrap primary">
              <Users size={24} />
            </div>
            <div className="kpi-info">
              <h2>{stats.total_users}</h2>
              <p>Total Registered Users</p>
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-icon-wrap success">
              <Building2 size={24} />
            </div>
            <div className="kpi-info">
              <h2>{stats.clubs_count}</h2>
              <p>Active College Clubs</p>
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-icon-wrap warning">
              <Briefcase size={24} />
            </div>
            <div className="kpi-info">
              <h2>{stats.opportunities_count}</h2>
              <p>Total Opportunities</p>
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-icon-wrap primary">
              <FileCheck size={24} />
            </div>
            <div className="kpi-info">
              <h2>{stats.applications_count}</h2>
              <p>Applications Processed</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab Switcher */}
      <div className="filter-tabs" style={{ justifyContent: "flex-start", marginBottom: "24px" }}>
        <button
          type="button"
          className={`filter-btn ${activeTab === "opportunities" ? "active" : ""}`}
          onClick={() => setActiveTab("opportunities")}
        >
          Moderate Opportunities ({opportunities.length})
        </button>
        <button
          type="button"
          className={`filter-btn ${activeTab === "users" ? "active" : ""}`}
          onClick={() => setActiveTab("users")}
        >
          Manage Users ({users.length})
        </button>
      </div>

      {/* Table / List Content */}
      {activeTab === "opportunities" ? (
        <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: "var(--radius-xl)", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "14px" }}>
            <thead style={{ background: "var(--bg-subtle)", borderBottom: "1px solid var(--border)" }}>
              <tr>
                <th style={{ padding: "14px 18px", fontWeight: "700" }}>ID</th>
                <th style={{ padding: "14px 18px", fontWeight: "700" }}>Title & Organizer</th>
                <th style={{ padding: "14px 18px", fontWeight: "700" }}>Type</th>
                <th style={{ padding: "14px 18px", fontWeight: "700" }}>Status</th>
                <th style={{ padding: "14px 18px", fontWeight: "700", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {opportunities.map((opp) => (
                <tr key={opp.id} style={{ borderBottom: "1px solid var(--border)" }}>
                  <td style={{ padding: "14px 18px", color: "var(--text-muted)" }}>#{opp.id}</td>
                  <td style={{ padding: "14px 18px" }}>
                    <strong>{opp.title}</strong>
                    <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>{opp.organization}</div>
                  </td>
                  <td style={{ padding: "14px 18px" }}>
                    <span className={`tag-badge ${opp.type.toLowerCase()}`}>
                      {opp.type}
                    </span>
                  </td>
                  <td style={{ padding: "14px 18px" }}>
                    <span className={`status-badge ${opp.status?.toLowerCase() === "approved" ? "accepted" : opp.status?.toLowerCase() === "rejected" ? "rejected" : "under-review"}`}>
                      {opp.status || "Approved"}
                    </span>
                  </td>
                  <td style={{ padding: "14px 18px", textAlign: "right" }}>
                    <div style={{ display: "inline-flex", gap: "8px" }}>
                      <button
                        type="button"
                        className="btn-success"
                        style={{ padding: "4px 10px", fontSize: "12px" }}
                        onClick={() => updateOppStatus(opp.id, "Approved")}
                      >
                        Approve
                      </button>
                      <button
                        type="button"
                        className="btn-danger"
                        style={{ padding: "4px 10px", fontSize: "12px" }}
                        onClick={() => updateOppStatus(opp.id, "Rejected")}
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: "var(--radius-xl)", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "14px" }}>
            <thead style={{ background: "var(--bg-subtle)", borderBottom: "1px solid var(--border)" }}>
              <tr>
                <th style={{ padding: "14px 18px", fontWeight: "700" }}>User ID</th>
                <th style={{ padding: "14px 18px", fontWeight: "700" }}>Name</th>
                <th style={{ padding: "14px 18px", fontWeight: "700" }}>Email</th>
                <th style={{ padding: "14px 18px", fontWeight: "700" }}>Role</th>
                <th style={{ padding: "14px 18px", fontWeight: "700" }}>Department / College</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} style={{ borderBottom: "1px solid var(--border)" }}>
                  <td style={{ padding: "14px 18px", color: "var(--text-muted)" }}>#{u.id}</td>
                  <td style={{ padding: "14px 18px", fontWeight: "700" }}>{u.name}</td>
                  <td style={{ padding: "14px 18px", color: "var(--text-secondary)" }}>{u.email}</td>
                  <td style={{ padding: "14px 18px" }}>
                    <span className="tag-badge" style={{ background: u.role === "club" ? "#fef3c7" : "#e0e7ff", color: u.role === "club" ? "#b45309" : "#4338ca" }}>
                      {u.role}
                    </span>
                  </td>
                  <td style={{ padding: "14px 18px", color: "var(--text-muted)", fontSize: "13px" }}>
                    {u.department || u.college || "General"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
