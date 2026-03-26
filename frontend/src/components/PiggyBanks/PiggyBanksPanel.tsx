import React, { useState } from "react";
import { createPortal } from "react-dom";
import { usePiggyBanks } from "@/src/hooks/usePiggyBanks";
import { formatCurrency } from "@/utils";
import type { PiggyBank, PiggyBankMovement } from "@/types";
import { Download, Eye, Trash2, X } from "lucide-react";
import { saveAs } from "file-saver";
import "./PiggyBanksPanel.css";

export const PiggyBanksPanel: React.FC = () => {
  const {
    piggyBanks,
    addPiggyBank,
    updatePiggyBank,
    setCdiPercentageForAll,
    removePiggyBank,
    depositPiggyBank,
    withdrawPiggyBank,
    fetchPiggyBankMovements,
    deletePiggyBankMovement,
    downloadPiggyBankMovementsExcel,
    refreshPiggyBanks,
    isLoading,
  } = usePiggyBanks();

  const [name, setName] = useState("");
  const [color, setColor] = useState("#22c55e");
  const [targetAmount, setTargetAmount] = useState<string>("");
  const [adjustById, setAdjustById] = useState<Record<number, string>>({});
  const [useGlobalCdi, setUseGlobalCdi] = useState<boolean>(() => {
    return localStorage.getItem("piggy_use_global_cdi") === "true";
  });
  const [globalCdiPercentage, setGlobalCdiPercentage] = useState<string>(() => {
    return localStorage.getItem("piggy_global_cdi_percentage") ?? "100";
  });
  const [cdiPercentage, setCdiPercentage] = useState<string>(() => {
    return localStorage.getItem("piggy_new_cdi_percentage") ?? "100";
  });
  const [cdiById, setCdiById] = useState<Record<number, string>>({});
  const [applyAllLoading, setApplyAllLoading] = useState(false);
  const [applyAllModalOpen, setApplyAllModalOpen] = useState(false);
  const [pendingGlobalCdiEnable, setPendingGlobalCdiEnable] = useState(false);

  const [movementsPiggy, setMovementsPiggy] = useState<PiggyBank | null>(null);
  const [movements, setMovements] = useState<PiggyBankMovement[]>([]);
  const [movementsLoading, setMovementsLoading] = useState(false);
  const [movementsError, setMovementsError] = useState<string | null>(null);
  const [downloadLoading, setDownloadLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!name.trim()) return;

    try {
      await addPiggyBank({
        name: name.trim(),
        color,
        target_amount: targetAmount
          ? Number(targetAmount.replace(",", "."))
          : null,
        cdi_percentage: useGlobalCdi
          ? Number(globalCdiPercentage.replace(",", "."))
          : cdiPercentage
            ? Number(cdiPercentage.replace(",", "."))
            : 100,
      });
      setName("");
      setTargetAmount("");
      if (!useGlobalCdi) {
        setCdiPercentage("100");
        localStorage.setItem("piggy_new_cdi_percentage", "100");
      }
    } catch (err: any) {
      alert(err?.message ?? "Erro ao criar cofrinho");
    }
  };

  const parseAmount = (raw: string) => {
    const normalized = raw.replace(",", ".");
    const amount = Number(normalized);
    return Number.isFinite(amount) ? amount : 0;
  };

  const handleApplyGlobalCdiToAll = async () => {
    const next = parseAmount(globalCdiPercentage);
    if (!Number.isFinite(next) || next < 0 || next > 200) {
      alert("Informe um % do CDI entre 0 e 200.");
      return;
    }

    setApplyAllLoading(true);
    try {
      await setCdiPercentageForAll(next);
      setCdiById({});
      localStorage.setItem("piggy_use_global_cdi", "true");
      setPendingGlobalCdiEnable(false);
      setApplyAllModalOpen(false);
    } catch (err: any) {
      alert(err?.message ?? "Erro ao aplicar CDI para todos os cofrinhos");
    } finally {
      setApplyAllLoading(false);
    }
  };

  const closeApplyAllModal = () => {
    setApplyAllModalOpen(false);

    if (pendingGlobalCdiEnable) {
      setUseGlobalCdi(false);
      localStorage.setItem("piggy_use_global_cdi", "false");
      setPendingGlobalCdiEnable(false);
    }
  };

  const handleSaveCdiPercentage = async (piggy: PiggyBank) => {
    const raw = cdiById[piggy.id];
    const next =
      raw == null || raw === ""
        ? (piggy.cdi_percentage ?? 100)
        : parseAmount(raw);

    if (!Number.isFinite(next) || next < 0 || next > 200) {
      alert("Informe um % do CDI entre 0 e 200.");
      return;
    }

    try {
      await updatePiggyBank(piggy.id, { cdi_percentage: next });
      setCdiById((prev) => ({ ...prev, [piggy.id]: String(next) }));
    } catch (err: any) {
      alert(err?.message ?? "Erro ao atualizar % do CDI");
    }
  };

  const handleDeposit = async (id: number) => {
    const raw = adjustById[id] ?? "";
    const amount = parseAmount(raw);
    if (amount <= 0) return;
    try {
      await depositPiggyBank(id, amount);
      setAdjustById((prev) => ({ ...prev, [id]: "" }));
    } catch (err: any) {
      alert(err?.message ?? "Erro ao depositar");
    }
  };

  const handleWithdraw = async (id: number) => {
    const raw = adjustById[id] ?? "";
    const amount = parseAmount(raw);
    if (amount <= 0) return;
    try {
      await withdrawPiggyBank(id, amount);
      setAdjustById((prev) => ({ ...prev, [id]: "" }));
    } catch (err: any) {
      alert(err?.message ?? "Erro ao retirar");
    }
  };

  const formatMovementDate = (iso: string) => {
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return iso;
    return date.toLocaleString("pt-BR");
  };

  const openMovements = async (piggy: PiggyBank) => {
    setMovementsPiggy(piggy);
    setMovements([]);
    setMovementsError(null);
    setMovementsLoading(true);

    try {
      const data = await fetchPiggyBankMovements(piggy.id);
      setMovements(data);
    } catch (err: any) {
      setMovementsError(err?.message ?? "Erro ao buscar movimentações");
    } finally {
      setMovementsLoading(false);
    }
  };

  const closeMovements = () => {
    setMovementsPiggy(null);
    setMovements([]);
    setMovementsError(null);
    setMovementsLoading(false);
  };

  const handleDownloadMovementsExcel = async () => {
    if (!movementsPiggy) return;
    setDownloadLoading(true);

    try {
      const blob = await downloadPiggyBankMovementsExcel(movementsPiggy.id);
      const safeName = (movementsPiggy.name || "cofrinho")
        .trim()
        .replace(/[\\/:*?"<>|]+/g, "-")
        .replace(/\s+/g, "-")
        .slice(0, 80);
      saveAs(blob, `${safeName}-movimentacoes.xlsx`);
    } catch (err: any) {
      alert(err?.message ?? "Erro ao baixar excel");
    } finally {
      setDownloadLoading(false);
    }
  };

  const handleDeleteMovement = async (movementId: number) => {
    if (!movementsPiggy) return;
    const ok = window.confirm(
      "Apagar esta movimentação? O saldo do cofrinho será recalculado.",
    );
    if (!ok) return;

    setMovementsError(null);
    setMovementsLoading(true);

    try {
      await deletePiggyBankMovement(movementsPiggy.id, movementId);
      await refreshPiggyBanks();
      const data = await fetchPiggyBankMovements(movementsPiggy.id);
      setMovements(data);
    } catch (err: any) {
      setMovementsError(err?.message ?? "Erro ao apagar movimentação");
    } finally {
      setMovementsLoading(false);
    }
  };

  const movementTotals = React.useMemo(() => {
    const totalDeposit = movements.reduce((acc, m) => {
      if (m.movement_type !== "DEPOSIT") return acc;
      return acc + Number(m.amount ?? 0);
    }, 0);

    const totalWithdraw = movements.reduce((acc, m) => {
      if (m.movement_type !== "WITHDRAW") return acc;
      return acc + Number(m.amount ?? 0);
    }, 0);

    const currentBalance =
      movements.length > 0
        ? Number(movements[0].balance_after ?? 0)
        : Number(movementsPiggy?.balance ?? 0);

    return { totalDeposit, totalWithdraw, currentBalance };
  }, [movements, movementsPiggy?.balance]);

  return (
    <section className="piggyPanel__container">
      <header className="piggyPanel__header">
        <div>
          <p className="piggyPanel__kicker">Cofrinhos</p>
          <h3 className="piggyPanel__title">Objetivos de economia</h3>
          <p className="piggyPanel__subtitle">
            Crie cofrinhos para separar metas como viagem, emergência ou
            investimentos.
          </p>
        </div>
      </header>

      <div className="piggyPanel__content">
        <form className="piggyPanel__form" onSubmit={handleSubmit}>
          <div className="piggyPanel__fieldGroup">
            <label className="piggyPanel__label">
              Nome do cofrinho
              <input
                type="text"
                className="piggyPanel__input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex.: Viagem, Reserva de emergência..."
              />
            </label>

            <label className="piggyPanel__label">
              Cor
              <input
                type="color"
                className="piggyPanel__colorInput"
                value={color}
                onChange={(e) => setColor(e.target.value)}
              />
            </label>

            <label className="piggyPanel__label">
              Meta (opcional)
              <input
                type="number"
                min={0}
                step={0.01}
                className="piggyPanel__input"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                placeholder="Ex.: 5000"
              />
            </label>

            <label className="piggyPanel__label">
              <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <input
                  type="checkbox"
                  checked={useGlobalCdi}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    if (checked) {
                      setUseGlobalCdi(true);
                      setPendingGlobalCdiEnable(true);
                      setApplyAllModalOpen(true);
                      return;
                    }

                    setUseGlobalCdi(false);
                    localStorage.setItem("piggy_use_global_cdi", "false");
                  }}
                />
                Usar o mesmo % CDI para todos
              </span>
            </label>

            {useGlobalCdi ? (
              <label className="piggyPanel__label">
                % do CDI (global)
                <input
                  type="number"
                  min={0}
                  max={200}
                  step={0.01}
                  className="piggyPanel__input"
                  value={globalCdiPercentage}
                  onChange={(e) => {
                    setGlobalCdiPercentage(e.target.value);
                    localStorage.setItem(
                      "piggy_global_cdi_percentage",
                      e.target.value,
                    );
                  }}
                  placeholder="Ex.: 100"
                />
              </label>
            ) : (
              <label className="piggyPanel__label">
                Rendimento (% do CDI)
                <input
                  type="number"
                  min={0}
                  max={200}
                  step={0.01}
                  className="piggyPanel__input"
                  value={cdiPercentage}
                  onChange={(e) => {
                    setCdiPercentage(e.target.value);
                    localStorage.setItem(
                      "piggy_new_cdi_percentage",
                      e.target.value,
                    );
                  }}
                  placeholder="Ex.: 100"
                />
              </label>
            )}
          </div>

          <button
            type="submit"
            className="piggyPanel__submit"
            disabled={isLoading}
          >
            {isLoading ? "Salvando..." : "Criar cofrinho"}
          </button>
        </form>

        <div className="piggyPanel__list">
          {piggyBanks.length === 0 && !isLoading && (
            <p className="piggyPanel__empty">
              Nenhum cofrinho criado ainda. Comece adicionando o primeiro
              objetivo.
            </p>
          )}

          {piggyBanks.map((piggy) => (
            <article
              key={piggy.id}
              className="piggyPanel__item"
              style={
                { ["--piggy-color" as any]: piggy.color } as React.CSSProperties
              }
            >
              <div className="piggyPanel__itemTop">
                <div className="piggyPanel__itemHeader">
                  <div className="piggyPanel__avatar">
                    {piggy.name?.trim()?.[0]?.toUpperCase() ?? "C"}
                  </div>
                  <div className="piggyPanel__itemText">
                    <h4 className="piggyPanel__itemTitle">{piggy.name}</h4>
                    <p className="piggyPanel__itemMeta">
                      Saldo:{" "}
                      {formatCurrency(Number((piggy as any).balance ?? 0))} ·
                      CDI: {Number(piggy.cdi_percentage ?? 100).toFixed(2)}%
                      {(piggy as any).target_amount != null && (
                        <>
                          {" "}
                          · Meta:{" "}
                          {formatCurrency(Number((piggy as any).target_amount))}
                        </>
                      )}
                    </p>
                  </div>
                </div>

                <div className="piggyPanel__topActions">
                  <button
                    type="button"
                    className="piggyPanel__view"
                    onClick={() => openMovements(piggy)}
                    aria-label={`Ver movimentações do cofrinho ${piggy.name}`}
                    title="Ver movimentações"
                  >
                    <Eye size={18} />
                  </button>

                  <button
                    type="button"
                    className="piggyPanel__remove"
                    onClick={() => removePiggyBank(piggy.id)}
                  >
                    Remover
                  </button>
                </div>
              </div>

              {(piggy as any).target_amount != null &&
                Number((piggy as any).target_amount) > 0 && (
                  <div className="piggyPanel__progress" aria-hidden="true">
                    <div
                      className="piggyPanel__progressBar"
                      style={{
                        width: `${Math.min(
                          100,
                          (Number((piggy as any).balance ?? 0) /
                            Number((piggy as any).target_amount)) *
                            100,
                        ).toFixed(1)}%`,
                      }}
                    />
                  </div>
                )}

              <div className="piggyPanel__itemActions">
                {!useGlobalCdi && (
                  <>
                    <input
                      type="number"
                      min={0}
                      max={200}
                      step={0.01}
                      className="piggyPanel__amountInput"
                      value={
                        cdiById[piggy.id] ?? String(piggy.cdi_percentage ?? 100)
                      }
                      onChange={(e) =>
                        setCdiById((prev) => ({
                          ...prev,
                          [piggy.id]: e.target.value,
                        }))
                      }
                      placeholder="% CDI"
                    />
                    <button
                      type="button"
                      className="piggyPanel__actionBtn"
                      onClick={() => handleSaveCdiPercentage(piggy)}
                      disabled={isLoading}
                    >
                      Salvar CDI
                    </button>
                  </>
                )}

                <input
                  type="number"
                  min={0}
                  step={0.01}
                  className="piggyPanel__amountInput"
                  value={adjustById[piggy.id] ?? ""}
                  onChange={(e) =>
                    setAdjustById((prev) => ({
                      ...prev,
                      [piggy.id]: e.target.value,
                    }))
                  }
                  placeholder="Valor"
                />
                <button
                  type="button"
                  className="piggyPanel__actionBtn piggyPanel__actionBtn--deposit"
                  onClick={() => handleDeposit(piggy.id)}
                  disabled={isLoading}
                >
                  Aportar
                </button>
                <button
                  type="button"
                  className="piggyPanel__actionBtn piggyPanel__actionBtn--withdraw"
                  onClick={() => handleWithdraw(piggy.id)}
                  disabled={isLoading}
                >
                  Retirar
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>

      {movementsPiggy &&
        createPortal(
          <div
            className="piggyPanel__modalOverlay"
            role="dialog"
            aria-modal="true"
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) closeMovements();
            }}
          >
            <div
              className="piggyPanel__modal"
              onMouseDown={(e) => e.stopPropagation()}
            >
              <header className="piggyPanel__modalHeader">
                <div className="piggyPanel__modalTitleWrap">
                  <p className="piggyPanel__modalKicker">Movimentações</p>
                  <h4 className="piggyPanel__modalTitle">
                    {movementsPiggy.name}
                  </h4>
                </div>

                <div className="piggyPanel__modalActions">
                  <button
                    type="button"
                    className="piggyPanel__modalDownload"
                    onClick={handleDownloadMovementsExcel}
                    disabled={downloadLoading}
                    title="Baixar Excel"
                  >
                    <Download size={18} />
                    <span>{downloadLoading ? "Baixando..." : "Excel"}</span>
                  </button>

                  <button
                    type="button"
                    className="piggyPanel__modalClose"
                    onClick={closeMovements}
                    aria-label="Fechar"
                  >
                    <X size={18} />
                  </button>
                </div>
              </header>

              <div className="piggyPanel__modalBody">
                {movementsLoading && (
                  <p className="piggyPanel__modalState">
                    Carregando movimentações...
                  </p>
                )}

                {!movementsLoading && movementsError && (
                  <p className="piggyPanel__modalState piggyPanel__modalState--error">
                    {movementsError}
                  </p>
                )}

                {!movementsLoading &&
                  !movementsError &&
                  movements.length === 0 && (
                    <p className="piggyPanel__modalState">
                      Nenhuma movimentação registrada ainda.
                    </p>
                  )}

                {!movementsLoading &&
                  !movementsError &&
                  movements.length > 0 && (
                    <>
                      <ul className="piggyPanel__movementList">
                        {movements.map((m) => {
                          const isDeposit = m.movement_type === "DEPOSIT";
                          const label = isDeposit ? "Aporte" : "Retirada";
                          const signedAmount = `${isDeposit ? "+" : "-"} ${formatCurrency(
                            Number(m.amount ?? 0),
                          )}`;

                          return (
                            <li key={m.id} className="piggyPanel__movementItem">
                              <div className="piggyPanel__movementLeft">
                                <span
                                  className={
                                    "piggyPanel__movementBadge " +
                                    (isDeposit
                                      ? "piggyPanel__movementBadge--deposit"
                                      : "piggyPanel__movementBadge--withdraw")
                                  }
                                >
                                  {label}
                                </span>
                                <span className="piggyPanel__movementDate">
                                  {formatMovementDate(m.created_at)}
                                </span>
                              </div>

                              <div className="piggyPanel__movementRight">
                                <div className="piggyPanel__movementTopRight">
                                  <span
                                    className={
                                      "piggyPanel__movementAmount " +
                                      (isDeposit
                                        ? "piggyPanel__movementAmount--deposit"
                                        : "piggyPanel__movementAmount--withdraw")
                                    }
                                  >
                                    {signedAmount}
                                  </span>
                                  <button
                                    type="button"
                                    className="piggyPanel__movementDelete"
                                    onClick={() => handleDeleteMovement(m.id)}
                                    aria-label="Apagar movimentação"
                                    title="Apagar movimentação"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>

                                <span className="piggyPanel__movementBalance">
                                  Saldo após:{" "}
                                  {formatCurrency(Number(m.balance_after ?? 0))}
                                </span>
                              </div>
                            </li>
                          );
                        })}
                      </ul>

                      <div
                        className="piggyPanel__movementSummary"
                        aria-label="Resumo"
                      >
                        <div className="piggyPanel__movementSummaryRow">
                          <span>Total aportado</span>
                          <strong className="piggyPanel__movementSummaryValue piggyPanel__movementSummaryValue--deposit">
                            {formatCurrency(movementTotals.totalDeposit)}
                          </strong>
                        </div>
                        <div className="piggyPanel__movementSummaryRow">
                          <span>Total retirado</span>
                          <strong className="piggyPanel__movementSummaryValue piggyPanel__movementSummaryValue--withdraw">
                            {formatCurrency(movementTotals.totalWithdraw)}
                          </strong>
                        </div>
                        <div className="piggyPanel__movementSummaryRow piggyPanel__movementSummaryRow--total">
                          <span>Saldo do cofrinho</span>
                          <strong className="piggyPanel__movementSummaryValue">
                            {formatCurrency(movementTotals.currentBalance)}
                          </strong>
                        </div>
                      </div>
                    </>
                  )}
              </div>
            </div>
          </div>,
          document.body,
        )}

      {applyAllModalOpen &&
        createPortal(
          <div
            className="piggyPanel__modalOverlay"
            role="dialog"
            aria-modal="true"
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) closeApplyAllModal();
            }}
          >
            <div
              className="piggyPanel__modal"
              onMouseDown={(e) => e.stopPropagation()}
            >
              <header className="piggyPanel__modalHeader">
                <div className="piggyPanel__modalTitleWrap">
                  <p className="piggyPanel__modalKicker">CDI Global</p>
                  <h4 className="piggyPanel__modalTitle">
                    Aplicar para todos os cofrinhos
                  </h4>
                </div>

                <div className="piggyPanel__modalActions">
                  <button
                    type="button"
                    className="piggyPanel__modalClose"
                    onClick={closeApplyAllModal}
                    aria-label="Fechar"
                  >
                    <X size={18} />
                  </button>
                </div>
              </header>

              <div className="piggyPanel__modalBody">
                <p className="piggyPanel__modalState">
                  Isso vai atualizar o % do CDI de{" "}
                  <strong>{piggyBanks.length}</strong> cofrinho(s). Você pode
                  desfazer depois alterando individualmente.
                </p>

                <div style={{ height: 14 }} aria-hidden="true" />

                <label className="piggyPanel__label">
                  % do CDI (global)
                  <input
                    type="number"
                    min={0}
                    max={200}
                    step={0.01}
                    className="piggyPanel__input"
                    value={globalCdiPercentage}
                    onChange={(e) => {
                      setGlobalCdiPercentage(e.target.value);
                      localStorage.setItem(
                        "piggy_global_cdi_percentage",
                        e.target.value,
                      );
                    }}
                    placeholder="Ex.: 100"
                  />
                </label>

                <div style={{ height: 14 }} aria-hidden="true" />

                <div className="piggyPanel__modalFooter">
                <button
                  type="button"
                  className="piggyPanel__submit"
                  onClick={handleApplyGlobalCdiToAll}
                  disabled={isLoading || applyAllLoading}
                  title="Confirma a aplicaÃ§Ã£o do CDI global"
                >
                  {applyAllLoading ? "Aplicando..." : "Confirmar e aplicar"}
                </button>


                <button
                  type="button"
                  className="piggyPanel__modalDownload"
                  onClick={closeApplyAllModal}
                  disabled={applyAllLoading}
                >
                  Cancelar
                </button>
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </section>
  );
};
