import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  GraduationCap,
  Bell,
  User,
  LogOut,
  Briefcase,
  Compass,
  FileCheck,
  PlusCircle,
  LayoutDashboard,
  ShieldAlert,
  Sparkles,
  Menu,
  X
} from "lucide-react";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showNotifs, setShowNotifs] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const notifRef = useRef(null);

  useEffect(() => {
    function loadUser() {
      const saved = localStorage.getItem("user");
      if (saved) {
        try {
          setUser(JSON.parse(saved));
        } catch (e) {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    }

    loadUser();
    window.addEventListener("storage", loadUser);
    return () => window.removeEventListener("storage", loadUser);
  }, [location.pathname]);

  // Fetch in-app notifications if user is logged in
  useEffect(() => {
    if (!user) return;

    async function fetchNotifications() {
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/notifications/${user.id}`);
        if (res.ok) {
          const data = await res.json();
          setNotifications(data);
        }
      } catch (err) {
        // Silently handle offline/local
      }
    }

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 12000);
    return () => clearInterval(interval);
  }, [user]);

  // Close notifications on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifs(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleLogout() {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  }

  async function markNotificationRead(id) {
    try {
      await fetch(`http://127.0.0.1:8000/api/notifications/${id}/read`, {
        method: "PUT"
      });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
    } catch (err) {
      console.error(err);
    }
  }

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const isActive = (path) => location.pathname === path;

  return (
    <header className="navbar-wrapper">
      <div className="navbar-container">
        {/* Brand Logo */}
        <Link to="/" className="brand-logo">
          <div className="logo-icon-box">
            <GraduationCap className="logo-icon" size={24} />
          </div>
          <span className="logo-text">
            Campus<span className="logo-accent">Connect</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="nav-menu">
          <Link
            to="/explore"
            className={`nav-link ${isActive("/explore") ? "active" : ""}`}
          >
            <Compass size={18} />
            Explore
          </Link>

          {/* Student Links */}
          {user && user.role === "student" && (
            <>
              <Link
                to="/applications"
                className={`nav-link ${isActive("/applications") ? "active" : ""}`}
              >
                <FileCheck size={18} />
                My Applications
              </Link>
              <Link
                to="/profile"
                className={`nav-link ${isActive("/profile") ? "active" : ""}`}
              >
                <Sparkles size={18} />
                Skills & Profile
              </Link>
            </>
          )}

          {/* Club Links */}
          {user && user.role === "club" && (
            <>
              <Link
                to="/club/dashboard"
                className={`nav-link ${isActive("/club/dashboard") ? "active" : ""}`}
              >
                <LayoutDashboard size={18} />
                Dashboard
              </Link>
              <Link
                to="/club/opportunities"
                className={`nav-link ${isActive("/club/opportunities") ? "active" : ""}`}
              >
                <Briefcase size={18} />
                Our Posts
              </Link>
              <Link
                to="/club/applications"
                className={`nav-link ${isActive("/club/applications") ? "active" : ""}`}
              >
                <FileCheck size={18} />
                Applications
              </Link>
            </>
          )}

          {/* Admin Links */}
          {user && user.role === "admin" && (
            <Link
              to="/admin"
              className={`nav-link ${isActive("/admin") ? "active" : ""}`}
            >
              <ShieldAlert size={18} />
              Admin Portal
            </Link>
          )}
        </nav>

        {/* Right Action Icons / Auth Controls */}
        <div className="navbar-actions">
          {user ? (
            <div className="user-section">
              {/* Notifications Dropdown */}
              <div className="notif-wrapper" ref={notifRef}>
                <button
                  className="notif-btn"
                  onClick={() => setShowNotifs(!showNotifs)}
                  title="Notifications"
                >
                  <Bell size={20} />
                  {unreadCount > 0 && (
                    <span className="notif-badge">{unreadCount}</span>
                  )}
                </button>

                {showNotifs && (
                  <div className="notif-panel">
                    <div className="notif-header">
                      <h4>Notifications</h4>
                      {unreadCount > 0 && (
                        <span className="unread-tag">{unreadCount} new</span>
                      )}
                    </div>
                    <div className="notif-list">
                      {notifications.length === 0 ? (
                        <p className="notif-empty">No notifications yet.</p>
                      ) : (
                        notifications.map((n) => (
                          <div
                            key={n.id}
                            className={`notif-item ${!n.is_read ? "unread" : ""}`}
                            onClick={() => markNotificationRead(n.id)}
                          >
                            <div className="notif-content">
                              <strong>{n.title}</strong>
                              <p>{n.message}</p>
                              <small>
                                {new Date(n.created_at).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit"
                                })}
                              </small>
                            </div>
                            {!n.is_read && <span className="unread-dot"></span>}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* User Avatar Pill */}
              <div
                className="user-pill"
                onClick={() =>
                  user.role === "club"
                    ? navigate("/club/dashboard")
                    : navigate("/profile")
                }
                title="View Profile"
              >
                <div className="avatar-circle">
                  {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                </div>
                <div className="user-details-mini">
                  <span className="user-name-mini">{user.name}</span>
                  <span className="user-role-mini">{user.role}</span>
                </div>
              </div>

              {/* Logout Button */}
              <button
                className="btn-icon-logout"
                onClick={handleLogout}
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <div className="guest-actions">
              <Link to="/login" className="btn-secondary">
                Log In
              </Link>
              <Link to="/signup" className="btn-primary">
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            className="mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-drawer">
          <Link
            to="/explore"
            onClick={() => setMobileMenuOpen(false)}
            className="mobile-link"
          >
            <Compass size={18} /> Explore
          </Link>
          {user && user.role === "student" && (
            <>
              <Link
                to="/applications"
                onClick={() => setMobileMenuOpen(false)}
                className="mobile-link"
              >
                <FileCheck size={18} /> My Applications
              </Link>
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="mobile-link"
              >
                <User size={18} /> Profile
              </Link>
            </>
          )}
          {user && user.role === "club" && (
            <>
              <Link
                to="/club/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="mobile-link"
              >
                <LayoutDashboard size={18} /> Club Dashboard
              </Link>
              <Link
                to="/club/opportunities"
                onClick={() => setMobileMenuOpen(false)}
                className="mobile-link"
              >
                <Briefcase size={18} /> Manage Opportunities
              </Link>
              <Link
                to="/club/create-opportunity"
                onClick={() => setMobileMenuOpen(false)}
                className="mobile-link"
              >
                <PlusCircle size={18} /> Post Opportunity
              </Link>
            </>
          )}
          {user && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleLogout();
              }}
              className="mobile-logout"
            >
              <LogOut size={18} /> Log Out
            </button>
          )}
        </div>
      )}
    </header>
  );
}

export default Navbar;
