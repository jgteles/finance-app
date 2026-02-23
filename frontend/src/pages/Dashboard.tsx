import React, { useState } from "react";
import { Info } from "lucide-react";
import { useTransactions } from "@/src/hooks/useTransactions";
import { analyzeTransactions } from "@/src/services/aiService";
import { uploadExcel } from "@/src/services/excelService";
import { MonthlyChart } from "@/components/Dashboards/GraficoMensal";
import { Header } from "@/components/Header/Header";
import { SummaryCards } from "@/components/SummaryCards/SummaryCards";
import { AiInsight } from "@/components/AI/AiInsight";
import { TransactionForm } from "@/components/Transaction/TransactionForm";
import { TransactionTable } from "@/components/Transaction/TransactionTable";
import { MonthlyDetailedChart } from "@/components/Dashboards/GraficoMensalDetalhado";

export default function Dashboard() {
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7), // YYYY-MM
  );

  // 🔹 Hook principal de transações
  const { transactions, totals, addTransaction, removeTransaction } =
    useTransactions();

  

  // =========================
  // 📂 Abrir seletor de arquivo
  // =========================
  const openFileSelector = () => {
    document.getElementById("excel-upload")?.click();
  };

  // =========================
  // 📊 Processar Excel
  // =========================
  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const result = await uploadExcel(file);
      alert(result.message); // sucesso
    } catch (error: any) {
      alert(error.message); // erro real do backend
    }
  };

  const [selectedType, setSelectedType] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const filteredTransactions = transactions.filter((t) => {
    const matchType = selectedType === "" || t.type === selectedType;

    const matchCategory =
      selectedCategory === "" || t.category === selectedCategory;

    const matchStartDate =
      startDate === "" || new Date(t.date) >= new Date(startDate);

    const matchEndDate =
      endDate === "" || new Date(t.date) <= new Date(endDate);

    return matchType && matchCategory && matchStartDate && matchEndDate;
  });

  const monthTransactions = filteredTransactions.filter((t) => {
    const date = new Date(t.date);
    const formatted = date.toISOString().slice(0, 7);
    return formatted === selectedMonth;
  });

  const categories = [...new Set(transactions.map((t) => t.category))];

  // =========================
  // 🤖 Análise IA
  // =========================
  const filteredTotals = filteredTransactions.reduce(
    (acc, t) => {
      if (t.type === "Receita") {
        acc.income += Number(t.value);
      } else if (t.type === "Despesa") {
        acc.expense += Number(t.value);
      }
      return acc;
    },
    { income: 0, expense: 0 },
  );

  filteredTotals.balance = filteredTotals.income - filteredTotals.expense;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* 🔹 HEADER */}
        <Header
          onImport={openFileSelector}
        />

        {/* 🔹 INPUT ESCONDIDO PARA EXCEL */}
        <input
          id="excel-upload"
          type="file"
          accept=".xlsx, .xls"
          onChange={handleImport}
          className="hidden"
        />


        {/* 🔹 RESUMO */}
        <SummaryCards totals={filteredTotals} />

        {/* 🔹 FORMULÁRIO */}
        <TransactionForm onAdd={addTransaction} />

        {/* 🔹 TABELA */}
        <TransactionTable
          transactions={filteredTransactions}
          onDelete={removeTransaction}
          selectedType={selectedType}
          onTypeChange={setSelectedType}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          startDate={startDate}
          onStartDateChange={setStartDate}
          endDate={endDate}
          onEndDateChange={setEndDate}
          categories={categories}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 h-[400px]">
          <MonthlyDetailedChart 
            transactions={monthTransactions} 
            selectedMonth={selectedMonth}
            onMonthChange={setSelectedMonth}
          />
          <MonthlyChart transactions={transactions} />

          {/* Espaço futuro */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center justify-center text-slate-400">
            Espaço para novo gráfico
          </div>

          {/* Espaço futuro */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center justify-center text-slate-400">
            Espaço para novo gráfico
          </div>
        </div>
      </div>
    </div>
  );
}
