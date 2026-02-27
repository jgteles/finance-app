import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Transaction, TransactionType } from "@/types";
import { TRANSACTION_CATEGORIES } from "@/src/constants";

interface TransactionFormProps {
  onAdd: (transaction: Omit<Transaction, "id">) => void;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({ onAdd }) => {
  const [description, setDescription] = useState("");
  const [value, setValue] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [type, setType] = useState<TransactionType>("Despesa");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !value || !category || !date) return;

    onAdd({
      date,
      description,
      category,
      value: parseFloat(value),
      type,
    });

    setDescription("");
    setValue("");
    setCategory("");
  };

  return (
    <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-8">
      <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
        <Plus size={20} className="text-indigo-600" />
        Nova Transação
      </h3>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 items-end"
      >
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-500 uppercase">
            Data
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>
        <div className="md:col-span-2 space-y-1">
          <label className="text-[10px] font-bold text-slate-500 uppercase">
            Descrição
          </label>
          <input
            type="text"
            placeholder="Ex: Assinatura Netflix"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-500 uppercase">
            Categoria
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            <option value="">Selecione uma categoria</option>
            {TRANSACTION_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-500 uppercase">
            Valor (R$)
          </label>
          <input
            type="number"
            step="0.01"
            placeholder="0,00"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>
        <div className="space-y-1 flex flex-col">
          <label className="text-[10px] font-bold text-slate-500 uppercase mb-1">
            Tipo
          </label>
          <div className="flex bg-slate-100 p-1 rounded-lg">
            <button
              type="button"
              onClick={() => setType("Receita")}
              className={`flex-1 text-[10px] py-1.5 rounded-md transition-all ${type === "Receita" ? "bg-white shadow-sm text-emerald-600 font-bold" : "text-slate-500 font-medium"}`}
            >
              Receita
            </button>
            <button
              type="button"
              onClick={() => setType("Despesa")}
              className={`flex-1 text-[10px] py-1.5 rounded-md transition-all ${type === "Despesa" ? "bg-white shadow-sm text-rose-600 font-bold" : "text-slate-500 font-medium"}`}
            >
              Despesa
            </button>
          </div>
        </div>
        <div className="lg:col-start-6">
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-lg font-bold text-sm hover:bg-indigo-700 transition-shadow shadow-md hover:shadow-lg flex items-center justify-center gap-2"
          >
            <Plus size={18} />
            Adicionar
          </button>
        </div>
      </form>
    </section>
  );
};
