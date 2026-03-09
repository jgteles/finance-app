import React, { useMemo } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { parseAppDate, formatCurrency } from "@/utils";

interface Transaction {
  date: string;
  type: "Receita" | "Despesa";
  value: number;
}

interface Props {
  transactions: Transaction[];
}

const MONTHS = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
];

export const RevenueOverviewChart: React.FC<Props> = ({ transactions }) => {
  const currentYear = new Date().getFullYear();
  const previousYear = currentYear - 1;
  const currentMonthIndex = new Date().getMonth();

  const data = useMemo(() => {
    const base = MONTHS.map((month) => ({
      month,
      monthlyIncome: 0,
      monthlyExpense: 0,
      revenue: 0,
      expense: 0,
    }));

    transactions.forEach((transaction) => {
      const date = parseAppDate(transaction.date);
      if (date.getFullYear() !== currentYear) return;

      const monthIndex = date.getMonth();
      if (transaction.type === "Receita") {
        base[monthIndex].monthlyIncome += Number(transaction.value);
      } else {
        base[monthIndex].monthlyExpense += Number(transaction.value);
      }
    });

    let cumulativeBalance = 0;

    return base.map((item) => {
      const monthlyGrossBalance = item.monthlyIncome - item.monthlyExpense;
      cumulativeBalance += monthlyGrossBalance;

      return {
        month: item.month,
        revenue: cumulativeBalance,
        expense: monthlyGrossBalance,
      };
    });
  }, [transactions, currentYear]);

  const { totalRevenue, previousRevenue } = useMemo(() => {
    const thisYear = MONTHS.map(() => ({ income: 0, expense: 0 }));
    const lastYear = MONTHS.map(() => ({ income: 0, expense: 0 }));

    transactions.forEach((transaction) => {
      const year = parseAppDate(transaction.date).getFullYear();
      const month = parseAppDate(transaction.date).getMonth();

      if (year === currentYear) {
        if (transaction.type === "Receita") {
          thisYear[month].income += Number(transaction.value);
        } else {
          thisYear[month].expense += Number(transaction.value);
        }
      }

      if (year === previousYear) {
        if (transaction.type === "Receita") {
          lastYear[month].income += Number(transaction.value);
        } else {
          lastYear[month].expense += Number(transaction.value);
        }
      }
    });

    let thisYearBalance = 0;
    let lastYearBalance = 0;

    for (let month = 0; month <= currentMonthIndex; month += 1) {
      thisYearBalance += thisYear[month].income - thisYear[month].expense;
      lastYearBalance += lastYear[month].income - lastYear[month].expense;
    }

    return { totalRevenue: thisYearBalance, previousRevenue: lastYearBalance };
  }, [transactions, currentMonthIndex, currentYear, previousYear]);

  const growth =
    previousRevenue > 0
      ? ((totalRevenue - previousRevenue) / previousRevenue) * 100
      : null;

  return (
    <section className="h-[420px] rounded-2xl border border-slate-800 bg-gradient-to-b from-[#07163b] to-[#060f2d] p-5 text-slate-100 shadow-sm md:p-6">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wider text-slate-300">
            Saldo acumulado
          </p>
          <div className="mt-1 flex items-center gap-2">
            <h3 className="text-2xl font-semibold text-white">
              {formatCurrency(totalRevenue)}
            </h3>
            {growth !== null && (
              <span
                className={`rounded px-1.5 py-0.5 text-[11px] font-medium ${
                  growth >= 0
                    ? "bg-emerald-500/20 text-emerald-300"
                    : "bg-rose-500/20 text-rose-300"
                }`}
              >
                {growth >= 0 ? "+" : ""}
                {growth.toFixed(1)}%
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs text-slate-300">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-violet-400" />
            Saldo acumulado
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-cyan-400" />
            Saldo bruto do mes
          </span>
          <span className="rounded border border-slate-700 px-2 py-1 text-[11px] text-slate-300">
            Jan {currentYear}
          </span>
        </div>
      </div>

      <div className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid stroke="#1f2d58" strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 12 }}
              dy={8}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 12 }}
              tickFormatter={(value) => `${Math.round(value / 1000)}K`}
              width={36}
            />
            <Tooltip
              contentStyle={{
                background: "#0b1738",
                border: "1px solid #223469",
                borderRadius: 10,
              }}
              labelStyle={{ color: "#e2e8f0" }}
              formatter={(value: number, name: string) => [
                formatCurrency(Number(value)),
                name === "revenue" ? "Saldo acumulado" : "Saldo bruto do mes",
              ]}
            />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#a855f7"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="expense"
              stroke="#22d3ee"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
};
