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

      // 1. Cria uma cópia dos dados para manipular antes de enviar
      const payload = { ...formData };

      // 2. Lógica específica para PRODUTO
      if (activeModal === "PRODUTO") {
        // Mapeia 'calculo_custo' (frontend) para 'custo_unitario' (banco)
        if (payload.calculo_custo) {
          payload.custo_unitario = Number(payload.calculo_custo);
          delete payload.calculo_custo; // Remove o nome antigo para não dar erro na API
        }
        
        // Garante valor padrão para unidade se não foi selecionado
        if (!payload.unidade) payload.unidade = "KG";

        // Se o usuário digitou um ID manualmente, converte para número
        if (payload.id) payload.id = Number(payload.id);
        else delete payload.id; // Se estiver vazio, remove para o banco gerar automático
      }
      
      // 3. Conversão de campos numéricos (Segurança)
      const numericFields = [
        "usuarioId", "ordemServicoId", "materiaPrimaId", "ferramentaId",
        "quantidade_utilizada", "quantidade_produzida", "tempo_execucao", 
        "clienteId", "valor_total", "quantidade_disponivel", "preco_custo",
        "quantidade_estoque", "preco_unitario", "fornecedorId", "custo_unitario"
      ];
      
      numericFields.forEach(field => {
        if (payload[field] !== undefined && payload[field] !== "") {
          payload[field] = Number(payload[field]);
        }
      });

      await api.post(endpoint, payload);
      alert("Registro salvo com sucesso!");
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
      case "PRODUTO":
        return (
          <form className="modal-form">
            {/* Linha 1: Código e Tipo */}
            <div className="form-row">
              <div className="form-group">
                <label>CÓDIGO</label>
                <input name="id" type="number" onChange={handleChange} placeholder="Automático" />
              </div>
              <div className="form-group">
                <label>TIPO</label>
                <input name="tipo" type="text" onChange={handleChange} placeholder="Ex: Pinos" required />
              </div>
            </div>

            {/* Linha 2: Modelo e Data de Registro */}
            <div className="form-row">
              <div className="form-group">
                <label>MODELO</label>
                <input name="modelo" type="text" onChange={handleChange} placeholder="Ex: Fixagem" />
              </div>
              <div className="form-group">
                <label>DATA DE REGISTRO</label>
                <input 
                  name="data_registro" 
                  type="date" 
                  onChange={handleChange} 
                  defaultValue={new Date().toISOString().split('T')[0]} 
                />
              </div>
            </div>

            {/* Linha 3: Quantidade e Unidade */}
            <div className="form-row" style={{ alignItems: "flex-end" }}>
              <div className="form-group">
                <label>QUANTIDADE</label>
                <input name="quantidade_estoque" type="number" onChange={handleChange} placeholder="0" required />
              </div>
              <div className="form-group" style={{ maxWidth: "100px" }}>
                <label>UNID.</label>
                <select name="unidade" onChange={handleChange} defaultValue="KG">
                  <option value="KG">KG</option>
                  <option value="UN">UN</option>
                  <option value="MT">MT</option>
                  <option value="L">L</option>
                  <option value="CAIXA">CX</option>
                </select>
              </div>
            </div>

            {/* Linha 4: Preços e Custos */}
            <div className="form-row">
              <div className="form-group">
                <label>PREÇO UNITÁRIO (R$)</label>
                <input name="preco_unitario" type="number" step="0.01" onChange={handleChange} placeholder="15,70" required />
              </div>
              <div className="form-group">
                <label>CÁLCULO DE CUSTO (R$)</label>
                <input name="calculo_custo" type="number" step="0.01" onChange={handleChange} placeholder="30,50" />
              </div>
            </div>

            <div className="form-group" style={{ marginTop: "10px" }}>
              <label>NOME COMPLETO / DESCRIÇÃO</label>
              <input name="nome" type="text" onChange={handleChange} placeholder="Ex: Pino de Fixagem Especial" required />
            </div>
          </form>
        );

      case "MP":
        return (
          <form className="modal-form">
            <div className="form-row">
              <div className="form-group">
                <label>NOME DA MATÉRIA PRIMA</label>
                <input name="nome" type="text" onChange={handleChange} placeholder="Ex: Barra de Aço" required />
              </div>
              <div className="form-group">
                <label>FORNECEDOR (ID)</label>
                <input name="fornecedorId" type="number" onChange={handleChange} placeholder="ID" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>QTD. EM ESTOQUE</label>
                <input name="quantidade_disponivel" type="number" onChange={handleChange} placeholder="0" />
              </div>
              <div className="form-group">
                <label>PREÇO DE CUSTO (R$)</label>
                <input name="valor_unitario" type="number" step="0.01" onChange={handleChange} placeholder="0,00" />
              </div>
            </div>
             <div className="form-group">
                <label>UNIDADE DE MEDIDA</label>
                <select name="unidade_medida" onChange={handleChange} defaultValue="KG">
                  <option value="KG">KG</option>
                  <option value="UN">UN</option>
                  <option value="M">Metros</option>
                </select>
              </div>
             <div className="form-group">
              <label>DESCRIÇÃO</label>
              <textarea name="descricao" onChange={handleChange} rows={2}></textarea>
            </div>
          </form>
        );

      case "OS":
        return (
          <form className="modal-form">
            <div className="form-row">
              <div className="form-group">
                <label>CLIENTE (SOLICITANTE)</label>
                <input name="clienteId" type="number" onChange={handleChange} placeholder="ID do cliente" required />
              </div>
              <div className="form-group">
                <label>VALOR TOTAL (R$)</label>
                <input name="valor_total" type="number" step="0.01" onChange={handleChange} placeholder="0,00" required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>DATA DE EMISSÃO</label>
                <input name="data_abertura" type="date" onChange={handleChange} defaultValue={new Date().toISOString().split('T')[0]} />
              </div>
              <div className="form-group">
                <label>PRAZO DE ENTREGA</label>
                <input name="data_fechamento" type="date" onChange={handleChange} />
              </div>
            </div>
             <div className="form-group">
                <label>NÚMERO OS</label>
                <input name="numero_os" type="text" onChange={handleChange} placeholder="Ex: OS-2024-001" required />
              </div>
            <div className="form-group">
              <label>DESCRIÇÃO DO SERVIÇO</label>
              <textarea name="descricao_servico" onChange={handleChange} rows={3} required></textarea>
            </div>
          </form>
        );

      case "APONTAMENTO":
        return (
          <form className="modal-form">
            <div className="form-row">
              <div className="form-group">
                <label>OPERADOR (ID)</label>
                <input name="usuarioId" type="number" onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>OS (ID)</label>
                <input name="ordemServicoId" type="number" onChange={handleChange} required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>DATA DO TRABALHO</label>
                <input name="data_apontamento" type="date" onChange={handleChange} defaultValue={new Date().toISOString().split('T')[0]} />
              </div>
              <div className="form-group">
                <label>TEMPO (MIN)</label>
                <input name="tempo_execucao" type="number" onChange={handleChange} required />
              </div>
            </div>
             <div className="form-row" style={{ background: "#f8f9fa", padding: "10px", borderRadius: "4px", border: "1px solid #ddd" }}>
              <div className="form-group">
                <label style={{ color: "#d9534f" }}>QTD. MATÉRIA USADA</label>
                <input name="quantidade_utilizada" type="number" onChange={handleChange} placeholder="Insumos" />
              </div>
              <div className="form-group">
                <label style={{ color: "#5cb85c" }}>QTD. PRODUZIDA</label>
                <input name="quantidade_produzida" type="number" onChange={handleChange} placeholder="Resultado" />
              </div>
            </div>
            <div className="form-group">
              <label>OBSERVAÇÃO</label>
              <textarea name="observacao" onChange={handleChange} rows={2}></textarea>
            </div>
          </form>
        );

      case "CLIENTE":
      case "FORNECEDOR":
        return (
          <form className="modal-form">
            <div className="form-group">
              <label>NOME / RAZÃO SOCIAL</label>
              <input name="nome" type="text" onChange={handleChange} required />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>CPF / CNPJ</label>
                <input name="cpf_cnpj" type="text" onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>TELEFONE</label>
                <input name="telefone" type="text" onChange={handleChange} />
              </div>
            </div>
             <div className="form-group">
              <label>EMAIL</label>
              <input name="email" type="email" onChange={handleChange} />
            </div>
             <div className="form-group">
              <label>ENDEREÇO</label>
              <input name="endereco" type="text" onChange={handleChange} />
            </div>
          </form>
        );

      default: return null;
    }
  };

  return (
    <div className="app-container">
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
        title={`NOVO REGISTRO: ${activeModal}`}
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