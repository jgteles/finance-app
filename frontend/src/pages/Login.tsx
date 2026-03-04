import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLogin } from "../context/LoginContext";

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
    <div className="relative min-h-screen overflow-hidden bg-slate-100 text-slate-900">
      <div className="absolute -left-24 -top-20 h-72 w-72 rounded-full bg-slate-300/40 blur-3xl" />
      <div className="absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-zinc-300/40 blur-3xl" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-5xl items-center justify-center px-6 py-12">
        <div className="grid w-full overflow-hidden rounded-3xl border border-slate-200 bg-white/90 shadow-2xl backdrop-blur-xl md:grid-cols-2">
          <section className="hidden flex-col justify-between bg-gradient-to-br from-slate-100 via-slate-200/70 to-zinc-100 p-10 md:flex">
            <div>
              <span className="inline-flex rounded-full border border-slate-400/40 bg-slate-200/70 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-slate-700">
                Finance App
              </span>
              <h2 className="mt-6 text-3xl font-bold leading-tight text-slate-900">
                Controle financeiro com foco em clareza e resultado
              </h2>
              <p className="mt-4 text-sm text-slate-700">
                Acompanhe entradas, saidas e metas em um painel simples e
                rapido.
              </p>
            </div>
            <p className="text-xs text-slate-600">
              Dados protegidos e acesso seguro.
            </p>
          </section>

          <section className="p-8 sm:p-10">
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
              Bem Vindo de Volta!
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Acesse sua conta para continuar.
            </p>

            <form onSubmit={handleLogin} className="mt-8 space-y-5">
              <div>
                <label className="text-sm text-slate-700">Usuario</label>
                <input
                  type="text"
                  className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-400/40"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="text-sm text-slate-700">Senha</label>
                <input
                  type="password"
                  className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-400/40"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {error && (
                <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-xl bg-slate-900 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? "Entrando..." : "Entrar"}
              </button>

              <p className="text-center text-sm text-slate-600">
                Nao tem conta?{" "}
                <Link
                  to="/register"
                  className="font-medium text-slate-700 transition hover:text-slate-900"
                >
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
