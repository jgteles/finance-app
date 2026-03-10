import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTransactions } from "@/src/hooks/useTransactions";
import { uploadExcel } from "@/src/services/excelService";
import { DashboardNavbar } from "@/src/components/Navbar/Navbar";
import { TransactionForm } from "@/src/components/Transaction/TransactionForm";
import { TransactionTable } from "@/src/components/Transaction/TransactionTable";
import { useLogin } from "@/src/context/LoginContext";
import { parseAppDate } from "@/utils";
import "./Transacoes.css";

export default function Dashboard() {
  const navigate = useNavigate();
  const { logout } = useLogin();

  const { transactions, addTransaction, removeTransaction } = useTransactions();

  const openFileSelector = () => {
    document.getElementById("excel-upload")?.click();
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const result = await uploadExcel(file);
      alert(result.message);
    } catch (error: any) {
      alert(error.message);
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
      startDate === "" || parseAppDate(t.date) >= parseAppDate(startDate);

    const matchEndDate =
      endDate === "" || parseAppDate(t.date) <= parseAppDate(endDate);

    return matchType && matchCategory && matchStartDate && matchEndDate;
  });

  const categories = [...new Set(transactions.map((t) => t.category))];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="transacoesPage__root">
      <div className="transacoesPage__container">
        <DashboardNavbar onImport={openFileSelector} onLogout={handleLogout} />

        <input
          id="excel-upload"
          type="file"
          accept=".xlsx, .xls"
          onChange={handleImport}
          className="transacoesPage__fileInput"
        />

        <div className="transacoesPage__tabs">
          <button
            type="button"
            className="transacoesPage__tab transacoesPage__tab--active"
          >
            TransaÃ§Ãµes
          </button>
          <button
            type="button"
            onClick={() => navigate("/dashboard/analytics")}
            className="transacoesPage__tab transacoesPage__tab--inactive"
          >
            Dashboard
          </button>
        </div>

        <TransactionForm onAdd={addTransaction} />

        <div className="transacoesPage__table">
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
        </div>
      </div>
    </div>
  );
}
