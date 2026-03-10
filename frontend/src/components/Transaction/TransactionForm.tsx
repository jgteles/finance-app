import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Transaction, TransactionType } from "@/types";
import { TRANSACTION_CATEGORIES } from "@/src/constants";
import { toDateInputValue } from "@/utils";
import "./TransactionForm.css";

interface TransactionFormProps {
  onAdd: (transaction: Omit<Transaction, "id">) => void;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({ onAdd }) => {
  const [description, setDescription] = useState("");
  const [value, setValue] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState(toDateInputValue());
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

  const receitaTone =
    type === "Receita"
      ? "transactionForm__typeBtn--active transactionForm__typeBtn--income"
      : "transactionForm__typeBtn--inactive";

  const despesaTone =
    type === "Despesa"
      ? "transactionForm__typeBtn--active transactionForm__typeBtn--expense"
      : "transactionForm__typeBtn--inactive";

  return (
    <section className="transactionForm__card">
      <h3 className="transactionForm__title">
        <Plus size={20} className="transactionForm__titleIcon" />
        Nova Transação
      </h3>
      <form onSubmit={handleSubmit} className="transactionForm__grid">
        <div className="transactionForm__field">
          <label className="transactionForm__label">Data</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="transactionForm__control"
          />
        </div>

        <div className="transactionForm__field transactionForm__field--description">
          <label className="transactionForm__label">Descrição</label>
          <input
            type="text"
            placeholder="Ex: Assinatura Netflix"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="transactionForm__control"
          />
        </div>

        <div className="transactionForm__field">
          <label className="transactionForm__label">Categoria</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="transactionForm__control"
          >
            <option value="">Selecione uma categoria</option>
            {TRANSACTION_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="transactionForm__field">
          <label className="transactionForm__label">Valor (R$)</label>
          <input
            type="number"
            step="0.01"
            placeholder="0,00"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="transactionForm__control"
          />
        </div>

        <div className="transactionForm__field transactionForm__field--type">
          <label className="transactionForm__label transactionForm__label--spaced">
            Tipo
          </label>
          <div className="transactionForm__typeGroup">
            <button
              type="button"
              onClick={() => setType("Receita")}
              className={`transactionForm__typeBtn ${receitaTone}`}
            >
              Receita
            </button>
            <button
              type="button"
              onClick={() => setType("Despesa")}
              className={`transactionForm__typeBtn ${despesaTone}`}
            >
              Despesa
            </button>
          </div>
        </div>

        <div className="transactionForm__submitCell">
          <button type="submit" className="transactionForm__submitBtn">
            <Plus size={18} />
            Adicionar
          </button>
        </div>
      </form>
    </section>
  );
};
