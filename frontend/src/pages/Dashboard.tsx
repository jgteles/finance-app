import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTransactions } from "@/src/hooks/useTransactions";
import { uploadExcel } from "@/src/services/excelService";
import { MonthlyChart } from "@/src/components/Dashboards/GraficoMensal";
import { DashboardNavbar } from "@/src/components/Navbar/DashboardNavbar";
import { SummaryCards } from "@/src/components/SummaryCards/SummaryCards";
import { TransactionForm } from "@/src/components/Transaction/TransactionForm";
import { TransactionTable } from "@/src/components/Transaction/TransactionTable";
import { MonthlyDetailedChart } from "@/src/components/Dashboards/GraficoMensalDetalhado";
import { useLogin } from "@/src/context/LoginContext";
import { parseAppDate, toMonthInputValue } from "@/utils";

export default function Dashboard() {
  const navigate = useNavigate();
  const { logout } = useLogin();

  const [selectedMonth, setSelectedMonth] = useState(
    toMonthInputValue(), // YYYY-MM
  );

  const { transactions, addTransaction, removeTransaction } =
    useTransactions();

  const openFileSelector = () => {
    document.getElementById("excel-upload")?.click();
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const result = await uploadExcel(file);
      alert(result.message);
    } catch (error: any) {
      alert(error.message);
    }
  };

  const [selectedType, setSelectedType] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const filteredTransactions = transactions.filter((t) => {
    const matchType = selectedType === "" || t.type === selectedType;

    const matchCategory =
      selectedCategory === "" || t.category === selectedCategory;

    const matchStartDate =
      startDate === "" || parseAppDate(t.date) >= parseAppDate(startDate);

    const matchEndDate =
      endDate === "" || parseAppDate(t.date) <= parseAppDate(endDate);

    return matchType && matchCategory && matchStartDate && matchEndDate;
  });

  const monthTransactions = filteredTransactions.filter((t) => {
    const date = parseAppDate(t.date);
    const formatted = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    return formatted === selectedMonth;
  });

  const categories = [...new Set(transactions.map((t) => t.category))];

  const filteredTotals = filteredTransactions.reduce(
    (acc, t) => {
      if (t.type === "Receita") {
        acc.income += Number(t.value);
      } else if (t.type === "Despesa") {
        acc.expense += Number(t.value);
      }
      return acc;
    },
    { income: 0, expense: 0 },
  );

  filteredTotals.balance = filteredTotals.income - filteredTotals.expense;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 text-slate-900 md:p-8">
      <div className="mx-auto max-w-6xl">
        <DashboardNavbar onImport={openFileSelector} onLogout={handleLogout} />

        <input
          id="excel-upload"
          type="file"
          accept=".xlsx, .xls"
          onChange={handleImport}
          className="hidden"
        />

        <SummaryCards totals={filteredTotals} />

        <TransactionForm onAdd={addTransaction} />

        <TransactionTable
          transactions={filteredTransactions}
          onDelete={removeTransaction}
          selectedType={selectedType}
          onTypeChange={setSelectedType}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          startDate={startDate}
          onStartDateChange={setStartDate}
          endDate={endDate}
          onEndDateChange={setEndDate}
          categories={categories}
        />

        <div className="mt-8 grid h-[400px] grid-cols-1 gap-6 md:grid-cols-2">
          <MonthlyDetailedChart
            transactions={monthTransactions}
            selectedMonth={selectedMonth}
            onMonthChange={setSelectedMonth}
          />
          <MonthlyChart transactions={transactions} />

          <div className="flex items-center justify-center rounded-xl border border-slate-200 bg-white p-6 text-slate-400 shadow-sm">
            Espaco para novo grafico
          </div>

          <div className="flex items-center justify-center rounded-xl border border-slate-200 bg-white p-6 text-slate-400 shadow-sm">
            Espaco para novo grafico
          </div>
        </div>
      </div>
    </div>
  );
}
