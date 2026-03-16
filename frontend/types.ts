export type TransactionType = "Receita" | "Despesa";

export interface Transaction {
  id: number; // mudar de string para number
  description: string;
  category: string;
  value: number;
  type: "Receita" | "Despesa";
  date: string;
}

export interface Totals {
  income: number;
  expense: number;
  balance: number;
}

export interface PiggyBank {
  id: number;
  name: string;
  color: string;
  balance: number;
  target_amount?: number | null;
  created_at?: string;
  updated_at?: string;
}
