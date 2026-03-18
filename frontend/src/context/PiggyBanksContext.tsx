import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { ReactNode } from "react";
import { useLogin } from "./LoginContext";
import type { PiggyBank, PiggyBankMovement } from "@/types";

const BASE_URL = "http://127.0.0.1:8000/api";

interface PiggyBanksContextType {
  piggyBanks: PiggyBank[];
  isLoading: boolean;
  refreshPiggyBanks: () => Promise<void>;
  addPiggyBank: (data: Pick<PiggyBank, "name" | "color" | "target_amount">) => Promise<void>;
  updatePiggyBank: (
    id: number,
    data: Partial<Omit<PiggyBank, "id">>,
  ) => Promise<void>;
  removePiggyBank: (id: number) => Promise<void>;
  depositPiggyBank: (id: number, amount: number) => Promise<void>;
  withdrawPiggyBank: (id: number, amount: number) => Promise<void>;
  fetchPiggyBankMovements: (id: number) => Promise<PiggyBankMovement[]>;
  deletePiggyBankMovement: (piggyId: number, movementId: number) => Promise<void>;
}

const PiggyBanksContext = createContext<PiggyBanksContextType | undefined>(
  undefined,
);

export function PiggyBanksProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, logout } = useLogin();
  const [piggyBanks, setPiggyBanks] = useState<PiggyBank[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const normalizePiggyBank = useCallback((raw: any): PiggyBank => {
    return {
      id: Number(raw?.id),
      name: String(raw?.name ?? ""),
      color: String(raw?.color ?? "#22c55e"),
      balance: Number(raw?.balance ?? 0),
      target_amount:
        raw?.target_amount == null ? null : Number(raw?.target_amount),
      created_at: raw?.created_at,
      updated_at: raw?.updated_at,
    };
  }, []);

  const normalizeMovement = useCallback((raw: any): PiggyBankMovement => {
    return {
      id: Number(raw?.id),
      movement_type: String(raw?.movement_type ?? "") as PiggyBankMovement["movement_type"],
      amount: Number(raw?.amount ?? 0),
      balance_after: Number(raw?.balance_after ?? 0),
      created_at: String(raw?.created_at ?? ""),
    };
  }, []);

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
        setPiggyBanks(data.map(normalizePiggyBank));
        return;
      }

      if (Array.isArray(data.results)) {
        setPiggyBanks(data.results.map(normalizePiggyBank));
        return;
      }

      setPiggyBanks([]);
    } catch (err) {
      console.error("refreshPiggyBanks error:", err);
      setPiggyBanks([]);
    } finally {
      setIsLoading(false);
    }
  }, [getAuthHeaders, logout, normalizePiggyBank]);

  useEffect(() => {
    if (!isAuthenticated) {
      setPiggyBanks([]);
      return;
    }

    refreshPiggyBanks();
  }, [isAuthenticated, refreshPiggyBanks]);

  const addPiggyBank = async (
    data: Pick<PiggyBank, "name" | "color" | "target_amount">,
  ) => {
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
        const body = await response.json().catch(() => null);
        const message =
          body?.error ??
          body?.detail ??
          (body && typeof body === "object"
            ? JSON.stringify(body)
            : null) ??
          `Erro ao criar cofrinho: ${response.status}`;
        throw new Error(message);
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

  const depositPiggyBank = async (id: number, amount: number) => {
    try {
      const response = await fetch(`${BASE_URL}/piggy-banks/${id}/deposit/`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ amount }),
      });

      if (response.status === 401) {
        logout();
        return;
      }

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(body?.error ?? `Erro ao depositar: ${response.status}`);
      }

      const updated = normalizePiggyBank(await response.json());
      setPiggyBanks((prev) => prev.map((p) => (p.id === id ? updated : p)));
    } catch (err) {
      console.error("depositPiggyBank error:", err);
      throw err;
    }
  };

  const withdrawPiggyBank = async (id: number, amount: number) => {
    try {
      const response = await fetch(`${BASE_URL}/piggy-banks/${id}/withdraw/`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ amount }),
      });

      if (response.status === 401) {
        logout();
        return;
      }

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(body?.error ?? `Erro ao retirar: ${response.status}`);
      }

      const updated = normalizePiggyBank(await response.json());
      setPiggyBanks((prev) => prev.map((p) => (p.id === id ? updated : p)));
    } catch (err) {
      console.error("withdrawPiggyBank error:", err);
      throw err;
    }
  };

  const fetchPiggyBankMovements = async (id: number) => {
    const response = await fetch(`${BASE_URL}/piggy-banks/${id}/movements/`, {
      headers: getAuthHeaders(),
    });

    if (response.status === 401) {
      logout();
      return [];
    }

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      const message =
        body?.error ?? body?.detail ?? `Erro ao buscar movimentações: ${response.status}`;
      throw new Error(message);
    }

    const data = await response.json();
    const list = Array.isArray(data) ? data : Array.isArray(data?.results) ? data.results : [];
    return list.map(normalizeMovement);
  };

  const deletePiggyBankMovement = async (piggyId: number, movementId: number) => {
    const response = await fetch(
      `${BASE_URL}/piggy-banks/${piggyId}/movements/${movementId}/`,
      {
        method: "DELETE",
        headers: getAuthHeaders(),
      },
    );

    if (response.status === 401) {
      logout();
      return;
    }

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      const message =
        body?.error ?? body?.detail ?? `Erro ao apagar movimentação: ${response.status}`;
      throw new Error(message);
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
        depositPiggyBank,
        withdrawPiggyBank,
        fetchPiggyBankMovements,
        deletePiggyBankMovement,
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

