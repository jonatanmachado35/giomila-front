import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { getStoredUser } from "./lib/auth";
import "./index.css";

// Componente para redirecionar usuários autenticados da página de login
const LoginRoute = () => {
  const user = getStoredUser();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Login />;
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginRoute />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute redirectTo="/">
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
