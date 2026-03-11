import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./src/pages/Login/Login";
import Register from "./src/pages/Register/Register";
import Dashboard from "./src/pages/Transacoes/Transacoes";
import DashboardAnalytics from "./src/pages/Dashboard/Dashboard";
import ProtectedRoute from "@/src/components/ProtectedRoute/ProtectedRoute";
import { ThemeProvider } from "@/src/context/ThemeContext";

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/analytics"
            element={
              <ProtectedRoute>
                <DashboardAnalytics />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
