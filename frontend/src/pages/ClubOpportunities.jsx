import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Briefcase,
  MapPin,
  Clock,
  PlusCircle,
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  Users
} from "lucide-react";
import "../App.css";

function ClubOpportunities() {
  const navigate = useNavigate();

  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

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

      async function fetchClubOpportunities() {
        try {
          const res = await fetch(`http://127.0.0.1:8000/api/clubs/${user.id}/opportunities`);
          if (res.ok) {
            const data = await res.json();
            setOpportunities(data);
          }
        } catch (err) {
          setMessage("Unable to load listings.");
        } finally {
          setLoading(false);
        }
      }
      fetchClubOpportunities();
    } catch (e) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="page-container">
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px", marginBottom: "28px" }}>
        <div>
          <Link to="/club/dashboard" className="btn-secondary" style={{ padding: "6px 14px", fontSize: "13px", marginBottom: "12px" }}>
            <ArrowLeft size={14} /> Back to Dashboard
          </Link>
          <h1 className="section-title" style={{ textAlign: "left", marginBottom: "4px" }}>
            Manage Club Opportunities
          </h1>
          <p className="section-desc">
            All active internships, hackathons, and events published by your organization.
          </p>
        </div>

        <Link to="/club/create-opportunity" className="btn-primary">
          <PlusCircle size={16} /> Post New Opportunity
        </Link>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "60px 0" }}>
          <p style={{ color: "var(--text-secondary)", fontWeight: "600" }}>
            Loading opportunities...
          </p>
        </div>
      ) : opportunities.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "80px 20px",
            background: "white",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-xl)"
          }}
        >
          <div style={{ fontSize: "40px", marginBottom: "14px" }}>🎯</div>
          <h2 style={{ fontSize: "22px", fontWeight: "700", marginBottom: "8px" }}>
            No Opportunities Posted Yet
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: "14px", marginBottom: "24px" }}>
            Create your first opportunity to invite student applicants from across campus.
          </p>
          <Link to="/club/create-opportunity" className="btn-primary">
            Create Opportunity Now <PlusCircle size={16} />
          </Link>
        </div>
      ) : (
        <div className="opp-grid">
          {opportunities.map((opp) => (
            <div key={opp.id} className="opp-card">
              <div>
                <div className="opp-card-top">
                  <span className={`tag-badge ${opp.type.toLowerCase()}`}>
                    {opp.type}
                  </span>
                  <span className="match-pill" style={{ background: "#e0f2fe", color: "#0369a1" }}>
                    Status: {opp.status || "Active"}
                  </span>
                </div>

                <h3 className="opp-title">{opp.title}</h3>
                <p className="opp-org">{opp.organization}</p>
                <p className="opp-desc">{opp.description}</p>
              </div>

              <div>
                <div className="opp-meta">
                  <div className="meta-row">
                    <MapPin size={14} className="meta-icon" />
                    <span>{opp.location || "Campus / Remote"}</span>
                  </div>
                  <div className="meta-row">
                    <Clock size={14} className="meta-icon" />
                    <span>Deadline: {opp.deadline || "Open"}</span>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  <Link
                    to={`/opportunity/${opp.id}`}
                    className="btn-secondary"
                    style={{ fontSize: "13px" }}
                  >
                    Public View <ExternalLink size={14} />
                  </Link>
                  <Link
                    to="/club/applications"
                    className="btn-primary"
                    style={{ fontSize: "13px" }}
                  >
                    Applicants <Users size={14} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ClubOpportunities;
