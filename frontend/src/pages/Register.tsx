import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRegister } from "../context/RegisterContext";

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-700">
      <div className="bg-slate-900 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-slate-700">
        <h1 className="text-3xl font-bold text-white text-center mb-6">
          Cadastro
        </h1>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="text-slate-300 text-sm">Usuario</label>
            <input
              type="text"
              className="w-full mt-1 p-3 rounded-lg bg-slate-800 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-slate-300 text-sm">Senha</label>
            <input
              type="password"
              className="w-full mt-1 p-3 rounded-lg bg-slate-800 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-slate-300 text-sm">Confirmar senha</label>
            <input
              type="password"
              className="w-full mt-1 p-3 rounded-lg bg-slate-800 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          {(localError || error) && (
            <p className="text-red-400 text-sm text-center">{localError || error}</p>
          )}

          {successMessage && (
            <p className="text-green-400 text-sm text-center">{successMessage}</p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 transition-all duration-200 text-white font-semibold py-3 rounded-lg shadow-md disabled:opacity-60"
          >
            {isLoading ? "Cadastrando..." : "Criar conta"}
          </button>

          <p className="text-center text-sm text-slate-300">
            Ja tem conta?{" "}
            <Link to="/" className="text-blue-400 hover:text-blue-300">
              Entrar
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
