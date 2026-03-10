import React from "react";
import { Wallet, TrendingUp, TrendingDown } from "lucide-react";
import { Totals } from "@/types";
import { formatCurrency } from "@/utils";
import "./SummaryCards.css";

interface SummaryCardsProps {
  totals: Totals;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ totals }) => {
  const balanceTone =
    totals.balance >= 0 ? "summaryCards__value--neutral" : "summaryCards__value--negative";

  return (
    <div className="summaryCards__grid">
      <div className="summaryCards__card">
        <div>
          <p className="summaryCards__label">Saldo Atual</p>
          <h2 className={`summaryCards__value ${balanceTone}`}>
            {formatCurrency(totals.balance)}
          </h2>
        </div>
        <div className="summaryCards__icon summaryCards__icon--wallet">
          <Wallet size={24} />
        </div>
      </div>

      <div className="summaryCards__card">
        <div>
          <p className="summaryCards__label">Receitas</p>
          <h2 className="summaryCards__value summaryCards__value--income">
            {formatCurrency(totals.income)}
          </h2>
        </div>
        <div className="summaryCards__icon summaryCards__icon--income">
          <TrendingUp size={24} />
        </div>
      </div>

      <div className="summaryCards__card">
        <div>
          <p className="summaryCards__label">Despesas</p>
          <h2 className="summaryCards__value summaryCards__value--expense">
            {formatCurrency(totals.expense)}
          </h2>
        </div>
        <div className="summaryCards__icon summaryCards__icon--expense">
          <TrendingDown size={24} />
        </div>
      </div>
    </div>
  );
};
