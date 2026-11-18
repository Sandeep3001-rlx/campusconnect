import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  MapPin,
  Clock,
  Briefcase,
  Building2,
  CheckCircle,
  ArrowLeft,
  Calendar,
  Sparkles,
  Share2,
  FileCheck
} from "lucide-react";
import "../App.css";

function OpportunityDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [opportunity, setOpportunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function fetchOpportunity() {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/opportunities/${id}`);
        if (!response.ok) {
          throw new Error("Opportunity not found");
        }
        const data = await response.json();
        setOpportunity(data);
      } catch (err) {
        setError("Opportunity details could not be found.");
      } finally {
        setLoading(false);
      }
    }
    fetchOpportunity();
  }, [id]);

  function handleShare() {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  if (loading) {
    return (
      <div className="page-container" style={{ textAlign: "center", padding: "80px 0" }}>
        <p style={{ color: "var(--text-secondary)", fontWeight: "600" }}>
          Loading opportunity specifications...
        </p>
      </div>
    );
  }

  if (error || !opportunity) {
    return (
      <div className="page-container" style={{ textAlign: "center", padding: "60px 0" }}>
        <div className="alert-box alert-error" style={{ maxWidth: "500px", margin: "0 auto 20px" }}>
          {error || "Opportunity not found."}
        </div>
        <Link to="/explore" className="btn-primary">
          <ArrowLeft size={16} /> Back to Explore
        </Link>
      </div>
    );
  }

  return (
    <div className="page-container" style={{ maxWidth: "960px" }}>
      {/* Top Breadcrumb & Share */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <Link to="/explore" className="btn-secondary" style={{ padding: "6px 14px", fontSize: "13px" }}>
          <ArrowLeft size={14} /> Back to All Opportunities
        </Link>
        <button
          type="button"
          onClick={handleShare}
          className="btn-secondary"
          style={{ padding: "6px 14px", fontSize: "13px" }}
        >
          <Share2 size={14} /> {copied ? "Copied Link! ✓" : "Share"}
        </button>
      </div>

      {/* Main Details Card */}
      <div
        style={{
          background: "white",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-xl)",
          padding: "40px",
          boxShadow: "var(--shadow-sm)"
        }}
      >
        {/* Header Ribbon */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px", marginBottom: "24px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
              <span className={`tag-badge ${opportunity.type.toLowerCase()}`}>
                {opportunity.type}
              </span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "12px", fontWeight: "700", color: "#16a34a" }}>
                <CheckCircle size={14} /> Verified Campus Listing
              </span>
            </div>
            <h1 style={{ fontSize: "32px", fontWeight: "800", color: "#0f172a", lineHeight: "1.25", marginBottom: "8px" }}>
              {opportunity.title}
            </h1>
            <p style={{ fontSize: "18px", fontWeight: "600", color: "var(--primary)" }}>
              {opportunity.organization}
            </p>
          </div>

          <button
            type="button"
            className="btn-primary"
            style={{ padding: "14px 28px", fontSize: "16px" }}
            onClick={() => navigate(`/apply/${opportunity.id}`)}
          >
            Apply Now <FileCheck size={18} />
          </button>
        </div>

        {/* Quick Spec Highlights */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "16px",
            padding: "20px",
            background: "var(--bg-subtle)",
            borderRadius: "var(--radius-md)",
            marginBottom: "32px"
          }}
        >
          <div>
            <span style={{ fontSize: "12px", fontWeight: "700", color: "var(--text-muted)", display: "block" }}>
              LOCATION
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: "600", marginTop: "4px" }}>
              <MapPin size={16} color="var(--primary)" />
              {opportunity.location || "Campus / Hybrid"}
            </div>
          </div>

          <div>
            <span style={{ fontSize: "12px", fontWeight: "700", color: "var(--text-muted)", display: "block" }}>
              DEADLINE / DATE
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: "600", marginTop: "4px" }}>
              <Calendar size={16} color="var(--primary)" />
              {opportunity.deadline || "Rolling Admissions"}
            </div>
          </div>

          <div>
            <span style={{ fontSize: "12px", fontWeight: "700", color: "var(--text-muted)", display: "block" }}>
              CATEGORY
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: "600", marginTop: "4px" }}>
              <Briefcase size={16} color="var(--primary)" />
              {opportunity.type}
            </div>
          </div>
        </div>

        {/* Key Skills & Requirements */}
        {opportunity.skills_required && (
          <div style={{ marginBottom: "28px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "10px" }}>
              Required / Recommended Skills:
            </h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {opportunity.skills_required.split(",").map((skill, i) => (
                <span
                  key={i}
                  style={{
                    background: "var(--primary-light)",
                    color: "var(--primary)",
                    padding: "6px 14px",
                    borderRadius: "20px",
                    fontSize: "13px",
                    fontWeight: "700"
                  }}
                >
                  {skill.trim()}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Full Opportunity Description */}
        <div style={{ marginBottom: "36px" }}>
          <h2 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "14px", color: "#0f172a" }}>
            About This Opportunity
          </h2>
          <div
            style={{
              fontSize: "15px",
              color: "var(--text-secondary)",
              lineHeight: "1.7",
              whiteSpace: "pre-line"
            }}
          >
            {opportunity.description}
          </div>
        </div>

        {/* Bottom Call to Action Card */}
        <div
          style={{
            borderTop: "1px solid var(--border)",
            paddingTop: "28px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "16px"
          }}
        >
          <div>
            <h4 style={{ fontSize: "16px", fontWeight: "700", color: "#0f172a" }}>
              Ready to submit your application?
            </h4>
            <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>
              Takes under 2 minutes. Your submission will directly reach the club organizers.
            </p>
          </div>

          <button
            type="button"
            className="btn-primary"
            style={{ padding: "12px 24px", fontSize: "15px" }}
            onClick={() => navigate(`/apply/${opportunity.id}`)}
          >
            Start Application <FileCheck size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default OpportunityDetails;
