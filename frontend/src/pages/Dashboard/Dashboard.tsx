import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTransactions } from "@/src/hooks/useTransactions";
import { uploadExcel } from "@/src/services/excelService";
import { DashboardNavbar } from "@/src/components/Navbar/Navbar";
import { SummaryCards } from "@/src/components/SummaryCards/SummaryCards";
import { MonthlyDetailedChart } from "@/src/components/Graficos/GraficoMensal/GraficoMensal";
import { CategoryPieChart } from "@/src/components/Graficos/GraficoPizza/GraficoPizza";
import { RevenueOverviewChart } from "@/src/components/Graficos/GraficoAnual/GraficoAnual";
import { useLogin } from "@/src/context/LoginContext";
import { parseAppDate, toMonthInputValue, formatCurrency } from "@/utils";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
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

  const monthlyIncomeExpenseData = useMemo(() => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth() - 5, 1);

    const map = new Map<
      string,
      {
        label: string;
        sortKey: number;
        income: number;
        expense: number;
      }
    >();

    transactions.forEach((t) => {
      const date = parseAppDate(t.date);
      if (date < start || date > now) return;

      const year = date.getFullYear();
      const month = date.getMonth();
      const key = `${year}-${month}`;

      if (!map.has(key)) {
        const monthLabel = date.toLocaleDateString("pt-BR", {
          month: "short",
        });

        map.set(key, {
          label: `${monthLabel}/${String(year).slice(-2)}`,
          sortKey: year * 12 + month,
          income: 0,
          expense: 0,
        });
      }

      const entry = map.get(key)!;
      const value = Number(t.value);

      if (t.type === "Receita") {
        entry.income += value;
      } else if (t.type === "Despesa") {
        entry.expense += value;
      }
    });

    return Array.from(map.values()).sort((a, b) => a.sortKey - b.sortKey);
  }, [transactions]);

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

        <div className="mb-4 flex flex-col gap-1">
          <h1 className="text-2xl font-semibold text-slate-900">
            Visão geral financeira
          </h1>
          <p className="text-sm text-slate-500">
            Acompanhe saldo, fluxo de caixa e categorias de despesas em um só lugar.
          </p>
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
            <div className="dashboardPage__card">
              <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-800">
                    Receitas x Despesas (últimos 6 meses)
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Compare a relação entre entradas e saídas mês a mês.
                  </p>
                </div>
              </div>

              <div className="min-h-0 flex-1">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={monthlyIncomeExpenseData}
                    margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#e2e8f0"
                    />
                    <XAxis
                      dataKey="label"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#64748b", fontSize: 12 }}
                      dy={8}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#64748b", fontSize: 12 }}
                      tickFormatter={(value) =>
                        `R$ ${Number(value).toLocaleString("pt-BR", {
                          maximumFractionDigits: 0,
                        })}`
                      }
                      width={72}
                    />
                    <Tooltip
                      formatter={(value: number) => formatCurrency(Number(value))}
                      contentStyle={{
                        borderRadius: 12,
                        borderColor: "#e2e8f0",
                      }}
                    />
                    <Legend />
                    <Bar
                      dataKey="income"
                      name="Receitas"
                      fill="#22c55e"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="expense"
                      name="Despesas"
                      fill="#ef4444"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
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
