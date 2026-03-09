import React, { useMemo } from "react";
import { parseAppDate } from "@/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface Transaction {
  date: string;
  type: "Receita" | "Despesa";
  value: number;
}

interface Props {
  transactions: Transaction[];
}

export const MonthlyChart: React.FC<Props> = ({ transactions }) => {
  const currentYear = new Date().getFullYear();

  const data = useMemo(() => {
    const months = [
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

    // Criar estrutura inicial com 12 meses zerados
    const monthlyData = months.map((month, index) => ({
      month,
      monthIndex: index,
      Receita: 0,
      Despesa: 0,
    }));

    transactions.forEach((t) => {
      const date = parseAppDate(t.date);

      if (date.getFullYear() === currentYear) {
        const monthIndex = date.getMonth();

        if (t.type === "Receita") {
          monthlyData[monthIndex].Receita += Number(t.value);
        } else {
          monthlyData[monthIndex].Despesa += Number(t.value);
        }
      }
    });

    return monthlyData.map((item) => ({
      ...item,
      saldo: item.Receita - item.Despesa,
    }));
  }, [transactions, currentYear]);

  return (
    <div className="flex h-[420px] flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold mb-4 text-slate-800">
        Desempenho Anual {currentYear}
      </h3>

      <div className="min-h-0 flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />

            {/* RECEITA */}
            <Bar dataKey="Receita" fill="#10b981" radius={[6, 6, 0, 0]} />

            {/* Despesa */}
            <Bar dataKey="Despesa" fill="#ef4444" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
