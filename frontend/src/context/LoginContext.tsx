import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

const BASE_URL = "http://127.0.0.1:8000/api";

interface LoginContextType {
  token: string | null;
  isAuthenticated: boolean;
  isAuthReady: boolean;
  isLoading: boolean;
  error: string;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const LoginContext = createContext<LoginContextType | undefined>(undefined);
const SESSION_DURATION_MS = 60 * 60 * 1000;
const TOKEN_KEY = "token";
const SESSION_EXPIRES_AT_KEY = "session_expires_at";

export function LoginProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY);
    const expiresAt = Number(localStorage.getItem(SESSION_EXPIRES_AT_KEY) || 0);
    const now = Date.now();

    if (storedToken) {
      if (!expiresAt) {
        const fallbackExpiresAt = now + SESSION_DURATION_MS;
        localStorage.setItem(
          SESSION_EXPIRES_AT_KEY,
          fallbackExpiresAt.toString(),
        );
        setToken(storedToken);
      } else if (now < expiresAt) {
        setToken(storedToken);
      } else {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(SESSION_EXPIRES_AT_KEY);
      }
    }

    setIsAuthReady(true);
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
        const expiresAt = Date.now() + SESSION_DURATION_MS;
        localStorage.setItem(TOKEN_KEY, data.access);
        localStorage.setItem(SESSION_EXPIRES_AT_KEY, expiresAt.toString());
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
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(SESSION_EXPIRES_AT_KEY);
    setToken(null);
  };

  return (
    <LoginContext.Provider
      value={{
        token,
        isAuthenticated: !!token,
        isAuthReady,
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
