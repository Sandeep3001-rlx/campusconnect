import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Briefcase,
  Users,
  CheckCircle2,
  Clock,
  PlusCircle,
  ArrowRight,
  TrendingUp,
  FileCheck,
  Building2
} from "lucide-react";
import "../App.css";

function ClubDashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    opportunities_posted: 0,
    total_applications: 0,
    active_opportunities: 0,
    accepted_applications: 0,
    rejected_applications: 0,
    pending_applications: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (!saved) {
      navigate("/login");
      return;
    }

    try {
      const u = JSON.parse(saved);
      if (u.role !== "club" && u.role !== "admin") {
        navigate("/explore");
        return;
      }
      setUser(u);

      async function fetchStats() {
        try {
          const res = await fetch(`http://127.0.0.1:8000/api/clubs/${u.id}/stats`);
          if (res.ok) {
            const data = await res.json();
            setStats(data);
          }
        } catch (e) {
          console.error(e);
        } finally {
          setLoading(false);
        }
      }
      fetchStats();
    } catch (e) {
      navigate("/login");
    }
  }, [navigate]);

  if (!user) return null;

  return (
    <div className="page-container">
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px", marginBottom: "32px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--primary)", fontWeight: "700", fontSize: "14px", marginBottom: "4px" }}>
            <Building2 size={16} /> Club Management Portal
          </div>
          <h1 className="section-title" style={{ textAlign: "left", marginBottom: "4px" }}>
            {user.name} Dashboard
          </h1>
          <p className="section-desc">
            Monitor opportunity performance, track student applications, and approve candidates.
          </p>
        </div>

        <Link to="/club/create-opportunity" className="btn-primary" style={{ padding: "12px 20px" }}>
          <PlusCircle size={16} /> Post New Opportunity
        </Link>
      </div>

      {/* KPI Metrics Strip */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-icon-wrap primary">
            <Briefcase size={26} />
          </div>
          <div className="kpi-info">
            <h2>{loading ? "..." : stats.opportunities_posted}</h2>
            <p>Opportunities Posted</p>
          </div>
        </div>

        <div className="kpi-card" onClick={() => navigate("/club/applications")} style={{ cursor: "pointer" }}>
          <div className="kpi-icon-wrap warning">
            <Users size={26} />
          </div>
          <div className="kpi-info">
            <h2>{loading ? "..." : stats.total_applications}</h2>
            <p>Total Applications Received</p>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-wrap success">
            <CheckCircle2 size={26} />
          </div>
          <div className="kpi-info">
            <h2>{loading ? "..." : stats.accepted_applications || 0}</h2>
            <p>Accepted Candidates</p>
          </div>
        </div>

        <div className="kpi-card" onClick={() => navigate("/club/applications")} style={{ cursor: "pointer" }}>
          <div className="kpi-icon-wrap primary">
            <Clock size={26} />
          </div>
          <div className="kpi-info">
            <h2>{loading ? "..." : stats.pending_applications || stats.total_applications}</h2>
            <p>Pending Review</p>
          </div>
        </div>
      </div>

      {/* Action Gateway Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px" }}>
        <div
          style={{
            background: "white",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-xl)",
            padding: "30px",
            boxShadow: "var(--shadow-sm)"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
            <div className="avatar-circle" style={{ background: "var(--primary-light)", color: "var(--primary)" }}>
              <PlusCircle size={18} />
            </div>
            <h3 style={{ fontSize: "18px", fontWeight: "700" }}>Post Opportunity</h3>
          </div>
          <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: "1.5", marginBottom: "20px" }}>
            Publish an internship, hackathon, workshop, or campus event visible to all verified students.
          </p>
          <Link to="/club/create-opportunity" className="btn-primary" style={{ width: "100%" }}>
            Create New Listing <ArrowRight size={15} />
          </Link>
        </div>

        <div
          style={{
            background: "white",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-xl)",
            padding: "30px",
            boxShadow: "var(--shadow-sm)"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
            <div className="avatar-circle" style={{ background: "#fef3c7", color: "#b45309" }}>
              <FileCheck size={18} />
            </div>
            <h3 style={{ fontSize: "18px", fontWeight: "700" }}>Review Applications</h3>
          </div>
          <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: "1.5", marginBottom: "20px" }}>
            Screen student profiles, download/view submitted resumes, and update decision statuses.
          </p>
          <Link to="/club/applications" className="btn-secondary" style={{ width: "100%" }}>
            Manage Candidate Applications <ArrowRight size={15} />
          </Link>
        </div>

        <div
          style={{
            background: "white",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-xl)",
            padding: "30px",
            boxShadow: "var(--shadow-sm)"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
            <div className="avatar-circle" style={{ background: "#dcfce7", color: "#15803d" }}>
              <Briefcase size={18} />
            </div>
            <h3 style={{ fontSize: "18px", fontWeight: "700" }}>Our Opportunities</h3>
          </div>
          <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: "1.5", marginBottom: "20px" }}>
            View and manage active opportunities posted by your club, deadlines, and applicant counts.
          </p>
          <Link to="/club/opportunities" className="btn-secondary" style={{ width: "100%" }}>
            View Active Listings <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ClubDashboard;
