import React from "react";
import { Wallet, TrendingUp, TrendingDown } from "lucide-react";
import { Totals } from "@/types";
import { formatCurrency } from "../../utils";

interface SummaryCardsProps {
  totals: Totals;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ totals }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
      <div>
        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">
          Saldo Atual
        </p>
        <h2
          className={`text-2xl font-bold mt-1 ${totals.balance >= 0 ? "text-slate-900" : "text-red-600"}`}
        >
          {formatCurrency(totals.balance)}
        </h2>
      </div>
      <div className="bg-slate-100 p-3 rounded-xl text-slate-600">
        <Wallet size={24} />
      </div>
    </div>

    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
      <div>
        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">
          Receitas
        </p>
        <h2 className="text-2xl font-bold mt-1 text-emerald-600">
          {formatCurrency(totals.income)}
        </h2>
      </div>
      <div className="bg-emerald-50 p-3 rounded-xl text-emerald-600">
        <TrendingUp size={24} />
      </div>
    </div>

    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
      <div>
        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">
          Despesas
        </p>
        <h2 className="text-2xl font-bold mt-1 text-rose-600">
          {formatCurrency(totals.expense)}
        </h2>
      </div>
      <div className="bg-rose-50 p-3 rounded-xl text-rose-600">
        <TrendingDown size={24} />
      </div>
    </div>
  </div>
);
