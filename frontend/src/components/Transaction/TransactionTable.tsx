import React, { useEffect, useState } from "react";
import { Filter, Download, Calendar, Tag, Trash2, X, Pencil, Check } from "lucide-react";
import { Transaction } from "@/types";
import { TRANSACTION_CATEGORIES } from "@/src/constants";
import { formatCurrency, formatDate, parseAppDate } from "@/utils";
import "./TransactionTable.css";

interface TransactionTableProps {
  transactions: Transaction[];
  onDelete: (id: number) => void | Promise<void>;
  onUpdate?: (id: number, data: Omit<Transaction, "id">) => void | Promise<void>;
  selectedType?: string;
  onTypeChange?: (value: string) => void;
  selectedCategory?: string;
  onCategoryChange?: (value: string) => void;
  startDate?: string;
  onStartDateChange?: (value: string) => void;
  endDate?: string;
  onEndDateChange?: (value: string) => void;
  categories?: string[];
}

export const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  onDelete,
  onUpdate,
  selectedType = "",
  onTypeChange,
  selectedCategory = "",
  onCategoryChange,
  startDate = "",
  onStartDateChange,
  endDate = "",
  onEndDateChange,
  categories = [],
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editDraft, setEditDraft] = useState<{
    date: string;
    description: string;
    category: string;
    value: string;
    type: Transaction["type"];
  }>({
    date: "",
    description: "",
    category: "",
    value: "",
    type: "Despesa",
  });
  const itemsPerPage = 12;

  const sortedTransactions = [...transactions].sort((a, b) => {
    const dateA = parseAppDate(a.date).getTime();
    const dateB = parseAppDate(b.date).getTime();
    return dateB - dateA;
  });

  const editCategories = Array.from(
    new Set([...TRANSACTION_CATEGORIES, ...categories]),
  );

  const totalPages = Math.ceil(sortedTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedTransactions = sortedTransactions.slice(startIndex, endIndex);

  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPages]);

  const handleClearFilters = () => {
    onTypeChange?.("");
    onCategoryChange?.("");
    onStartDateChange?.("");
    onEndDateChange?.("");
  };

  const handleStartEdit = (t: Transaction) => {
    setEditingId(t.id);
    setEditDraft({
      date: t.date,
      description: t.description,
      category: t.category,
      value: String(t.value),
      type: t.type,
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditDraft({
      date: "",
      description: "",
      category: "",
      value: "",
      type: "Despesa",
    });
  };

  const handleSaveEdit = async () => {
    if (editingId == null || !onUpdate) return;

    if (
      !editDraft.date ||
      !editDraft.description ||
      !editDraft.category ||
      !editDraft.value
    ) {
      alert("Preencha todos os campos para salvar.");
      return;
    }

    const parsedValue = Number(editDraft.value);
    if (Number.isNaN(parsedValue)) {
      alert("Valor invÃ¡lido.");
      return;
    }

    try {
      await onUpdate(editingId, {
        date: editDraft.date,
        description: editDraft.description,
        category: editDraft.category,
        value: parsedValue,
        type: editDraft.type,
      });

      handleCancelEdit();
    } catch (err) {
      alert("NÃ£o foi possÃ­vel salvar a transaÃ§Ã£o.");
    }
  };

  const handleExport = async () => {
    try {
      const response = await fetch(
        "http://localhost:8000/api/export-filtered-excel/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ transactions }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.error || "Erro ao exportar Excel");
        return;
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "transacoes.xlsx";
      a.click();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert("Erro ao conectar com o servidor.");
    }
  };

  const filterPanelTone = showFilters
    ? "transactionTable__filters--open"
    : "transactionTable__filters--closed";

  const filterRailTone = showFilters
    ? "transactionTable__filtersRail--open"
    : "transactionTable__filtersRail--closed";

  const shouldPaginate = totalPages > 1;

  return (
    <section className="transactionTable__card">
      <div className="transactionTable__header">
        <h3 className="transactionTable__title">Transações Recentes</h3>
        <div className="transactionTable__headerActions">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="transactionTable__iconBtn"
            aria-label="Filtros"
          >
            <Filter size={20} />
          </button>
          <button
            onClick={handleExport}
            className="transactionTable__iconBtn"
            aria-label="Exportar"
          >
            <Download size={20} />
          </button>
        </div>
      </div>

      {/* FILTROS */}
      <div className={`transactionTable__filters ${filterPanelTone}`}>
        <div className={`transactionTable__filtersRail ${filterRailTone}`}>
          <select
            value={selectedType}
            onChange={(e) => onTypeChange?.(e.target.value)}
            className="transactionTable__filterControl"
          >
            <option value="">Todos os tipos</option>
            <option value="Receita">Receita</option>
            <option value="Despesa">Despesa</option>
          </select>

          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange?.(e.target.value)}
            className="transactionTable__filterControl"
          >
            <option value="">Todas categorias</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <div className="transactionTable__dateControl">
            <Calendar size={14} className="transactionTable__dateIcon" />
            <input
              type="date"
              value={startDate}
              onChange={(e) => onStartDateChange?.(e.target.value)}
              className="transactionTable__dateInput"
              placeholder="Data inicial"
            />
          </div>

          <div className="transactionTable__dateControl">
            <Calendar size={14} className="transactionTable__dateIcon" />
            <input
              type="date"
              value={endDate}
              onChange={(e) => onEndDateChange?.(e.target.value)}
              className="transactionTable__dateInput"
              placeholder="Data final"
            />
          </div>

          <button
            type="button"
            onClick={handleClearFilters}
            className="transactionTable__clearBtn"
          >
            <X size={16} />
            Limpar
          </button>
        </div>
      </div>

      <div className="transactionTable__tableWrap">
        <table className="transactionTable__table">
          <thead className="transactionTable__thead">
            <tr className="transactionTable__theadRow">
              <th className="transactionTable__th">Data</th>
              <th className="transactionTable__th">Descrição</th>
              <th className="transactionTable__th">Categoria</th>
              <th className="transactionTable__th">Valor</th>
              <th className="transactionTable__th">Tipo</th>
              <th className="transactionTable__th transactionTable__th--center">
                Ações
              </th>
            </tr>
          </thead>

          <tbody className="transactionTable__tbody">
            {displayedTransactions.length > 0 ? (
              displayedTransactions.map((t) => {
                const valueTone =
                  t.type === "Receita"
                    ? "transactionTable__value--income"
                    : "transactionTable__value--expense";
                const typeTone =
                  t.type === "Receita"
                    ? "transactionTable__typeBadge--income"
                    : "transactionTable__typeBadge--expense";

                return (
                  <tr key={t.id} className="transactionTable__row">
                    <td className="transactionTable__td">
                      {editingId === t.id ? (
                        <input
                          type="date"
                          value={editDraft.date}
                          onChange={(e) =>
                            setEditDraft((prev) => ({ ...prev, date: e.target.value }))
                          }
                          className="transactionTable__editControl"
                        />
                      ) : (
                        <div className="transactionTable__dateCell">
                          <Calendar
                            size={14}
                            className="transactionTable__dateCellIcon"
                          />
                          {formatDate(t.date)}
                        </div>
                      )}
                    </td>
                    <td className="transactionTable__td">
                      {editingId === t.id ? (
                        <input
                          type="text"
                          value={editDraft.description}
                          onChange={(e) =>
                            setEditDraft((prev) => ({
                              ...prev,
                              description: e.target.value,
                            }))
                          }
                          className="transactionTable__editControl"
                        />
                      ) : (
                        <span className="transactionTable__description">
                          {t.description}
                        </span>
                      )}
                    </td>
                    <td className="transactionTable__td">
                      {editingId === t.id ? (
                        <select
                          value={editDraft.category}
                          onChange={(e) =>
                            setEditDraft((prev) => ({
                              ...prev,
                              category: e.target.value,
                            }))
                          }
                          className="transactionTable__editControl"
                        >
                          <option value="">Selecione</option>
                          {!editCategories.includes(t.category) && (
                            <option value={t.category}>{t.category}</option>
                          )}
                          {editCategories.map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <div className="transactionTable__categoryPill">
                          <Tag size={10} />
                          {t.category}
                        </div>
                      )}
                    </td>
                    <td className="transactionTable__td">
                      {editingId === t.id ? (
                        <input
                          type="number"
                          step="0.01"
                          value={editDraft.value}
                          onChange={(e) =>
                            setEditDraft((prev) => ({
                              ...prev,
                              value: e.target.value,
                            }))
                          }
                          className="transactionTable__editControl"
                        />
                      ) : (
                        <span className={`transactionTable__value ${valueTone}`}>
                          {t.type === "Despesa" && "- "}
                          {formatCurrency(t.value)}
                        </span>
                      )}
                    </td>
                    <td className="transactionTable__td">
                      {editingId === t.id ? (
                        <select
                          value={editDraft.type}
                          onChange={(e) =>
                            setEditDraft((prev) => ({
                              ...prev,
                              type: e.target.value as Transaction["type"],
                            }))
                          }
                          className="transactionTable__editControl"
                        >
                          <option value="Receita">Receita</option>
                          <option value="Despesa">Despesa</option>
                        </select>
                      ) : (
                        <span className={`transactionTable__typeBadge ${typeTone}`}>
                          {t.type}
                        </span>
                      )}
                    </td>
                    <td className="transactionTable__td transactionTable__td--center">
                      <div
                        className={`transactionTable__actions ${
                          editingId === t.id ? "transactionTable__actions--editing" : ""
                        }`}
                      >
                        {editingId === t.id ? (
                          <>
                            <button
                              onClick={() => void handleSaveEdit()}
                              className="transactionTable__actionBtn transactionTable__actionBtn--save"
                              title="Salvar"
                              aria-label="Salvar transaÃ§Ã£o"
                            >
                              <Check size={18} />
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="transactionTable__actionBtn transactionTable__actionBtn--cancel"
                              title="Cancelar"
                              aria-label="Cancelar ediÃ§Ã£o"
                            >
                              <X size={18} />
                            </button>
                          </>
                        ) : (
                          <>
                            {onUpdate && (
                              <button
                                onClick={() => handleStartEdit(t)}
                                className="transactionTable__actionBtn transactionTable__actionBtn--edit"
                                title="Editar"
                                aria-label="Editar transaÃ§Ã£o"
                              >
                                <Pencil size={18} />
                              </button>
                            )}
                            <button
                              onClick={() => void onDelete(t.id)}
                              className="transactionTable__actionBtn transactionTable__actionBtn--delete"
                              title="Excluir"
                              aria-label="Excluir transaÃ§Ã£o"
                            >
                              <Trash2 size={18} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="transactionTable__empty">
                  Nenhuma transação registrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="transactionTable__footer">
        <span>{transactions.length} registros encontrados</span>

        <div className="transactionTable__pagination">
          {shouldPaginate && (
            <div className="transactionTable__pager">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="transactionTable__pageBtn transactionTable__pageBtn--nav"
              >
                Anterior
              </button>

              {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                (page) => {
                  const tone =
                    currentPage === page
                      ? "transactionTable__pageBtn--active"
                      : "transactionTable__pageBtn--idle";
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`transactionTable__pageBtn ${tone}`}
                    >
                      {page}
                    </button>
                  );
                },
              )}

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="transactionTable__pageBtn transactionTable__pageBtn--nav"
              >
                Próxima
              </button>
            </div>
          )}
        </div>

        <div className="transactionTable__summary">
          <span className="transactionTable__summaryItem">
            <span className="transactionTable__miniDot transactionTable__miniDot--income" />{" "}
            RECEITAs
          </span>
          <span className="transactionTable__summaryItem">
            <span className="transactionTable__miniDot transactionTable__miniDot--expense" />{" "}
            Despesas
          </span>
        </div>
      </div>
    </section>
  );
};
