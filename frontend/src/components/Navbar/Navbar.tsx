import React from "react";
import "./Navbar.css";

interface DashboardNavbarProps {
  onImport: () => void;
  onLogout: () => void;
}

export const DashboardNavbar: React.FC<DashboardNavbarProps> = ({
  onImport,
  onLogout,
}) => (
  <div className="navbar__sticky">
    <div className="navbar__shell">
      <div className="navbar__layout">
        <div className="navbar__brand">
          <h1 className="navbar__title">Finance Manager</h1>
          <p className="navbar__subtitle">
            Controle suas financas em um unico painel
          </p>
        </div>

        <div className="navbar__actions">
          <button
            type="button"
            onClick={onImport}
            className="navbar__button navbar__button--secondary"
          >
            Importar Excel
          </button>
          <button
            type="button"
            onClick={onLogout}
            className="navbar__button navbar__button--primary"
          >
            Sair
          </button>
        </div>
      </div>
    </div>
  </div>
);
