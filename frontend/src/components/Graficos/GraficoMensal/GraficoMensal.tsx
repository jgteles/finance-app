import React, { useMemo } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { parseAppDate } from "@/utils";
import "./GraficoMensal.css";

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

// ðŸ”¹ Nosso Tooltip Customizado
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    // Pegamos todos os dados do dia atual que estamos passando o mouse
    const dadosDoDia = payload[0].payload;

    return (
      <div className="graficoMensal__tooltip">
        <p className="graficoMensal__tooltipTitle">Dia {label}</p>

        <div className="graficoMensal__tooltipRows">
          <p className="graficoMensal__tooltipRow">
            <span>Saldo do Dia:</span>
            <span className="graficoMensal__tooltipValue graficoMensal__tooltipValue--info">
              R$ {dadosDoDia.saldoAcumulado.toFixed(2)}
            </span>
          </p>

          <p className="graficoMensal__tooltipRow">
            <span>Movimentação:</span>
            <span
              className={`graficoMensal__tooltipValue ${
                dadosDoDia.movimentacaoLiquida >= 0
                  ? "graficoMensal__tooltipValue--positive"
                  : "graficoMensal__tooltipValue--negative"
              }`}
            >
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
  // ðŸ”¹ Os dados jÃ¡ vÃªm filtrados pelo mÃªs, apenas ordenar
  const monthTransactions = useMemo(() => {
    return [...transactions].sort(
      (a, b) =>
        parseAppDate(a.date).getTime() - parseAppDate(b.date).getTime(),
    );
  }, [transactions]);

  // ðŸ”¹ Agrupar dados por DIA
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

    const sortedDays = Object.values(groupedByDay).sort(
      (a: any, b: any) => a.day - b.day,
    );
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

  // ðŸ”¹ Exportar Excel
  const exportMonthToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(monthTransactions);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "MÃªs");

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
    <div className="graficoMensal__container">
      <div className="graficoMensal__header">
        <h3 className="graficoMensal__title">Evolução do Saldo</h3>

        <div className="graficoMensal__controls">
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => onMonthChange(e.target.value)}
            className="graficoMensal__monthInput"
          />

          <button onClick={exportMonthToExcel} className="graficoMensal__exportBtn">
            Exportar Excel
          </button>
        </div>
      </div>

      <div className="graficoMensal__chartWrap">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={dailyData}
            margin={{ top: 10, right: 8, left: 8, bottom: 0 }}
          >
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

            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#e2e8f0"
            />

            <XAxis
              dataKey="day"
              tickFormatter={(val) => `${val}`}
              tick={{ fontSize: 12, fill: "#64748b" }}
              axisLine={false}
              tickLine={false}
              dy={10}
            />
            <YAxis
              tickFormatter={(val) => `R$ ${val}`}
              tick={{ fontSize: 12, fill: "#64748b" }}
              axisLine={false}
              tickLine={false}
              width={72}
            />

            {/* Injetando nosso Tooltip Customizado aqui */}
            <Tooltip content={<CustomTooltip />} />

            {/* Linha ondulada do Saldo (monotone = ondulado) */}
            {/* Ãrea Positiva */}
            <Area
              type="monotone"
              dataKey="saldoPositivo"
              stroke="#10B981"
              strokeWidth={3}
              fill="url(#colorSaldoPos)"
              dot={false}
              activeDot={{ r: 0 }}
            />

            {/* Ãrea Negativa */}
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
