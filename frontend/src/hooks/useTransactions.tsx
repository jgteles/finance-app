import { useState, useEffect, useMemo } from "react";
import {
  fetchTransactions,
  createTransaction,
  deleteTransaction,
} from "../services/api";
import { Transaction, Totals } from "@/types";

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    const data = await fetchTransactions();
    setTransactions(data);
  };

  const totals: Totals = useMemo(() => {
    return transactions.reduce(
      (acc, curr) => {
        if (curr.type === "Receita") acc.income += Number(curr.value);
        else acc.expense += Number(curr.value);

        acc.balance = acc.income - acc.expense;
        return acc;
      },
      { income: 0, expense: 0, balance: 0 },
    );
  }, [transactions]);

  const addTransaction = async (data: Omit<Transaction, "id">) => {
    await createTransaction(data);
    loadTransactions();
  };

  const removeTransaction = async (id: number) => {
    await deleteTransaction(id);
    loadTransactions();
  };

  return {
    transactions,
    totals,
    addTransaction,
    removeTransaction,
  };
}
