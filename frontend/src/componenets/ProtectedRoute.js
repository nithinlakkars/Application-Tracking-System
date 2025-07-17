import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, allowedRoles }) {
  const token = sessionStorage.getItem("token");
  const role = sessionStorage.getItem("role");

  console.log("🔐 ProtectedRoute Debug");
  console.log("Token:", token);
  console.log("Role:", role);
  console.log("Allowed roles:", allowedRoles);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles || !allowedRoles.includes(role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
