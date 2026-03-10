import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTransactions } from "@/src/hooks/useTransactions";
import { uploadExcel } from "@/src/services/excelService";
import { DashboardNavbar } from "@/src/components/Navbar/Navbar";
import { SummaryCards } from "@/src/components/SummaryCards/SummaryCards";
import { MonthlyDetailedChart } from "@/src/components/Graficos/GraficoMensal/GraficoMensal";
import { CategoryPieChart } from "@/src/components/Graficos/GraficoPizza/GraficoPizza";
import { RevenueOverviewChart } from "@/src/components/Graficos/GraficoAnual/GraficoAnual";
import { useLogin } from "@/src/context/LoginContext";
import { parseAppDate, toMonthInputValue } from "@/utils";
import "./Dashboard.css";

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
    <div className="dashboardPage__root">
      <div className="dashboardPage__container">
        <DashboardNavbar onImport={openFileSelector} onLogout={handleLogout} />

        <input
          id="excel-upload"
          type="file"
          accept=".xlsx, .xls"
          onChange={handleImport}
          className="dashboardPage__fileInput"
        />

        <div className="dashboardPage__tabs">
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="dashboardPage__tab dashboardPage__tab--inactive"
          >
            Transacoes
          </button>
          <button
            type="button"
            className="dashboardPage__tab dashboardPage__tab--active"
          >
            Dashboard
          </button>
        </div>

        <SummaryCards totals={totals} />

        <div className="dashboardPage__grid">
          <div className="dashboardPage__col dashboardPage__col--8">
            <RevenueOverviewChart transactions={transactions} />
          </div>

          <div className="dashboardPage__col dashboardPage__col--4">
            <CategoryPieChart transactions={transactions} />
          </div>

          <div className="dashboardPage__col dashboardPage__col--6">
            <MonthlyDetailedChart
              transactions={monthTransactions}
              selectedMonth={selectedMonth}
              onMonthChange={setSelectedMonth}
            />
          </div>

        </div>
      </div>
    </div>
  );
}
