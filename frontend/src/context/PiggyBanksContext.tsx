import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { ReactNode } from "react";
import { useLogin } from "./LoginContext";
import type { PiggyBank } from "@/types";

const BASE_URL = "http://127.0.0.1:8000/api";

interface PiggyBanksContextType {
  piggyBanks: PiggyBank[];
  isLoading: boolean;
  refreshPiggyBanks: () => Promise<void>;
  addPiggyBank: (data: Omit<PiggyBank, "id">) => Promise<void>;
  updatePiggyBank: (
    id: number,
    data: Partial<Omit<PiggyBank, "id">>,
  ) => Promise<void>;
  removePiggyBank: (id: number) => Promise<void>;
}

const PiggyBanksContext = createContext<PiggyBanksContextType | undefined>(
  undefined,
);

export function PiggyBanksProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, logout } = useLogin();
  const [piggyBanks, setPiggyBanks] = useState<PiggyBank[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const getAuthHeaders = useCallback(() => {
    const token = localStorage.getItem("token");
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return headers;
  }, []);

  const refreshPiggyBanks = useCallback(async () => {
    setIsLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/piggy-banks/`, {
        headers: getAuthHeaders(),
      });

      if (response.status === 401) {
        logout();
        setPiggyBanks([]);
        return;
      }

      if (!response.ok) {
        console.error("Erro ao buscar cofrinhos", response.status);
        setPiggyBanks([]);
        return;
      }

      const data = await response.json();

      if (Array.isArray(data)) {
        setPiggyBanks(data);
        return;
      }

      if (Array.isArray(data.results)) {
        setPiggyBanks(data.results);
        return;
      }

      setPiggyBanks([]);
    } catch (err) {
      console.error("refreshPiggyBanks error:", err);
      setPiggyBanks([]);
    } finally {
      setIsLoading(false);
    }
  }, [getAuthHeaders, logout]);

  useEffect(() => {
    if (!isAuthenticated) {
      setPiggyBanks([]);
      return;
    }

    refreshPiggyBanks();
  }, [isAuthenticated, refreshPiggyBanks]);

  const addPiggyBank = async (data: Omit<PiggyBank, "id">) => {
    try {
      const response = await fetch(`${BASE_URL}/piggy-banks/`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });

      if (response.status === 401) {
        logout();
        return;
      }

      if (!response.ok) {
        throw new Error(`Erro ao criar cofrinho: ${response.status}`);
      }

      await refreshPiggyBanks();
    } catch (err) {
      console.error("addPiggyBank error:", err);
      throw err;
    }
  };

  const updatePiggyBank = async (
    id: number,
    data: Partial<Omit<PiggyBank, "id">>,
  ) => {
    try {
      const response = await fetch(`${BASE_URL}/piggy-banks/${id}/`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });

      if (response.status === 401) {
        logout();
        return;
      }

      if (!response.ok) {
        throw new Error(`Erro ao atualizar cofrinho: ${response.status}`);
      }

      await refreshPiggyBanks();
    } catch (err) {
      console.error("updatePiggyBank error:", err);
      throw err;
    }
  };

  const removePiggyBank = async (id: number) => {
    try {
      const response = await fetch(`${BASE_URL}/piggy-banks/${id}/`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (response.status === 401) {
        logout();
        return;
      }

      if (!response.ok) {
        throw new Error(`Erro ao remover cofrinho: ${response.status}`);
      }

      await refreshPiggyBanks();
    } catch (err) {
      console.error("removePiggyBank error:", err);
      throw err;
    }
  };

  return (
    <PiggyBanksContext.Provider
      value={{
        piggyBanks,
        isLoading,
        refreshPiggyBanks,
        addPiggyBank,
        updatePiggyBank,
        removePiggyBank,
      }}
    >
      {children}
    </PiggyBanksContext.Provider>
  );
}

export function usePiggyBanksContext() {
  const context = useContext(PiggyBanksContext);

  if (!context) {
    throw new Error(
      "usePiggyBanksContext must be used within PiggyBanksProvider",
    );
  }

  return context;
}

