import { Navigate } from "react-router-dom";

interface ProtectedEmployeeRouteProps {
  children: React.ReactNode;
}
function ProtectedEmployeeRoute({ children }: ProtectedEmployeeRouteProps) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  if (!token) {
    return <Navigate to="/login" />;
  }
  if (role !== "employee") {
    return <Navigate to="/" />;
  }
  return <>{children}</>;
}
export default ProtectedEmployeeRoute;
