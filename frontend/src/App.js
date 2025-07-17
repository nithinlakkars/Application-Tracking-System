import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import RegistrationForm from "./pages/RegistrationForm";
import RecruiterSubmit from "./pages/recruiter/RecruiterSubmit";
import SalesDashboard from "./pages/sales/SalesDashboard";
import LeadsDashboard from "./pages/lead/LeadsDashboard";
import ProtectedRoute from "./componenets/ProtectedRoute";
import AdminCreateUserForm from "./pages/AdminCreateUserForm";
import ZohoCallback from "./pages/ZohoCallback"; // ✅ Make sure this exists

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<RegistrationForm />} />
          
          <Route
            path="/recruitersubmit"
            element={
              <ProtectedRoute allowedRoles={["recruiter"]}>
                <RecruiterSubmit />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/create-user"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminCreateUserForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/salesDashboard"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <SalesDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/LeadDashboard"
            element={
              <ProtectedRoute allowedRoles={["leads"]}>
                <LeadsDashboard />
              </ProtectedRoute>
            }
          />

          {/* ✅ Zoho OAuth callback route */}
          <Route path="/callback" element={<ZohoCallback />} />

          {/* Catch-all route */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
