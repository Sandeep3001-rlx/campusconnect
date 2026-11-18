import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Compass,
  Briefcase,
  Trophy,
  BookOpen,
  Calendar,
  Sparkles,
  ArrowRight,
  Search,
  CheckCircle2,
  Users,
  Building2,
  MapPin,
  Clock
} from "lucide-react";

function Home() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [recommended, setRecommended] = useState([]);
  const [stats, setStats] = useState({
    opportunities: 4,
    clubs: 12,
    students: 150
  });

  useEffect(() => {
    async function fetchRecommended() {
      try {
        const savedUser = localStorage.getItem("user");
        let url = "http://127.0.0.1:8000/api/opportunities/recommended";
        if (savedUser) {
          const user = JSON.parse(savedUser);
          url += `?user_id=${user.id}`;
        }
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          setRecommended(data.slice(0, 3));
        }
      } catch (err) {
        // Fallback or offline
      }
    }
    fetchRecommended();
  }, []);

  function handleSearchSubmit(e) {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/explore?search=${encodeURIComponent(search.trim())}`);
    } else {
      navigate("/explore");
    }
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-pill">
          <Sparkles size={16} />
          <span>The #1 Opportunity Hub for College Students</span>
        </div>

        <h1 className="hero-title">
          Your Campus. Your Career. <br />
          <span className="gradient-text">Every Opportunity In One Place.</span>
        </h1>

        <p className="hero-subtitle">
          Discover verified internships, competitive hackathons, hands-on workshops,
          and student club recruitments tailored to your skills and interests.
        </p>

        <form onSubmit={handleSearchSubmit} className="hero-search-wrapper">
          <Search className="search-icon-hero" size={20} />
          <input
            type="text"
            className="hero-search-input"
            placeholder="Search software intern, web hackathon, AI workshop..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit" className="btn-primary">
            Explore Now
          </button>
        </form>
      </section>

      {/* Stats Ribbon */}
      <section className="stats-strip">
        <div className="stat-item">
          <div className="stat-icon">
            <Briefcase size={22} />
          </div>
          <div>
            <div className="stat-num">500+</div>
            <div className="stat-label">Active Opportunities</div>
          </div>
        </div>

        <div className="stat-item">
          <div className="stat-icon">
            <Building2 size={22} />
          </div>
          <div>
            <div className="stat-num">45+</div>
            <div className="stat-label">College Clubs & Partners</div>
          </div>
        </div>

        <div className="stat-item">
          <div className="stat-icon">
            <Users size={22} />
          </div>
          <div>
            <div className="stat-num">2,800+</div>
            <div className="stat-label">Students Connected</div>
          </div>
        </div>

        <div className="stat-item">
          <div className="stat-icon">
            <CheckCircle2 size={22} />
          </div>
          <div>
            <div className="stat-num">98%</div>
            <div className="stat-label">Verified Listings</div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="categories-section">
        <div className="section-title-wrap">
          <h2 className="section-title">Explore by Opportunity Type</h2>
          <p className="section-desc">
            Filter activities based on your current academic & professional goals
          </p>
        </div>

        <div className="category-grid">
          <div
            className="cat-card internship"
            onClick={() => navigate("/explore?type=Internship")}
          >
            <div>
              <div className="cat-icon-wrap">
                <Briefcase size={24} />
              </div>
              <h3>Internships</h3>
              <p>Industrial training, summer internships & remote roles</p>
            </div>
            <span className="nav-link" style={{ padding: 0, marginTop: "16px" }}>
              Browse Internships <ArrowRight size={14} />
            </span>
          </div>

          <div
            className="cat-card hackathon"
            onClick={() => navigate("/explore?type=Hackathon")}
          >
            <div>
              <div className="cat-icon-wrap">
                <Trophy size={24} />
              </div>
              <h3>Hackathons</h3>
              <p>Competitive coding sprints, designathons & prizes</p>
            </div>
            <span className="nav-link" style={{ padding: 0, marginTop: "16px" }}>
              Browse Hackathons <ArrowRight size={14} />
            </span>
          </div>

          <div
            className="cat-card workshop"
            onClick={() => navigate("/explore?type=Workshop")}
          >
            <div>
              <div className="cat-icon-wrap">
                <BookOpen size={24} />
              </div>
              <h3>Workshops</h3>
              <p>Hands-on bootcamps, tech seminars & certifications</p>
            </div>
            <span className="nav-link" style={{ padding: 0, marginTop: "16px" }}>
              Browse Workshops <ArrowRight size={14} />
            </span>
          </div>

          <div
            className="cat-card event"
            onClick={() => navigate("/explore?type=Event")}
          >
            <div>
              <div className="cat-icon-wrap">
                <Calendar size={24} />
              </div>
              <h3>Campus Events</h3>
              <p>Tech fests, guest lectures, orientations & club expos</p>
            </div>
            <span className="nav-link" style={{ padding: 0, marginTop: "16px" }}>
              Browse Events <ArrowRight size={14} />
            </span>
          </div>
        </div>
      </section>

      {/* Featured / Recommended Opportunities */}
      <section className="page-container" style={{ paddingTop: 0 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: "20px"
          }}
        >
          <div>
            <h2 className="section-title" style={{ textAlign: "left", marginBottom: "4px" }}>
              Recommended For You
            </h2>
            <p className="section-desc">
              Curated opportunities matched to your academic profile and interests
            </p>
          </div>
          <Link to="/explore" className="btn-secondary">
            View All Opportunities <ArrowRight size={16} />
          </Link>
        </div>

        <div className="opp-grid">
          {recommended.map((opp) => (
            <div key={opp.id} className="opp-card">
              <div>
                <div className="opp-card-top">
                  <span className={`tag-badge ${opp.type.toLowerCase()}`}>
                    {opp.type}
                  </span>
                  {opp.match_score && (
                    <span className="match-pill">
                      <Sparkles size={12} /> {opp.match_score}% Match
                    </span>
                  )}
                </div>

                <h3 className="opp-title">{opp.title}</h3>
                <p className="opp-org">{opp.organization}</p>
                <p className="opp-desc">{opp.description}</p>
              </div>

              <div>
                <div className="opp-meta">
                  <div className="meta-row">
                    <MapPin size={14} className="meta-icon" />
                    <span>{opp.location || "On Campus / Remote"}</span>
                  </div>
                  <div className="meta-row">
                    <Clock size={14} className="meta-icon" />
                    <span>Deadline: {opp.deadline || "Open until filled"}</span>
                  </div>
                </div>

                <Link
                  to={`/opportunity/${opp.id}`}
                  className="btn-primary"
                  style={{ width: "100%" }}
                >
                  View Details & Apply
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;
