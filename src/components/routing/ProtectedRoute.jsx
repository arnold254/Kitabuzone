import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import PropTypes from "prop-types";

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, isAuthLoading } = useAuth();

  console.log("ProtectedRoute: Checking user:", user, "isAuthLoading:", isAuthLoading);

  if (isAuthLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    console.log("ProtectedRoute: Redirecting to login because user is null");
    return <Navigate to="/auth/login" state={{ from: window.location.pathname }} replace />;
  }

  if (requireAdmin && user.role !== "admin") {
    console.log("ProtectedRoute: Redirecting to home because user is not admin");
    return <Navigate to="/" replace />;
  }

  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  requireAdmin: PropTypes.bool,
};

export default ProtectedRoute;