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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="bg-gray-900 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-700">
        <h1 className="text-3xl font-bold text-white text-center mb-6">
          Login
        </h1>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-gray-400 text-sm">Usuario</label>
            <input
              type="text"
              className="w-full mt-1 p-3 rounded-lg bg-gray-800 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-gray-400 text-sm">Senha</label>
            <input
              type="password"
              className="w-full mt-1 p-3 rounded-lg bg-gray-800 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="text-red-400 text-sm text-center">{error}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 transition-all duration-200 text-white font-semibold py-3 rounded-lg shadow-md disabled:opacity-60"
          >
            {isLoading ? "Entrando..." : "Entrar"}
          </button>

          <p className="text-center text-sm text-gray-300">
            Nao tem conta?{" "}
            <Link to="/register" className="text-blue-400 hover:text-blue-300">
              Cadastre-se
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
