import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import logo from "../assets/Logo_Kadmill.png";
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
      const response = await api.post("/login", { id: Number(id), senha });
      localStorage.setItem("kadmill:token", response.data.token);
      navigate("/");
    } catch (err: any) {
      setErro(err.response?.data?.message || "Erro ao entrar no sistema.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-box">
        <div className="login-header">
          <img src={logo} alt="KadMill Logo" className="login-logo-img" />
          <h1>KADMILL</h1>
          <span>SISTEMA DE GESTÃO INDUSTRIAL</span>
        </div>
        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group">
            <label>ID DE USUÁRIO</label>
            <input type="number" value={id} onChange={(e) => setId(e.target.value)} required />
          </div>
          <div className="input-group">
            <label>SENHA</label>
            <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} required />
          </div>
          {erro && <div className="login-error">{erro}</div>}
          <button type="submit" className="login-button" disabled={carregando}>
            {carregando ? "A AUTENTICAR..." : "ENTRAR"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;