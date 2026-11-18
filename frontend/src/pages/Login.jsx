import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, LogIn, Sparkles, Building2, UserCheck } from "lucide-react";
import "../App.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();

    if (!email || !password) {
      setMessage("Please enter your email and password.");
      setIsSuccess(false);
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("http://127.0.0.1:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.detail || "Login failed. Check your credentials.");
        setIsSuccess(false);
        setLoading(false);
        return;
      }

      // Store Auth Token and User Details
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setIsSuccess(true);
      setMessage(`Welcome back, ${data.user.name}! Redirecting...`);

      setTimeout(() => {
        if (data.user.role === "club") {
          navigate("/club/dashboard");
        } else if (data.user.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/explore");
        }
      }, 700);
    } catch (error) {
      setMessage("Unable to connect to the server. Make sure the FastAPI backend is running.");
      setIsSuccess(false);
    }

    setLoading(false);
  }

  // Quick Demo account fill for demonstration/evaluation
  function fillDemo(type) {
    if (type === "student") {
      setEmail("sandeepraja2930@gmail.com");
      setPassword("Password@123");
    } else if (type === "club") {
      setEmail("techclub@campusconnect.com");
      setPassword("Password@123");
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="logo-icon-box" style={{ margin: "0 auto 16px" }}>
            <LogIn size={22} />
          </div>
          <h1>Welcome to CampusConnect</h1>
          <p>Login to discover opportunities, track applications, or manage club events.</p>
        </div>

        {/* Demo Fast Fill for evaluation */}
        <div className="demo-account-box">
          <p>💡 Quick Demo Accounts (For Viva / Demo / Evaluation):</p>
          <div className="demo-pills">
            <button
              type="button"
              className="demo-pill"
              onClick={() => fillDemo("student")}
            >
              <UserCheck size={12} /> Student Account
            </button>
            <button
              type="button"
              className="demo-pill"
              onClick={() => fillDemo("club")}
            >
              <Building2 size={12} /> Club Account
            </button>
          </div>
        </div>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email Address</label>
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
            <label>Password</label>
            <div className="input-with-icon">
              <Lock className="input-icon" size={18} />
              <input
                type="password"
                className="form-input"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {message && (
            <div className={`alert-box ${isSuccess ? "alert-success" : "alert-error"}`}>
              {message}
            </div>
          )}

          <button
            type="submit"
            className="btn-primary"
            style={{ width: "100%", padding: "12px", marginTop: "8px" }}
            disabled={loading}
          >
            {loading ? "Authenticating..." : "Sign In to CampusConnect"}
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account yet? <Link to="/signup">Create an Account</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
