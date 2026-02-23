import React from "react";
import { FileUp, BrainCircuit } from "lucide-react";

interface HeaderProps {
  onImport: () => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onImport,
  onAnalyze,
  isAnalyzing,
}) => (
  <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
    <div>
      <h1 className="text-3xl font-bold text-indigo-900 font-sans">
        Finance Manager
      </h1>
      <p className="text-slate-500">Controle suas finanças com suporte a IA</p>
    </div>
    <div className="flex gap-2">
      <button
        onClick={onImport}
        className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
      >
        <FileUp size={18} className="text-indigo-600" />
        <span className="font-medium text-sm">Importar Excel</span>
      </button>
    </div>
  </header>
);
