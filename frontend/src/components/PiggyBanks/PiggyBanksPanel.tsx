import React, { useState } from "react";
import { usePiggyBanks } from "@/src/hooks/usePiggyBanks";
import { formatCurrency } from "@/utils";
import "./PiggyBanksPanel.css";

export const PiggyBanksPanel: React.FC = () => {
  const {
    piggyBanks,
    addPiggyBank,
    removePiggyBank,
    depositPiggyBank,
    withdrawPiggyBank,
    isLoading,
  } = usePiggyBanks();

  const [name, setName] = useState("");
  const [color, setColor] = useState("#22c55e");
  const [targetAmount, setTargetAmount] = useState<string>("");
  const [adjustById, setAdjustById] = useState<Record<number, string>>({});

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!name.trim()) return;

    try {
      await addPiggyBank({
        name: name.trim(),
        color,
        target_amount: targetAmount ? Number(targetAmount.replace(",", ".")) : null,
      });
      setName("");
      setTargetAmount("");
    } catch (err: any) {
      alert(err?.message ?? "Erro ao criar cofrinho");
    }
  };

  const parseAmount = (raw: string) => {
    const normalized = raw.replace(",", ".");
    const amount = Number(normalized);
    return Number.isFinite(amount) ? amount : 0;
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

  return (
    <section className="piggyPanel__container">
      <header className="piggyPanel__header">
        <div>
          <p className="piggyPanel__kicker">Cofrinhos</p>
          <h3 className="piggyPanel__title">Objetivos de economia</h3>
          <p className="piggyPanel__subtitle">
            Crie cofrinhos para separar metas como viagem, emergência ou investimentos.
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
	              Nenhum cofrinho criado ainda. Comece adicionando o primeiro objetivo.
	            </p>
	          )}

	          {piggyBanks.map((piggy) => (
	            <article
	              key={piggy.id}
	              className="piggyPanel__item"
	              style={{ ["--piggy-color" as any]: piggy.color } as React.CSSProperties}
	            >
	              <div className="piggyPanel__itemTop">
	                <div className="piggyPanel__itemHeader">
	                  <div className="piggyPanel__avatar">
	                    {piggy.name?.trim()?.[0]?.toUpperCase() ?? "C"}
	                  </div>
	                  <div className="piggyPanel__itemText">
	                    <h4 className="piggyPanel__itemTitle">{piggy.name}</h4>
	                    <p className="piggyPanel__itemMeta">
	                      Saldo: {formatCurrency(Number((piggy as any).balance ?? 0))}
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

	                <button
	                  type="button"
	                  className="piggyPanel__remove"
	                  onClick={() => removePiggyBank(piggy.id)}
	                >
	                  Remover
	                </button>
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
	    </section>
	  );
	};

