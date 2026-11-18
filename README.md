# 🎓 CampusConnect — Smart Student Opportunity & Event Management Platform

> A full-stack centralized web platform for students, clubs, and college administrators to discover, manage, personalize, and track campus opportunities.

![React](https://img.shields.io/badge/Frontend-React%2019%20%7C%20Vite-blue?logo=react)
![FastAPI](https://img.shields.io/badge/Backend-FastAPI%20%7C%20Python-009688?logo=fastapi)
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-336791?logo=postgresql)
![JWT](https://img.shields.io/badge/Auth-JWT%20%2B%20Bcrypt-black?logo=jsonwebtokens)
![License](https://img.shields.io/badge/License-MIT-green)

---

## 🌟 Key Highlights & Engineering Features

### 1. 🎓 Student Experience
- **Explore & Filter Opportunities:** Discover internships, hackathons, workshops, and events with real-time text search and category tabs.
- **Smart Explainable Recommendations:** Match opportunities against student skills, department, and interests with a transparent percentage score and explanation (e.g., *"Matches your skills: React, Python"*).
- **Interactive Application Tracker:** Live 4-stage pipeline stepper (*Submitted ➔ Under Review ➔ Evaluation ➔ Decision*) with dynamic color badges (**Accepted** in emerald green, **Rejected** in crimson red, **Under Review** in amber, **Applied** in blue).
- **Duplicate Prevention:** Backend constraint prevents students from submitting duplicate applications to the same opportunity.
- **Academic & Skills Profile:** Manage technical skills with interactive tag chips, college affiliation, department, and bio.

### 2. 🏛️ Club & Organizer Portal
- **Role-Based Authentication:** Distinct club accounts with protected routing and navigation.
- **Club KPI Dashboard:** Real-time metrics for Opportunities Posted, Total Applications, Accepted Candidates, and Pending Reviews.
- **Opportunity Publisher:** Post new opportunities with target skills, deadlines, locations, and descriptions.
- **Candidate Review Hub:** Screen applicants, view statements of purpose, inspect resume indicators, and issue **1-Click decisions** (Accept, Move to Review, Reject) with feedback notes.

### 3. 🛡️ Administrator & Moderation Portal
- **Platform Analytics:** Total users, student/club counts, total applications, and approval queues.
- **Opportunity Moderation:** Approve or reject newly posted club listings.
- **User Directory:** Inspect registered student and club accounts.

### 4. 🔔 In-App Notification System
- Real-time notification bell dropdown in the navigation bar.
- Automatic notifications triggered upon signup, application submission, and status updates (Accepted / Reviewed / Rejected).

### 5. 🔒 Production-Grade Security
- **Bcrypt Password Hashing:** Salted hashes stored in PostgreSQL; no plain-text passwords.
- **JWT Authorization:** Stateless Bearer tokens with configurable expiration.
- **Environment Isolation:** Zero database passwords in source control; loaded via `.env`.

---

## 🏗️ System Architecture

```
CampusConnect Architecture
├── Frontend (React 19, Vite, React Router v7, Lucide Icons)
│   ├── Components: Navbar, Footer, ProtectedRoute
│   └── Pages: Home, Explore, Details, Applications, ClubDashboard, ClubApplications, Profile, Admin
│
├── REST API Layer (FastAPI, Python 3.12, Uvicorn)
│   ├── JWT & Bcrypt Authentication (auth.py)
│   ├── Recommendation Engine (recommendations.py)
│   └── CRUD & Analytics Endpoints (main.py)
│
└── Database Layer (PostgreSQL, SQLAlchemy ORM)
    ├── users (students, clubs, admins, academic profile, skills)
    ├── opportunities (internships, hackathons, workshops, events, club_id)
    ├── applications (user_id, opportunity_id, resume, status, notes)
    └── notifications (user_id, title, message, is_read, timestamp)
```

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js (v18+) & npm
- Python (v3.10+)
- PostgreSQL (running locally on port `5432` with database `campusconnect`)

---

### Step 1: Backend Setup (FastAPI & PostgreSQL)

1. Open a terminal and navigate to the backend folder:
   ```powershell
   cd backend
   ```

2. Activate the Python virtual environment:
   ```powershell
   .\venv\Scripts\activate
   ```

3. Ensure dependencies are installed:
   ```powershell
   pip install -r requirements.txt
   # Or: pip install fastapi uvicorn sqlalchemy psycopg2-binary bcrypt pyjwt python-dotenv
   ```

4. Verify your `.env` configuration (a template `.env.example` is provided):
   ```ini
   DATABASE_URL=postgresql://postgres:Rolex$123@localhost:5432/campusconnect
   SECRET_KEY=campusconnect_jwt_secret_key_prod_2026_secure
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=1440
   ```

5. Start the FastAPI server:
   ```powershell
   uvicorn main:app --reload
   ```
   * Backend will be live at: `http://127.0.0.1:8000`
   * Interactive Swagger Docs at: `http://127.0.0.1:8000/docs`

---

### Step 2: Frontend Setup (React & Vite)

1. Open a second terminal and navigate to the frontend folder:
   ```powershell
   cd frontend
   ```

2. Start the Vite development server:
   ```powershell
   npm run dev
   ```
   * Open your browser and visit: `http://localhost:5173`

---

## 🧪 Demo Credentials (For Testing & Viva Evaluation)

The login screen features **1-click quick fill buttons** for immediate testing:

| Role | Email | Password | Access |
| :--- | :--- | :--- | :--- |
| **Student** | `sandeepraja2930@gmail.com` | `Password@123` | Explore, Apply, Track Status, Profile |
| **Club Organizer** | `techclub@campusconnect.com` | `Password@123` | Post Listings, Screen & Accept/Reject Applicants |

---

## 📂 Project Directory Structure

```
CampusConnect/
├── backend/
│   ├── auth.py              # JWT tokens, password hashing, auth dependencies
│   ├── database.py          # SQLAlchemy engine, SessionLocal, get_db
│   ├── main.py              # FastAPI application routes & middleware
│   ├── models.py            # PostgreSQL SQLAlchemy ORM models
│   ├── recommendations.py   # Explainable skill-matching engine
│   ├── schemas.py           # Pydantic validation schemas
│   ├── .env                 # Environment credentials (ignored in Git)
│   └── .env.example         # Template environment file
│
├── frontend/
│   ├── src/
│   │   ├── components/      # Navbar, Footer, ProtectedRoute
│   │   ├── pages/           # Home, Explore, Details, Applications, Club, Profile, Admin
│   │   ├── App.css          # Modern SaaS CSS design system
│   │   ├── index.css        # Clean global typography & reset
│   │   ├── App.jsx          # Route definitions & guards
│   │   └── main.jsx         # React root
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore               # Protects .env, node_modules, and venv
└── README.md                # Project documentation
```

---

## 📜 Resume / Portfolio Summary

> **CampusConnect — Full-Stack Student Opportunity Platform**
> *Developed a responsive web platform connecting students with campus internships and hackathons using React 19, FastAPI, PostgreSQL, and SQLAlchemy.*
> - Engineered an explainable skill-matching recommendation algorithm boosting candidate-opportunity discovery relevance.
> - Implemented an interactive 4-stage application lifecycle tracker with real-time status transitions (Applied, Under Review, Accepted, Rejected).
> - Architected role-based access control (RBAC) and authentication using JWT Bearer tokens and salted bcrypt password encryption.
> - Prevented duplicate application submissions via relational constraints and integrated in-app status notification triggers.
