import React, { useMemo, useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

interface Transaction {
  date: string;
  type: "Receita" | "Despesa";
  value: number;
}

interface Props {
  transactions: Transaction[];
  selectedMonth: string;
  onMonthChange: (month: string) => void;
}

export const MonthlyDetailedChart: React.FC<Props> = ({
  transactions,
  selectedMonth,
  onMonthChange,
}) => {
  // 🔹 Os dados já vêm filtrados pelo mês, apenas ordenar
  const monthTransactions = useMemo(() => {
    return transactions.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );
  }, [transactions]);

  // 🔹 Construir dados acumulados por dia
  const dailyData = useMemo(() => {
    let accumulatedIncome = 0;
    let accumulatedExpense = 0;

    return monthTransactions.map((t) => {
      if (t.type === "Receita") {
        accumulatedIncome += Number(t.value);
      } else {
        accumulatedExpense += Number(t.value);
      }

      return {
        day: new Date(t.date).getDate(),
        receita: accumulatedIncome,
        despesa: accumulatedExpense,
        saldo: accumulatedIncome - accumulatedExpense,
      };
    });
  }, [monthTransactions]);

  // 🔹 Exportar Excel
  const exportMonthToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(monthTransactions);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Mês");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const file = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });

    saveAs(file, `transacoes-${selectedMonth}.xlsx`);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <h3 className="text-lg font-semibold mb-4 text-slate-800">
        Evolução Detalhada do Mês
      </h3>

      <div className="flex gap-4 mb-4">
        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => onMonthChange(e.target.value)}
          className="border rounded-lg px-3 py-2"
        />

        <button
          onClick={exportMonthToExcel}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
        >
          Exportar mês
        </button>
      </div>

      <div className="w-full h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={dailyData}>
            <defs>
              <linearGradient id="colorReceita" x1="0" y1="0" x2="0" y2="1">
                <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
              </linearGradient>

              <linearGradient id="colorDespesa" x1="0" y1="0" x2="0" y2="1">
                <stop offset="95%" stopColor="#dc2626" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="day" />
            <YAxis />

            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                padding: "8px 12px",
              }}
              cursor={{ fill: "rgba(99, 102, 241, 0.1)" }}
            />
            <Legend />

            <Area
              type="monotone"
              dataKey="receita"
              stroke="#16a34a"
              fillOpacity={1}
              fill="url(#colorReceita)"
            />

            <Area
              type="monotone"
              dataKey="despesa"
              stroke="#dc2626"
              fillOpacity={1}
              fill="url(#colorDespesa)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
