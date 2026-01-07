import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";

const Login: React.FC = () => {
  const [id, setId] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");
    setCarregando(true);

    try {
      // O seu backend espera { id, senha } no corpo da requisição
      const response = await api.post("/login", {
        id: Number(id),
        senha
      });

      // Guarda o token com a chave configurada no interceptor
      localStorage.setItem("kadmill:token", response.data.token);
      
      // Redireciona para a página inicial
      navigate("/");
    } catch (err: any) {
      setErro(err.response?.data?.message || "Erro ao realizar login. Verifique as credenciais.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-box">
        <div className="login-header">
          <img src="/vite.svg" alt="KadMill Logo" className="login-logo" />
          <h1>KadMill</h1>
          <span>Sistema de Gestão Industrial</span>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group">
            <label htmlFor="usuarioId">ID de Usuário</label>
            <input
              id="usuarioId"
              type="number"
              placeholder="Ex: 1"
              value={id}
              onChange={(e) => setId(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="senha">Palavra-passe</label>
            <input
              id="senha"
              type="password"
              placeholder="••••••••"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </div>

          {erro && <p className="login-error">{erro}</p>}

          <button type="submit" className="login-button" disabled={carregando}>
            {carregando ? "A entrar..." : "Entrar"}
          </button>
        </form>
        
        <div className="login-footer">
          <p>Usinagem KadMill &copy; 2025</p>
        </div>
      </div>
    </div>
  );
};

export default Login;