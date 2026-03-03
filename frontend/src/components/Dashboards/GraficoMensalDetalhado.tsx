import React, { useMemo } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { parseAppDate } from "@/utils";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
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

// 🔹 Nosso Tooltip Customizado
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    // Pegamos todos os dados do dia atual que estamos passando o mouse
    const dadosDoDia = payload[0].payload; 

    return (
      <div className="bg-white/95 border border-slate-200 p-4 rounded-xl shadow-md">
        <p className="font-bold text-slate-700 mb-2 border-b pb-1">Dia {label}</p>
        
        <div className="flex flex-col gap-1">
          <p className="text-slate-600 text-sm flex justify-between gap-4">
            <span>Saldo do Dia:</span>
            <span className="font-semibold text-blue-600">
              R$ {dadosDoDia.saldoAcumulado.toFixed(2)}
            </span>
          </p>
          
          <p className="text-slate-600 text-sm flex justify-between gap-4">
            <span>Movimentação:</span>
            <span className={`font-semibold ${dadosDoDia.movimentacaoLiquida >= 0 ? "text-green-600" : "text-red-600"}`}>
              {dadosDoDia.movimentacaoLiquida >= 0 ? "+" : ""}
              R$ {dadosDoDia.movimentacaoLiquida.toFixed(2)}
            </span>
          </p>
        </div>
      </div>
    );
  }
  return null;
};

export const MonthlyDetailedChart: React.FC<Props> = ({
  transactions,
  selectedMonth,
  onMonthChange,
}) => {
  // 🔹 Os dados já vêm filtrados pelo mês, apenas ordenar
  const monthTransactions = useMemo(() => {
    return [...transactions].sort(
      (a, b) => parseAppDate(a.date).getTime() - parseAppDate(b.date).getTime(),
    );
  }, [transactions]);

  // 🔹 Agrupar dados por DIA
  const dailyData = useMemo(() => {
    const groupedByDay: Record<number, any> = {};

    monthTransactions.forEach((t) => {
      const day = parseAppDate(t.date).getDate();

      if (!groupedByDay[day]) {
        groupedByDay[day] = { day, movimentacaoLiquida: 0 };
      }

      const value = Number(t.value);
      if (t.type === "Receita") {
        groupedByDay[day].movimentacaoLiquida += value;
      } else {
        groupedByDay[day].movimentacaoLiquida -= value;
      }
    });

    const sortedDays = Object.values(groupedByDay).sort((a: any, b: any) => a.day - b.day);
    let saldoAcumulado = 0;

   return sortedDays.map((d: any) => {
      saldoAcumulado += d.movimentacaoLiquida;

      return {
        day: d.day,
        movimentacaoLiquida: d.movimentacaoLiquida,
        saldoAcumulado,
        saldoPositivo: saldoAcumulado >= 0 ? saldoAcumulado : 0,
        saldoNegativo: saldoAcumulado < 0 ? saldoAcumulado : 0,
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h3 className="text-lg font-semibold text-slate-800">
          Evolução do Saldo
        </h3>

        <div className="flex gap-3">
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => onMonthChange(e.target.value)}
            className="border border-slate-300 text-slate-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <button
            onClick={exportMonthToExcel}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            Exportar mês
          </button>
        </div>
      </div>

      <div className="w-full h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={dailyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              
              <linearGradient id="colorSaldoPos" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#10b9818f" stopOpacity={0} />
              </linearGradient>

              <linearGradient id="colorSaldoNeg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />

            <XAxis 
              dataKey="day" 
              tickFormatter={(val) => `${val}`} 
              tick={{ fontSize: 12, fill: '#64748b' }}
              axisLine={false}
              tickLine={false}
              dy={10}
            />
            <YAxis 
              tickFormatter={(val) => `R$ ${val}`} 
              tick={{ fontSize: 12, fill: '#64748b' }}
              axisLine={false}
              tickLine={false}
              dx={-10}
            />

            {/* Injetando nosso Tooltip Customizado aqui */}
            <Tooltip content={<CustomTooltip />} />

            {/* Linha ondulada do Saldo (monotone = ondulado) */}
              {/* Área Positiva */}
              <Area
                type="monotone"
                dataKey="saldoPositivo"
                stroke="#10B981"
                strokeWidth={3}
                fill="url(#colorSaldoPos)"
                dot={false}
                activeDot={{ r: 0 }}
              />

              {/* Área Negativa */}
              <Area
                type="monotone"
                dataKey="saldoNegativo"
                stroke="#ef4444"
                strokeWidth={3}
                fill="url(#colorSaldoNeg)"
                dot={false}
                activeDot={{ r: 0 }}
              />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

