import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

const BASE_URL = "http://127.0.0.1:8000/api";

interface RegisterContextType {
  isLoading: boolean;
  error: string;
  successMessage: string;
  register: (username: string, password: string) => Promise<boolean>;
  clearRegisterState: () => void;
}

const RegisterContext = createContext<RegisterContextType | undefined>(
  undefined,
);

export function RegisterProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const clearRegisterState = () => {
    setError("");
    setSuccessMessage("");
  };

  const register = async (username: string, password: string) => {
    setIsLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const response = await fetch(`${BASE_URL}/register/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(data?.detail || "Erro ao cadastrar usuario");
        return false;
      }

      setSuccessMessage("Usuario cadastrado com sucesso");
      return true;
    } catch {
      setError("Erro ao conectar com o servidor");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <RegisterContext.Provider
      value={{
        isLoading,
        error,
        successMessage,
        register,
        clearRegisterState,
      }}
    >
      {children}
    </RegisterContext.Provider>
  );
}

export function useRegister() {
  const context = useContext(RegisterContext);
  if (!context) {
    throw new Error("useRegister must be used within RegisterProvider");
  }
  return context;
}
