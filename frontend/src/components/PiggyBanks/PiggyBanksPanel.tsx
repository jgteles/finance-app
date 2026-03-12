import React, { useState } from "react";
import { usePiggyBanks } from "@/src/hooks/usePiggyBanks";
import { formatCurrency } from "@/utils";
import "./PiggyBanksPanel.css";

export const PiggyBanksPanel: React.FC = () => {
  const { piggyBanks, addPiggyBank, removePiggyBank, isLoading } = usePiggyBanks();

  const [name, setName] = useState("");
  const [color, setColor] = useState("#22c55e");
  const [targetAmount, setTargetAmount] = useState<string>("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!name.trim()) return;

    const payload: any = {
      name: name.trim(),
      color,
    };

    if (targetAmount) {
      payload.target_amount = Number(targetAmount.replace(",", "."));
    }

    await addPiggyBank(payload);
    setName("");
    setTargetAmount("");
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
              style={{ borderColor: piggy.color }}
            >
              <div className="piggyPanel__itemHeader">
                <div className="piggyPanel__avatar" style={{ backgroundColor: piggy.color }}>
                  🐷
                </div>
                <div>
                  <h4 className="piggyPanel__itemTitle">{piggy.name}</h4>
                  {(piggy as any).target_amount != null && (
                    <p className="piggyPanel__itemMeta">
                      Meta: {formatCurrency(Number((piggy as any).target_amount))}
                    </p>
                  )}
                </div>
              </div>

              <button
                type="button"
                className="piggyPanel__remove"
                onClick={() => removePiggyBank(piggy.id)}
              >
                Remover
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

