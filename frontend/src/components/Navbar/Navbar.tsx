import React from "react";

interface DashboardNavbarProps {
  onImport: () => void;
  onLogout: () => void;
}

export const DashboardNavbar: React.FC<DashboardNavbarProps> = ({
  onImport,
  onLogout,
}) => (
  <div className="sticky top-4 z-30 mb-8 md:top-6">
    <div className="rounded-2xl border border-slate-200/90 bg-white/90 px-4 py-4 shadow-sm backdrop-blur-md md:px-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 md:text-3xl">
            Finance Manager
          </h1>
          <p className="text-sm text-slate-600">
            Controle suas financas em um unico painel
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onImport}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-100"
          >
            Importar Excel
          </button>
          <button
            type="button"
            onClick={onLogout}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            Sair
          </button>
        </div>
      </div>
    </div>
  </div>
);
