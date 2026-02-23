import React, { useState } from "react";
import { Filter, Download, Calendar, Tag, Trash2, X } from "lucide-react";
import { Transaction } from "@/types";
import { formatCurrency, formatDate } from "../../utils";

interface TransactionTableProps {
  transactions: Transaction[];
  onDelete: (id: number) => void;
  selectedType?: string;
  onTypeChange?: (value: string) => void;
  selectedCategory?: string;
  onCategoryChange?: (value: string) => void;
  startDate?: string;
  onStartDateChange?: (value: string) => void;
  endDate?: string;
  onEndDateChange?: (value: string) => void;
  categories?: string[];
}

export const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  onDelete,
  selectedType = "",
  onTypeChange,
  selectedCategory = "",
  onCategoryChange,
  startDate = "",
  onStartDateChange,
  endDate = "",
  onEndDateChange,
  categories = [],
}) => {
  const [showFilters, setShowFilters] = useState(false);

  const handleClearFilters = () => {
    onTypeChange?.("");
    onCategoryChange?.("");
    onStartDateChange?.("");
    onEndDateChange?.("");
  };
  const handleExport = async () => {
    try {
      const response = await fetch(
        "http://localhost:8000/api/export-filtered-excel/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ transactions }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.error || "Erro ao exportar Excel");
        return;
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "transacoes.xlsx";
      a.click();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert("Erro ao conectar com o servidor.");
    }
  };

  return (
    <section className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <h3 className="text-lg font-bold text-slate-800">
          Transações Recentes
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-lg transition-all"
          >
            <Filter size={20} />
          </button>
          <button
            onClick={handleExport}
            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-lg transition-all"
          >
            <Download size={20} />
          </button>
        </div>
      </div>

      {/* 🔹 FILTROS */}
      {showFilters && (
        <div className="flex flex-wrap gap-3 p-4 bg-slate-50/50 border-b border-slate-100 items-center">
          <select
            value={selectedType}
            onChange={(e) => onTypeChange?.(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            <option value="">Todos os tipos</option>
            <option value="Receita">Receita</option>
            <option value="Despesa">Despesa</option>
          </select>

          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange?.(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            <option value="">Todas categorias</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <input
            type="date"
            value={startDate}
            onChange={(e) => onStartDateChange?.(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          />

          <input
            type="date"
            value={endDate}
            onChange={(e) => onEndDateChange?.(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          />

          <button
            onClick={handleClearFilters}
            className="ml-auto px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium rounded text-sm transition-all flex items-center gap-1"
          >
            <X size={16} />
            Limpar Filtros
          </button>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Data
              </th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Descrição
              </th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Categoria
              </th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Valor
              </th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Tipo
              </th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center">
                Ação
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {transactions.length > 0 ? (
              transactions.map((t) => (
                <tr
                  key={t.id}
                  className="hover:bg-slate-50/50 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-slate-600 text-sm">
                      <Calendar size={14} className="text-slate-400" />
                      {formatDate(t.date)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-semibold text-slate-700">
                      {t.description}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 bg-slate-100 w-fit px-2 py-1 rounded-full text-[9px] font-bold text-slate-500 uppercase tracking-tight">
                      <Tag size={10} />
                      {t.category}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-sm font-bold ${t.type === "Receita" ? "text-emerald-600" : "text-rose-600"}`}
                    >
                      {t.type === "Despesa" && "- "}
                      {formatCurrency(t.value)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-md ${
                        t.type === "Receita"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-rose-100 text-rose-700"
                      }`}
                    >
                      {t.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => onDelete(t.id)}
                      className="p-2 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                      title="Excluir"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-12 text-center text-slate-400 text-sm italic"
                >
                  Nenhuma transação registrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase tracking-wider">
        <span>{transactions.length} registros encontrados</span>
        <div className="flex gap-4">
          <span className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> RECEITAs
          </span>
          <span className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-rose-500" /> Despesas
          </span>
        </div>
      </div>
    </section>
  );
};
