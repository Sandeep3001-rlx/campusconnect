import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, allowedRoles }) {
  const savedUser = localStorage.getItem("user");

  if (!savedUser) {
    return <Navigate to="/login" replace />;
  }

  try {
    const user = JSON.parse(savedUser);
    if (allowedRoles && !allowedRoles.includes(user.role)) {
      if (user.role === "club") {
        return <Navigate to="/club/dashboard" replace />;
      }
      if (user.role === "admin") {
        return <Navigate to="/admin" replace />;
      }
      return <Navigate to="/explore" replace />;
    }
    return children;
  } catch (err) {
    localStorage.removeItem("user");
    return <Navigate to="/login" replace />;
  }
}

export default ProtectedRoute;
