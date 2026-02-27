import { Navigate } from "react-router-dom";
import { useLogin } from "@/src/context/LoginContext";

export default function ProtectedRoute({ children }: any) {
  const { isAuthenticated } = useLogin();

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  return children;
}
