import React, { useState } from "react";
import { login } from "../services/api";
import { useNavigate } from "react-router-dom";
    
export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const data = await login(username, password);

      if (data.access) {
        localStorage.setItem("token", data.access);
        navigate("/dashboard");
      } else {
        setError("Usuário ou senha inválidos");
      }
    } catch (err) {
      setError("Erro ao conectar com o servidor");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="bg-gray-900 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-700">
        <h1 className="text-3xl font-bold text-white text-center mb-6">
          Financial Dashboard
        </h1>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-gray-400 text-sm">Usuário</label>
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

          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 transition-all duration-200 text-white font-semibold py-3 rounded-lg shadow-md"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}