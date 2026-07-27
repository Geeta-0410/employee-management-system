import { Navigate } from "react-router-dom";

interface ProtectedAdminRouteProps {
  children: React.ReactNode;
}

function ProtectedAdminRoute({ children }: ProtectedAdminRouteProps) {
  const token = localStorage.getItem("token");

  const role = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (role !== "admin" && role !== "user") {
    return <Navigate to="/employee-dashboard" />;
  }

  return <>{children}</>;
}

export default ProtectedAdminRoute;
