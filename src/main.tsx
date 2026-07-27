import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./index.css";
import "leaflet/dist/leaflet.css";

import App from "./App";

import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";

import EmployeeDashboard from "./pages/EmployeeDashboard";
import EmployeeSkills from "./pages/EmployeeSkills";
import Attendance from "./pages/Attendance.tsx";
import EmployeeTasks from "./pages/EmployeeTasks";
import ChangePassword from "./pages/ChangePassword";
import EmployeeProfile from "./pages/EmployeeProfile";
import ProtectedAdminRoute from "./routes/ProtectedAdminRoute";
import ProtectedEmployeeRoute from "./routes/ProtectedEmployeeRoute";
import AIAssistant from "./pages/AIAssistant";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedAdminRoute>
              <App />
            </ProtectedAdminRoute>
          }
        />

        <Route path="/login" element={<Login />} />

        <Route path="/signup" element={<Signup />} />

        <Route path="/change-password" element={<ChangePassword />} />

        <Route
          path="/employee-dashboard"
          element={
            <ProtectedEmployeeRoute>
              <EmployeeDashboard />
            </ProtectedEmployeeRoute>
          }
        />

        <Route
          path="/employee/skills"
          element={
            <ProtectedEmployeeRoute>
              <EmployeeSkills />
            </ProtectedEmployeeRoute>
          }
        />
        <Route
          path="/employee/attendance"
          element={
            <ProtectedEmployeeRoute>
              <Attendance />
            </ProtectedEmployeeRoute>
          }
        />
        <Route
          path="/employee/tasks"
          element={
            <ProtectedEmployeeRoute>
              <EmployeeTasks />
            </ProtectedEmployeeRoute>
          }
        />
        <Route
          path="/employee/chat"
          element={
            <ProtectedEmployeeRoute>
              <AIAssistant />
            </ProtectedEmployeeRoute>
          }
        />
        <Route
          path="/employee/profile"
          element={
            <ProtectedEmployeeRoute>
              <EmployeeProfile />
            </ProtectedEmployeeRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
