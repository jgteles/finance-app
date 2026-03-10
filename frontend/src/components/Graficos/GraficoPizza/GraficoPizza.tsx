import React, { useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { formatCurrency } from "@/utils";


interface Transaction {
  category: string;
  value: number;
}

interface Props {
  transactions: Transaction[];
}

const COLORS = [
  "#0ea5e9",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#14b8a6",
  "#f97316",
  "#22c55e",
];

export const CategoryPieChart: React.FC<Props> = ({ transactions }) => {
  const data = useMemo(() => {
    const grouped: Record<string, number> = transactions.reduce((acc, t) => {
      const category = t.category?.trim() || "Sem categoria";
      acc[category] = (acc[category] || 0) + Number(t.value);
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(grouped)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  const total = useMemo(
    () => data.reduce((acc, item) => acc + item.value, 0),
    [data],
  );

  return (
    <div className="flex h-[420px] flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold mb-4 text-slate-800">
        Distribuição por Categoria
      </h3>

      {data.length === 0 ? (
        <div className="min-h-0 flex-1 flex items-center justify-center text-slate-400">
          Sem dados para exibir.
        </div>
      ) : (
        <div className="min-h-0 flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={105}
                paddingAngle={2}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${entry.name}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>

              <Tooltip
                formatter={(value: number) => formatCurrency(value)}
                contentStyle={{ borderRadius: 12, borderColor: "#e2e8f0" }}
              />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      <p className="mt-3 text-sm text-slate-500">Total: {formatCurrency(total)}</p>
    </div>
  );
};
