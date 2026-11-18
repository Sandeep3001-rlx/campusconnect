import { GraduationCap, Code, Globe, Mail } from "lucide-react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer-wrapper">
      <div className="footer-container">
        <div className="footer-brand">
          <div className="footer-logo">
            <GraduationCap className="footer-icon" size={24} />
            <span>CampusConnect</span>
          </div>
          <p className="footer-desc">
            Smart student opportunity & event management platform. Connecting students with verified internships, hackathons, and clubs.
          </p>
          <div className="footer-badge">
            Built with React, FastAPI & PostgreSQL
          </div>
        </div>

        <div className="footer-links-group">
          <h4>Navigation</h4>
          <Link to="/explore">Explore Opportunities</Link>
          <Link to="/applications">My Applications</Link>
          <Link to="/profile">Profile & Skills</Link>
          <Link to="/club/dashboard">Club Portal</Link>
        </div>

        <div className="footer-links-group">
          <h4>Opportunities</h4>
          <Link to="/explore?type=Internship">Internships</Link>
          <Link to="/explore?type=Hackathon">Hackathons</Link>
          <Link to="/explore?type=Workshop">Workshops</Link>
          <Link to="/explore?type=Event">Campus Events</Link>
        </div>

        <div className="footer-links-group">
          <h4>Platform</h4>
          <div className="social-links">
            <a href="https://github.com" target="_blank" rel="noreferrer" title="GitHub">
              <Code size={18} /> GitHub Repository
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" title="Community">
              <Globe size={18} /> Student Community
            </a>
            <a href="mailto:support@campusconnect.local" title="Support">
              <Mail size={18} /> Campus Support
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 CampusConnect. Designed & Developed for Smart Campus Success.</p>
      </div>
    </footer>
  );
}

export default Footer;
