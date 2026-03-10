import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLogin } from "@/src/context/LoginContext";
import "./Login.css";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login, error, isLoading } = useLogin();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(username, password);

    if (success) {
      navigate("/dashboard");
    }
  };

  return (
    <div className="loginPage__root">
      <div className="loginPage__blob loginPage__blob--left" />
      <div className="loginPage__blob loginPage__blob--right" />

      <div className="loginPage__frame">
        <div className="loginPage__card">
          <section className="loginPage__side">
            <div>
              <span className="loginPage__badge">Finance App</span>
              <h2 className="loginPage__sideTitle">
                Controle financeiro com foco em clareza e resultado
              </h2>
              <p className="loginPage__sideText">
                Acompanhe entradas, saidas e metas em um painel simples e
                rapido.
              </p>
            </div>
            <p className="loginPage__sideNote">Dados protegidos e acesso seguro.</p>
          </section>

          <section className="loginPage__formPane">
            <h1 className="loginPage__title">Bem Vindo de Volta!</h1>
            <p className="loginPage__subtitle">
              Acesse sua conta para continuar.
            </p>

            <form onSubmit={handleLogin} className="loginPage__form">
              <div className="loginPage__field">
                <label className="loginPage__label">Usuario</label>
                <input
                  type="text"
                  className="loginPage__input"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              <div className="loginPage__field">
                <label className="loginPage__label">Senha</label>
                <input
                  type="password"
                  className="loginPage__input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {error && <p className="loginPage__error">{error}</p>}

              <button
                type="submit"
                disabled={isLoading}
                className="loginPage__submit"
              >
                {isLoading ? "Entrando..." : "Entrar"}
              </button>

              <p className="loginPage__footer">
                Nao tem conta?{" "}
                <Link to="/register" className="loginPage__link">
                  Cadastre-se
                </Link>
              </p>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}
