import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

const BASE_URL = "http://127.0.0.1:8000/api";

interface LoginContextType {
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const LoginContext = createContext<LoginContextType | undefined>(undefined);

export function LoginProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`${BASE_URL}/token/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json().catch(() => ({}));

      if (response.status === 401) {
        setError("Usuario ou senha invalidos");
        return false;
      }

      if (!response.ok) {
        setError(data?.detail || "Erro ao conectar com o servidor");
        return false;
      }

      if (data.access) {
        localStorage.setItem("token", data.access);
        setToken(data.access);
        return true;
      }

      setError("Usuario ou senha invalidos");
      return false;
    } catch {
      setError("Erro ao conectar com o servidor");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  return (
    <LoginContext.Provider
      value={{
        token,
        isAuthenticated: !!token,
        isLoading,
        error,
        login,
        logout,
      }}
    >
      {children}
    </LoginContext.Provider>
  );
}

export function useLogin() {
  const context = useContext(LoginContext);
  if (!context) {
    throw new Error("useLogin must be used within LoginProvider");
  }
  return context;
}
