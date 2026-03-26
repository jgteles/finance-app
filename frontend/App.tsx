import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { createRef, useRef, type RefObject } from "react";
import Login from "./src/pages/Login/Login";
import Register from "./src/pages/Register/Register";
import Dashboard from "./src/pages/Transacoes/Transacoes";
import DashboardAnalytics from "./src/pages/Dashboard/Dashboard";
import ProtectedRoute from "@/src/components/ProtectedRoute/ProtectedRoute";
import { ThemeProvider } from "@/src/context/ThemeContext";
import "./src/styles/routeTransitions.css";

function AnimatedRoutes() {
  const location = useLocation();
  const nodeRefMap = useRef(new Map<string, RefObject<HTMLDivElement>>());

  if (!nodeRefMap.current.has(location.key)) {
    nodeRefMap.current.set(location.key, createRef<HTMLDivElement>());
  }

  const nodeRef = nodeRefMap.current.get(location.key)!;

  return (
    <TransitionGroup className="route-transition-container">
      <CSSTransition
        key={location.key}
        nodeRef={nodeRef}
        classNames="route"
        timeout={250}
        unmountOnExit
      >
        <div ref={nodeRef} className="route-transition-page">
          <Routes location={location}>
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
        </div>
      </CSSTransition>
    </TransitionGroup>
  );
}

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AnimatedRoutes />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
