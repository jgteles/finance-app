import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTransactions } from "@/src/hooks/useTransactions";
import { uploadExcel } from "@/src/services/excelService";
import { DashboardNavbar } from "@/src/components/Navbar/Navbar";
import { SummaryCards } from "@/src/components/SummaryCards/SummaryCards";
import { MonthlyDetailedChart } from "@/src/components/Dashboards/GraficoMensalDetalhado";
import { MonthlyChart } from "@/src/components/Dashboards/GraficoMensal";
import { CategoryPieChart } from "@/src/components/Dashboards/GraficoPizza";
import { RevenueOverviewChart } from "@/src/components/Dashboards/RevenueOverviewChart";
import { useLogin } from "@/src/context/LoginContext";
import { parseAppDate, toMonthInputValue } from "@/utils";

export default function DashboardAnalytics() {
  const navigate = useNavigate();
  const { logout } = useLogin();
  const { transactions } = useTransactions();

  const [selectedMonth, setSelectedMonth] = useState(toMonthInputValue());

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

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const monthTransactions = transactions.filter((t) => {
    const date = parseAppDate(t.date);
    const formatted = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    return formatted === selectedMonth;
  });

  const totals = transactions.reduce(
    (acc, t) => {
      if (t.type === "Receita") {
        acc.income += Number(t.value);
      } else if (t.type === "Despesa") {
        acc.expense += Number(t.value);
      }
      return acc;
    },
    { income: 0, expense: 0, balance: 0 },
  );

  totals.balance = totals.income - totals.expense;

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

        <div className="mb-6 flex gap-2">
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
          >
            Transacoes
          </button>
          <button
            type="button"
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white"
          >
            Dashboard
          </button>
        </div>

        <SummaryCards totals={totals} />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <RevenueOverviewChart transactions={transactions} />
          </div>

          <div className="lg:col-span-4">
            <CategoryPieChart transactions={transactions} />
          </div>

          <div className="lg:col-span-6">
            <MonthlyDetailedChart
              transactions={monthTransactions}
              selectedMonth={selectedMonth}
              onMonthChange={setSelectedMonth}
            />
          </div>

          <div className="lg:col-span-6">
            <MonthlyChart transactions={transactions} />
          </div>
        </div>
      </div>
    </div>
  );
}
