import React from "react";
import { FileUp, BrainCircuit } from "lucide-react";
import "./Header.css";

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
  <header className="header__root">
    <div className="header__brand">
      <h1 className="header__title">Finance Manager</h1>
      <p className="header__subtitle">Controle suas finanÃ§as com suporte a IA</p>
    </div>

    <div className="header__actions">
      <button onClick={onImport} className="header__button">
        <FileUp size={18} className="header__buttonIcon" />
        <span className="header__buttonText">Importar Excel</span>
      </button>
    </div>
  </header>
);
