import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";
import { useLogin } from "./LoginContext";
import { Transaction, Totals } from "@/types";

const BASE_URL = "http://127.0.0.1:8000/api";

interface TransactionsContextType {
  transactions: Transaction[];
  totals: Totals;
  isLoading: boolean;
  refreshTransactions: () => Promise<void>;
  addTransaction: (data: Omit<Transaction, "id">) => Promise<void>;
  removeTransaction: (id: number) => Promise<void>;
}

const TransactionsContext = createContext<TransactionsContextType | undefined>(
  undefined,
);

export function TransactionsProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, logout } = useLogin();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
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

  const refreshTransactions = useCallback(async () => {
    setIsLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/transactions/`, {
        headers: getAuthHeaders(),
      });

      if (response.status === 401) {
        logout();
        setTransactions([]);
        return;
      }

      if (!response.ok) {
        console.error("Erro ao buscar transacoes", response.status);
        setTransactions([]);
        return;
      }

      const data = await response.json();

      if (Array.isArray(data)) {
        setTransactions(data);
        return;
      }

      if (Array.isArray(data.results)) {
        setTransactions(data.results);
        return;
      }

      setTransactions([]);
    } catch (err) {
      console.error("refreshTransactions error:", err);
      setTransactions([]);
    } finally {
      setIsLoading(false);
    }
  }, [getAuthHeaders, logout]);

  useEffect(() => {
    if (!isAuthenticated) {
      setTransactions([]);
      return;
    }

    refreshTransactions();
  }, [isAuthenticated, refreshTransactions]);

  const totals: Totals = useMemo(() => {
    return transactions.reduce(
      (acc, curr) => {
        if (curr.type === "Receita") {
          acc.income += Number(curr.value);
        } else {
          acc.expense += Number(curr.value);
        }

        acc.balance = acc.income - acc.expense;
        return acc;
      },
      { income: 0, expense: 0, balance: 0 },
    );
  }, [transactions]);

  const addTransaction = async (data: Omit<Transaction, "id">) => {
    try {
      const response = await fetch(`${BASE_URL}/transactions/`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });

      if (response.status === 401) {
        logout();
        return;
      }

      if (!response.ok) {
        throw new Error(`Erro ao criar transacao: ${response.status}`);
      }

      await refreshTransactions();
    } catch (err) {
      console.error("addTransaction error:", err);
      throw err;
    }
  };

  const removeTransaction = async (id: number) => {
    try {
      const response = await fetch(`${BASE_URL}/transactions/${id}/`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (response.status === 401) {
        logout();
        return;
      }

      if (!response.ok) {
        throw new Error(`Erro ao remover transacao: ${response.status}`);
      }

      await refreshTransactions();
    } catch (err) {
      console.error("erro:", err);
      throw err;
    }
  };

  return (
    <TransactionsContext.Provider
      value={{
        transactions,
        totals,
        isLoading,
        refreshTransactions,
        addTransaction,
        removeTransaction,
      }}
    >
      {children}
    </TransactionsContext.Provider>
  );
}

export function useTransactionsContext() {
  const context = useContext(TransactionsContext);

  if (!context) {
    throw new Error(
      "useTransactionsContext must be used within TransactionsProvider",
    );
  }

  return context;
}
