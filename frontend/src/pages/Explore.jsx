import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Search,
  Filter,
  MapPin,
  Clock,
  Briefcase,
  Trophy,
  BookOpen,
  Calendar,
  Sparkles,
  ArrowRight,
  RotateCcw
} from "lucide-react";
import "../App.css";

function Explore() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get("type") || "All";
  const initialSearch = searchParams.get("search") || "";

  const [opportunities, setOpportunities] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [search, setSearch] = useState(initialSearch);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchOpportunities() {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/opportunities");
        if (!response.ok) {
          throw new Error("Failed to fetch opportunities");
        }
        const data = await response.json();
        setOpportunities(data);
      } catch (err) {
        setError("Unable to load opportunities. Please make sure the backend is running.");
      } finally {
        setLoading(false);
      }
    }
    fetchOpportunities();
  }, []);

  // Sync category changes with query string
  function handleCategoryClick(cat) {
    setSelectedCategory(cat);
    if (cat === "All") {
      searchParams.delete("type");
    } else {
      searchParams.set("type", cat);
    }
    setSearchParams(searchParams);
  }

  const filteredOpportunities = opportunities.filter((opportunity) => {
    const matchesCategory =
      selectedCategory === "All" ||
      opportunity.type?.toLowerCase() === selectedCategory.toLowerCase();

    const matchesSearch =
      search === "" ||
      opportunity.title?.toLowerCase().includes(search.toLowerCase()) ||
      opportunity.organization?.toLowerCase().includes(search.toLowerCase()) ||
      opportunity.description?.toLowerCase().includes(search.toLowerCase()) ||
      (opportunity.skills_required &&
        opportunity.skills_required.toLowerCase().includes(search.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="page-container">
      {/* Header */}
      <div className="section-title-wrap">
        <h1 className="section-title">Explore Campus Opportunities</h1>
        <p className="section-desc">
          Browse through verified internships, hackathons, workshops, and upcoming club events.
        </p>

        {/* Search Bar */}
        <div style={{ maxWidth: "600px", margin: "24px auto 0" }}>
          <div className="hero-search-wrapper" style={{ boxShadow: "var(--shadow-sm)" }}>
            <Search className="search-icon-hero" size={20} />
            <input
              type="text"
              className="hero-search-input"
              placeholder="Search by role, company, skills (e.g. Python, React)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                style={{ background: "transparent", color: "var(--text-muted)", fontSize: "13px" }}
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="filter-tabs">
        {["All", "Internship", "Hackathon", "Workshop", "Event"].map((category) => (
          <button
            key={category}
            onClick={() => handleCategoryClick(category)}
            className={`filter-btn ${
              selectedCategory.toLowerCase() === category.toLowerCase() ? "active" : ""
            }`}
          >
            {category === "All" ? "🌟 All Opportunities" : `${category}s`}
          </button>
        ))}
      </div>

      {/* Loading & Error States */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "60px 0" }}>
          <div className="avatar-circle" style={{ margin: "0 auto 16px", animation: "spin 1s linear infinite" }}>
            ⏳
          </div>
          <p style={{ color: "var(--text-secondary)", fontWeight: "600" }}>
            Loading verified opportunities from PostgreSQL...
          </p>
        </div>
      ) : error ? (
        <div className="alert-box alert-error" style={{ maxWidth: "600px", margin: "0 auto", textAlign: "center" }}>
          {error}
        </div>
      ) : (
        <>
          {/* Result Count Banner */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <span style={{ fontSize: "14px", fontWeight: "700", color: "var(--text-secondary)" }}>
              Showing {filteredOpportunities.length} {filteredOpportunities.length === 1 ? "opportunity" : "opportunities"}
            </span>
            {(selectedCategory !== "All" || search) && (
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory("All");
                  setSearch("");
                  setSearchParams({});
                }}
                className="btn-secondary"
                style={{ padding: "6px 12px", fontSize: "12px" }}
              >
                <RotateCcw size={12} /> Reset Filters
              </button>
            )}
          </div>

          {/* Cards Grid */}
          {filteredOpportunities.length > 0 ? (
            <div className="opp-grid">
              {filteredOpportunities.map((opportunity) => (
                <div className="opp-card" key={opportunity.id}>
                  <div>
                    <div className="opp-card-top">
                      <span className={`tag-badge ${opportunity.type.toLowerCase()}`}>
                        {opportunity.type}
                      </span>
                      <span style={{ fontSize: "12px", fontWeight: "600", color: "var(--text-muted)" }}>
                        #{opportunity.id}
                      </span>
                    </div>

                    <h2 className="opp-title">{opportunity.title}</h2>
                    <p className="opp-org">{opportunity.organization}</p>
                    <p className="opp-desc">{opportunity.description}</p>

                    {opportunity.skills_required && (
                      <div className="opp-skills-tag">
                        {opportunity.skills_required.split(",").map((s, idx) => (
                          <span key={idx} className="skill-chip">
                            {s.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="opp-meta">
                      <div className="meta-row">
                        <MapPin size={14} className="meta-icon" />
                        <span>{opportunity.location || "Bengaluru · Campus"}</span>
                      </div>
                      <div className="meta-row">
                        <Clock size={14} className="meta-icon" />
                        <span>Deadline: {opportunity.deadline || "Open"}</span>
                      </div>
                    </div>

                    <Link
                      to={`/opportunity/${opportunity.id}`}
                      className="btn-primary"
                      style={{ width: "100%" }}
                    >
                      View Details & Apply <ArrowRight size={15} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              style={{
                textAlign: "center",
                padding: "80px 20px",
                background: "white",
                borderRadius: "var(--radius-lg)",
                border: "1px solid var(--border)",
                marginTop: "20px"
              }}
            >
              <div style={{ fontSize: "40px", marginBottom: "12px" }}>🔍</div>
              <h3 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "6px" }}>
                No opportunities match your search
              </h3>
              <p style={{ color: "var(--text-muted)", fontSize: "14px", marginBottom: "20px" }}>
                Try adjusting your search keywords or switching category filters.
              </p>
              <button
                type="button"
                className="btn-primary"
                onClick={() => {
                  setSelectedCategory("All");
                  setSearch("");
                  setSearchParams({});
                }}
              >
                Clear All Filters
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Explore;
