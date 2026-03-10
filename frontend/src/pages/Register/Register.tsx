import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRegister } from "@/src/context/RegisterContext";
import "./Register.css";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState("");
  const navigate = useNavigate();
  const { register, error, successMessage, isLoading, clearRegisterState } =
    useRegister();

  useEffect(() => {
    clearRegisterState();
  }, [clearRegisterState]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");

    if (password !== confirmPassword) {
      setLocalError("As senhas nao conferem");
      return;
    }

    const success = await register(username, password);
    if (success) {
      setTimeout(() => navigate("/"), 800);
    }
  };

  return (
    <div className="registerPage__root">
      <div className="registerPage__blob registerPage__blob--left" />
      <div className="registerPage__blob registerPage__blob--right" />

      <div className="registerPage__frame">
        <div className="registerPage__card">
          <section className="registerPage__side">
            <div>
              <span className="registerPage__badge">Finance App</span>
              <h2 className="registerPage__sideTitle">
                Crie sua conta e organize sua rotina financeira
              </h2>
              <p className="registerPage__sideText">
                Comece em poucos segundos com uma experiencia simples e
                objetiva.
              </p>
            </div>
            <p className="registerPage__sideNote">
              Seus dados ficam protegidos desde o primeiro acesso.
            </p>
          </section>

          <section className="registerPage__formPane">
            <h1 className="registerPage__title">Criar conta</h1>
            <p className="registerPage__subtitle">
              Preencha os dados para se cadastrar.
            </p>

            <form onSubmit={handleRegister} className="registerPage__form">
              <div className="registerPage__field">
                <label className="registerPage__label">Usuario</label>
                <input
                  type="text"
                  className="registerPage__input"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              <div className="registerPage__field">
                <label className="registerPage__label">Senha</label>
                <input
                  type="password"
                  className="registerPage__input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="registerPage__field">
                <label className="registerPage__label">Confirmar senha</label>
                <input
                  type="password"
                  className="registerPage__input"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              {(localError || error) && (
                <p className="registerPage__error">{localError || error}</p>
              )}

              {successMessage && (
                <p className="registerPage__success">{successMessage}</p>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="registerPage__submit"
              >
                {isLoading ? "Cadastrando..." : "Criar conta"}
              </button>

              <p className="registerPage__footer">
                Ja tem conta?{" "}
                <Link to="/" className="registerPage__link">
                  Entrar
                </Link>
              </p>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}
