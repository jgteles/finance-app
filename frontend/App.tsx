import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./src/pages/Login";
import Dashboard from "./src/pages/Dashboard";
import ProtectedRoute from "@/components/ProtectedRoute/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;