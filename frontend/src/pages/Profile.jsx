import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  GraduationCap,
  Building,
  Sparkles,
  BookOpen,
  X,
  CheckCircle2,
  Save,
  LogOut,
  Compass
} from "lucide-react";
import "../App.css";

function Profile() {
  const navigate = useNavigate();

  const [userId, setUserId] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("student");
  const [college, setCollege] = useState("");
  const [department, setDepartment] = useState("");
  const [yearOfStudy, setYearOfStudy] = useState("3rd Year");
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState("");
  const [interests, setInterests] = useState("");
  const [bio, setBio] = useState("");

  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (!saved) {
      navigate("/login");
      return;
    }

    try {
      const u = JSON.parse(saved);
      setUserId(u.id);
      setName(u.name || "");
      setEmail(u.email || "");
      setRole(u.role || "student");
      setCollege(u.college || "University Campus");
      setDepartment(u.department || "Computer Science");
      setYearOfStudy(u.year_of_study || "3rd Year");
      setInterests(u.interests || "Internships, Hackathons, AI");
      setBio(u.bio || "Passionate about full-stack engineering and software innovation.");

      if (u.skills) {
        setSkills(u.skills.split(",").map((s) => s.trim()).filter(Boolean));
      } else {
        setSkills(["JavaScript", "React", "Python", "SQL"]);
      }
    } catch (e) {
      navigate("/login");
    }
  }, [navigate]);

  function handleAddSkill(e) {
    e.preventDefault();
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  }

  function handleRemoveSkill(skillToRemove) {
    setSkills(skills.filter((s) => s !== skillToRemove));
  }

  async function handleSave(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const skillsString = skills.join(", ");
      const response = await fetch(`http://127.0.0.1:8000/api/profile?user_id=${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          college,
          department,
          year_of_study: yearOfStudy,
          skills: skillsString,
          interests,
          bio,
        }),
      });

      const updatedUser = await response.json();

      if (!response.ok) {
        setMessage(updatedUser.detail || "Failed to update profile.");
        setIsSuccess(false);
        setLoading(false);
        return;
      }

      // Update local storage
      localStorage.setItem("user", JSON.stringify(updatedUser));

      setIsSuccess(true);
      setMessage("Profile & skills updated successfully in PostgreSQL!");
      setTimeout(() => setMessage(""), 3500);
    } catch (err) {
      setMessage("Error updating profile. Check backend connection.");
      setIsSuccess(false);
    }

    setLoading(false);
  }

  function handleLogout() {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  }

  return (
    <div className="page-container">
      <div className="profile-grid">
        {/* Left Sidebar */}
        <div className="profile-sidebar">
          <div className="profile-avatar-large">
            {name ? name.charAt(0).toUpperCase() : "U"}
          </div>
          <h2 style={{ fontSize: "20px", fontWeight: "800", color: "#0f172a", marginBottom: "4px" }}>
            {name}
          </h2>
          <p style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: "12px" }}>
            {email}
          </p>
          <span
            className="tag-badge"
            style={{
              background: role === "club" ? "#fef3c7" : "#e0e7ff",
              color: role === "club" ? "#b45309" : "#4338ca",
              marginBottom: "20px"
            }}
          >
            {role.toUpperCase()}
          </span>

          <div style={{ textAlign: "left", fontSize: "13px", color: "var(--text-secondary)", marginBottom: "24px" }}>
            <p style={{ marginBottom: "8px" }}>
              <strong>College:</strong> {college || "Not set"}
            </p>
            <p style={{ marginBottom: "8px" }}>
              <strong>Department:</strong> {department || "Not set"}
            </p>
            <p>
              <strong>Year:</strong> {yearOfStudy}
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <button
              type="button"
              className="btn-secondary"
              style={{ width: "100%" }}
              onClick={() => navigate("/explore")}
            >
              <Compass size={16} /> Explore Opportunities
            </button>
            <button
              type="button"
              className="btn-danger"
              style={{ width: "100%" }}
              onClick={handleLogout}
            >
              <LogOut size={16} /> Sign Out
            </button>
          </div>
        </div>

        {/* Main Profile Form */}
        <div className="profile-main-card">
          <div style={{ marginBottom: "24px" }}>
            <h1 style={{ fontSize: "24px", fontWeight: "800", color: "#0f172a", marginBottom: "4px" }}>
              Academic & Skills Profile
            </h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
              Keep your profile up-to-date so our recommendation engine can suggest the most relevant opportunities.
            </p>
          </div>

          <form onSubmit={handleSave}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  style={{ paddingLeft: "14px" }}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Email Address (Account ID)</label>
                <input
                  type="email"
                  className="form-input"
                  style={{ paddingLeft: "14px", background: "var(--bg-subtle)" }}
                  value={email}
                  readOnly
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "16px" }}>
              <div className="form-group">
                <label>College / Institution Name</label>
                <input
                  type="text"
                  className="form-input"
                  style={{ paddingLeft: "14px" }}
                  placeholder="e.g. Bangalore Institute of Technology"
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Year of Study</label>
                <select
                  className="form-input"
                  style={{ paddingLeft: "14px" }}
                  value={yearOfStudy}
                  onChange={(e) => setYearOfStudy(e.target.value)}
                >
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="Final Year">Final Year</option>
                  <option value="Postgraduate">Postgraduate</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Department / Major</label>
              <input
                type="text"
                className="form-input"
                style={{ paddingLeft: "14px" }}
                placeholder="e.g. Computer Science and Engineering"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              />
            </div>

            {/* Interactive Skills Chip Manager */}
            <div className="form-group">
              <label>Technical Skills (Used for Opportunity Matching)</label>
              <div className="skills-input-box" style={{ marginBottom: "10px" }}>
                {skills.map((skill, index) => (
                  <span key={index} className="skill-tag-removable">
                    {skill}
                    <button type="button" onClick={() => handleRemoveSkill(skill)}>
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>

              <div style={{ display: "flex", gap: "8px" }}>
                <input
                  type="text"
                  className="form-input"
                  style={{ paddingLeft: "14px" }}
                  placeholder="Type a skill (e.g. React, Python, Docker) and click Add"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleAddSkill(e);
                    }
                  }}
                />
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={handleAddSkill}
                  style={{ whiteSpace: "nowrap" }}
                >
                  Add Skill
                </button>
              </div>
            </div>

            <div className="form-group">
              <label>Interests & Goals</label>
              <input
                type="text"
                className="form-input"
                style={{ paddingLeft: "14px" }}
                placeholder="e.g. Web Development, Hackathons, AI Research, Placement Prep"
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Bio / Summary</label>
              <textarea
                className="form-textarea"
                placeholder="Short intro for club organizers and recruiters..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
              />
            </div>

            {message && (
              <div className={`alert-box ${isSuccess ? "alert-success" : "alert-error"}`}>
                {message}
              </div>
            )}

            <button
              type="submit"
              className="btn-primary"
              style={{ padding: "12px 24px", fontSize: "15px" }}
              disabled={loading}
            >
              <Save size={16} /> {loading ? "Saving Changes..." : "Save Profile Changes"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Profile;
