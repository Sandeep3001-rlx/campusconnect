import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import Explore from "./pages/Explore";
import OpportunityDetails from "./pages/OpportunityDetails";
import ApplicationForm from "./pages/ApplicationForm";
import Applications from "./pages/Applications";
import ClubDashboard from "./pages/ClubDashboard";
import CreateOpportunity from "./pages/CreateOpportunity";
import ClubOpportunities from "./pages/ClubOpportunities";
import ClubApplications from "./pages/ClubApplications";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <BrowserRouter>
      <div className="app-layout">
        <Navbar />

        <main className="main-content">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/opportunity/:id" element={<OpportunityDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Student Protected Routes */}
            <Route
              path="/apply/:id"
              element={
                <ProtectedRoute allowedRoles={["student", "club", "admin"]}>
                  <ApplicationForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/applications"
              element={
                <ProtectedRoute allowedRoles={["student", "admin"]}>
                  <Applications />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute allowedRoles={["student", "club", "admin"]}>
                  <Profile />
                </ProtectedRoute>
              }
            />

            {/* Club Protected Routes */}
            <Route
              path="/club/dashboard"
              element={
                <ProtectedRoute allowedRoles={["club", "admin"]}>
                  <ClubDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/club/create-opportunity"
              element={
                <ProtectedRoute allowedRoles={["club", "admin"]}>
                  <CreateOpportunity />
                </ProtectedRoute>
              }
            />
            <Route
              path="/club/opportunities"
              element={
                <ProtectedRoute allowedRoles={["club", "admin"]}>
                  <ClubOpportunities />
                </ProtectedRoute>
              }
            />
            <Route
              path="/club/applications"
              element={
                <ProtectedRoute allowedRoles={["club", "admin"]}>
                  <ClubApplications />
                </ProtectedRoute>
              }
            />

            {/* Admin Portal Route */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={["admin", "club"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
