import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, Building, GraduationCap, ArrowRight } from "lucide-react";
import "../App.css";

function Signup() {
  const navigate = useNavigate();

  const [role, setRole] = useState("student");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [college, setCollege] = useState("");
  const [department, setDepartment] = useState("");
  const [yearOfStudy, setYearOfStudy] = useState("3rd Year");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSignup(e) {
    e.preventDefault();

    if (!name || !email || !password) {
      setMessage("Please fill in all required fields.");
      setIsSuccess(false);
      return;
    }

    if (password.length < 6) {
      setMessage("Password must be at least 6 characters long.");
      setIsSuccess(false);
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("http://127.0.0.1:8000/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          role,
          college: college || "College Campus",
          department: department || (role === "club" ? "Student Activity Council" : "Computer Science & Engg"),
          year_of_study: yearOfStudy,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.detail || "Account creation failed.");
        setIsSuccess(false);
        setLoading(false);
        return;
      }

      // Auto login with returned JWT token
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setIsSuccess(true);
      setMessage("Account created successfully! Redirecting...");

      setTimeout(() => {
        if (role === "club") {
          navigate("/club/dashboard");
        } else {
          navigate("/profile");
        }
      }, 800);
    } catch (error) {
      setMessage("Unable to connect to the server. Make sure the backend is running.");
      setIsSuccess(false);
    }

    setLoading(false);
  }

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ maxWidth: "520px" }}>
        <div className="auth-header">
          <div className="logo-icon-box" style={{ margin: "0 auto 16px" }}>
            <GraduationCap size={22} />
          </div>
          <h1>Join CampusConnect</h1>
          <p>Create your student or club account to start engaging with campus opportunities.</p>
        </div>

        {/* Role Switcher */}
        <div className="role-switcher">
          <button
            type="button"
            className={`role-tab ${role === "student" ? "active" : ""}`}
            onClick={() => setRole("student")}
          >
            🎓 I am a Student
          </button>
          <button
            type="button"
            className={`role-tab ${role === "club" ? "active" : ""}`}
            onClick={() => setRole("club")}
          >
            🏛️ I am a Club / Organizer
          </button>
        </div>

        <form onSubmit={handleSignup}>
          <div className="form-group">
            <label>{role === "club" ? "Club / Organization Name *" : "Full Name *"}</label>
            <div className="input-with-icon">
              {role === "club" ? (
                <Building className="input-icon" size={18} />
              ) : (
                <User className="input-icon" size={18} />
              )}
              <input
                type="text"
                className="form-input"
                placeholder={role === "club" ? "e.g. Developer Student Club" : "e.g. Alex Johnson"}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Email Address *</label>
            <div className="input-with-icon">
              <Mail className="input-icon" size={18} />
              <input
                type="email"
                className="form-input"
                placeholder="name@college.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Password (min 6 characters) *</label>
            <div className="input-with-icon">
              <Lock className="input-icon" size={18} />
              <input
                type="password"
                className="form-input"
                placeholder="Create a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {role === "student" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div className="form-group">
                <label>Department / Major</label>
                <input
                  type="text"
                  className="form-input"
                  style={{ paddingLeft: "14px" }}
                  placeholder="e.g. Computer Science"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
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
          )}

          {message && (
            <div className={`alert-box ${isSuccess ? "alert-success" : "alert-error"}`}>
              {message}
            </div>
          )}

          <button
            type="submit"
            className="btn-primary"
            style={{ width: "100%", padding: "12px", marginTop: "10px" }}
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Account & Get Started"}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link to="/login">Sign In</Link>
        </div>
      </div>
    </div>
  );
}

export default Signup;
