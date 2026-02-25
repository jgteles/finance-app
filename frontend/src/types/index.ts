// Common types for the application
export interface Transaction {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  type: "Receita" | "Despesa";
  status?: "pending" | "completed" | "cancelled";
}

export interface TransactionFilter {
  startDate?: string;
  endDate?: string;
  category?: string;
  type?: "Receita" | "Despesa";
  searchTerm?: string;
}

export interface SummaryData {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  period: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
  status: number;
}

export interface PaginatedResponse<T> {
  results: T[];
  count: number;
  next?: string;
  previous?: string;
}
