import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Modal from "./Modal";
import { api } from "../services/api";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("kadmill:token");
    localStorage.removeItem("kadmill:userId");
    navigate("/login");
  };

  const userId = localStorage.getItem("kadmill:userId") || "Usuário";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      let endpoint = "";
      switch (activeModal) {
        case "OS": endpoint = "/ordensServicos"; break;
        case "APONTAMENTO": endpoint = "/apontamentos"; break;
        case "MP": endpoint = "/materiasPrimas"; break;
        case "PRODUTO": endpoint = "/produtos"; break;
        case "CLIENTE": endpoint = "/clientes"; break;
        case "FORNECEDOR": endpoint = "/fornecedores"; break;
      }

      const payload = { ...formData };
      
      // Conversão obrigatória para números (o Prisma espera Int/Decimal)
      const numericFields = [
        "usuarioId", "ordemServicoId", "materiaPrimaId", "ferramentaId",
        "quantidade_utilizada", "quantidade_produzida", "tempo_execucao"
      ];
      
      numericFields.forEach(field => {
        if (payload[field] !== undefined && payload[field] !== "") {
          payload[field] = Number(payload[field]);
        }
      });

      await api.post(endpoint, payload);
      alert("Apontamento realizado com sucesso!");
      setActiveModal(null);
      setFormData({});
      window.location.reload(); 
    } catch (error: any) {
      console.error("Erro ao salvar:", error);
      alert(error.response?.data?.message || "Erro ao salvar o registro.");
    } finally {
      setLoading(false);
    }
  };

  const renderModalContent = () => {
    switch (activeModal) {
      case "APONTAMENTO":
  return (
    <form className="modal-form">
      <div className="form-row">
        <div className="form-group">
          <label>Operador (ID)</label>
          <input name="usuarioId" type="number" onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Ordem de Serviço (ID)</label>
          <input name="ordemServicoId" type="number" onChange={handleChange} required />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Data do Trabalho</label>
          <input 
            name="data_apontamento" 
            type="date" 
            onChange={handleChange} 
            defaultValue={new Date().toISOString().split('T')[0]} 
          />
        </div>
        <div className="form-group">
          <label>Tempo de Execução (Min)</label>
          <input name="tempo_execucao" type="number" onChange={handleChange} required />
        </div>
      </div>

      <div className="form-row" style={{ background: "#f8f9fa", padding: "10px", borderRadius: "4px", border: "1px solid #ddd" }}>
        <div className="form-group">
          <label style={{ color: "#d9534f" }}>Qtd. Matéria Usada</label>
          <input name="quantidade_utilizada" type="number" onChange={handleChange} />
        </div>
        <div className="form-group">
          <label style={{ color: "#5cb85c" }}>Qtd. Peças Produzidas</label>
          <input name="quantidade_produzida" type="number" onChange={handleChange} />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Matéria Prima (ID)</label>
          <input name="materiaPrimaId" type="number" onChange={handleChange} placeholder="Opcional" />
        </div>
        <div className="form-group">
          <label>Ferramenta (ID)</label>
          <input name="ferramentaId" type="number" onChange={handleChange} placeholder="Opcional" />
        </div>
      </div>

      <div className="form-group">
        <label>Observação</label>
        <textarea name="observacao" onChange={handleChange}></textarea>
      </div>
    </form>
  );

      case "OS":
        return (
          <form className="modal-form">
            <div className="form-row">
              <div className="form-group">
                <label>Número da OS</label>
                <input name="numero_os" type="text" onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>ID do Cliente</label>
                <input name="clienteId" type="number" onChange={handleChange} required />
              </div>
            </div>
            <div className="form-group">
              <label>Descrição do Serviço</label>
              <textarea name="descricao_servico" onChange={handleChange} required></textarea>
            </div>
          </form>
        );

      // Adicione os outros cases (MP, PRODUTO, etc.) conforme necessário
      default: return null;
    }
  };

  return (
    <div className="app-container">
      {/* ... restante do componente igual ao anterior ... */}
      <header className="top-nav">
        <div className="nav-left-group">
          <nav className="header-links">
            <Link to="/" className={location.pathname === "/" ? "active" : ""}>Início</Link>
            <Link to="/estoque" className={location.pathname === "/estoque" ? "active" : ""}>Estoque</Link>
            <Link to="/contatos" className={location.pathname === "/contatos" ? "active" : ""}>Contatos</Link>
          </nav>
        </div>
        <div className="nav-user-info">
          <span className="user-name">Logado como: <strong>ID {userId}</strong></span>
          <button onClick={handleLogout} className="logout-button">Sair</button>
        </div>
      </header>

      <div className="main-content">
        <aside className="sidebar">
          <div className="sidebar-content">
            <ul className="sidebar-list">
              {(location.pathname === "/contatos" ? 
                [{ label: "Registrar cliente", id: "CLIENTE" }, { label: "Registrar fornecedor", id: "FORNECEDOR" }] :
                [{ label: "Criar ordem de serviço", id: "OS" }, { label: "Gerar apontamento", id: "APONTAMENTO" }, { label: "Registrar matéria prima", id: "MP" }, { label: "Registrar produto", id: "PRODUTO" }]
              ).map((action) => (
                <li key={action.id}>
                  <button className="sidebar-action" onClick={() => { setFormData({}); setActiveModal(action.id); }}>
                    {action.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>
        <main className="page-body">{children}</main>
      </div>

      <Modal 
        isOpen={!!activeModal} 
        onClose={() => setActiveModal(null)} 
        title={`Novo Registro: ${activeModal}`}
      >
        {renderModalContent()}
        <div className="modal-footer">
          <button className="btn-secondary" onClick={() => setActiveModal(null)} disabled={loading}>Cancelar</button>
          <button className="btn-primary" onClick={handleSubmit} disabled={loading}>
            {loading ? "Gravando..." : "Salvar no Sistema"}
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Layout;