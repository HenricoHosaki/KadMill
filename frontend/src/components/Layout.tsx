import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Modal from "./Modal";
import { api } from "../services/api";
import { isAdmin } from "../utils/authUtils";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const userIsAdmin = isAdmin();
  
  // Estado para o Menu Global (Retrátil)
  const [navOpen, setNavOpen] = useState(false);

  // Estados existentes para o Menu de Ações (Fixo)
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const userId = localStorage.getItem("kadmill:userId") || "Usuário";

  const handleLogout = () => {
    localStorage.removeItem("kadmill:token");
    localStorage.removeItem("kadmill:userId");
    navigate("/login");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  // --- SUA LÓGICA DE SUBMIT ORIGINAL (MANTIDA) ---
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
        case "FERRAMENTA": endpoint = "/ferramentas"; break;
      }

      const payload = { ...formData };

      // 1. CORREÇÃO MATÉRIA PRIMA (Campos Obrigatórios)
      if (activeModal === "MP") {
          // Define padrão se o usuário não mexeu no select
          if (!payload.unidade_medida) payload.unidade_medida = "KG";
          // Define um traço se a descrição estiver vazia (obrigatório no banco)
          if (!payload.descricao) payload.descricao = "-";
      }

      // 2. CORREÇÃO PRODUTO
      if (activeModal === "PRODUTO") {
        if (payload.calculo_custo) {
          payload.custo_unitario = Number(payload.calculo_custo);
          delete payload.calculo_custo;
        }
        if (!payload.unidade) payload.unidade = "KG";
        if (payload.id) payload.id = Number(payload.id);
        else delete payload.id;
      }
      
      const numericFields = [
        "usuarioId", "ordemServicoId", "materiaPrimaId", "ferramentaId",
        "quantidade_utilizada", "quantidade_produzida", "tempo_execucao", 
        "clienteId", "valor_total", "quantidade_disponivel", "preco_custo",
        "quantidade_estoque", "preco_unitario", "fornecedorId", "custo_unitario",
        "numero_os"
      ];
      
      // 3. CORREÇÃO CRÍTICA PARA NÚMEROS
      numericFields.forEach(field => {
        // Se o campo existe mas está vazio (string vazia), removemos do payload
        // para não enviar "" onde o backend espera Int
        if (payload[field] === "") {
            delete payload[field];
        } 
        // Se tem valor, converte para número
        else if (payload[field] !== undefined) {
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
      // O alerta agora mostrará a mensagem de erro do backend se houver
      alert(error.response?.data?.message || error.response?.data?.error || "Erro ao salvar o registro.");
    } finally {
      setLoading(false);
    }
  };

  // --- SEU CONTEÚDO DE MODAL ORIGINAL (COM OS NOVOS CAMPOS ADICIONADOS) ---
  const renderModalContent = () => {
    switch (activeModal) {
      case "PRODUTO":
        return (
          <form className="modal-form">
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
            
            {/* NOVO CAMPO ADICIONADO AQUI */}
            <div className="form-group">
              <label>EQUIPAMENTO UTILIZADO</label>
              <input 
                name="equipamento_utilizado" 
                type="text" 
                onChange={handleChange} 
                placeholder="Ex: Torno CNC, Solda MIG..." 
              />
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
            {/* Bloco 1: Quem e Onde */}
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

            {/* Bloco 2: Quando (ALTERADO PARA INICIO/FIM) */}
            <div className="form-row">
              <div className="form-group">
                <label>INÍCIO DA EXECUÇÃO</label>
                <input 
                  name="data_inicio" 
                  type="datetime-local" 
                  onChange={handleChange} 
                  required 
                />
              </div>
              <div className="form-group">
                <label>FIM DA EXECUÇÃO</label>
                <input 
                  name="data_fim" 
                  type="datetime-local" 
                  onChange={handleChange} 
                  required 
                />
              </div>
            </div>
            
            {/* Campo oculto ou apenas informativo se necessário, data de registro */}
            <div className="form-group">
                <label>DATA DE REGISTRO</label>
                <input name="data_apontamento" type="date" onChange={handleChange} defaultValue={new Date().toISOString().split('T')[0]} disabled />
            </div>

             {/* Bloco 3: Recursos e Produção (ATUALIZADO) */}
             <div style={{ background: "#f8f9fa", padding: "10px", borderRadius: "4px", border: "1px solid #ddd" }}>
                
                {/* Linha de Recursos: MP e Ferramenta */}
                <div className="form-row" style={{ marginBottom: "10px" }}>
                    <div className="form-group">
                        <label>ID MATÉRIA PRIMA</label>
                        <input name="materiaPrimaId" type="number" onChange={handleChange} placeholder="Opcional" />
                    </div>
                    <div className="form-group">
                        <label>ID FERRAMENTA</label>
                        <input name="ferramentaId" type="number" onChange={handleChange} placeholder="Opcional" />
                    </div>
                </div>

                {/* Linha de Quantidades */}
                <div className="form-row">
                    <div className="form-group">
                        <label style={{ color: "#d9534f" }}>QTD. MP USADA</label>
                        <input name="quantidade_utilizada" type="number" onChange={handleChange} placeholder="Kg / Unid" />
                    </div>
                    <div className="form-group">
                        <label style={{ color: "#5cb85c" }}>QTD. PRODUZIDA</label>
                        <input name="quantidade_produzida" type="number" onChange={handleChange} placeholder="Peças Feitas" />
                    </div>
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
            
            {/* ADICIONE ESTE BLOCO APENAS SE FOR FORNECEDOR */}
            {activeModal === "FORNECEDOR" && (
                <div className="form-group">
                  <label>PESSOA DE CONTATO</label>
                  <input name="contato" type="text" onChange={handleChange} placeholder="Ex: Sr. Carlos" required />
                </div>
            )}

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

        case "FERRAMENTA":
        return (
          <form className="modal-form">
            <div className="form-row">
              <div className="form-group">
                <label>NOME DA FERRAMENTA</label>
                <input name="nome" type="text" onChange={handleChange} placeholder="Ex: Broca 15mm" required />
              </div>
              <div className="form-group">
                <label>TIPO</label>
                <input name="tipo" type="text" onChange={handleChange} placeholder="Ex: Corte" required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>QUANTIDADE DISPONÍVEL</label>
                <input name="quantidade_disponivel" type="number" onChange={handleChange} placeholder="0" required />
              </div>
              <div className="form-group">
                <label>STATUS</label>
                <select name="status" onChange={handleChange} defaultValue="ATIVO">
                  <option value="ATIVO">Ativo</option>
                  <option value="INATIVO">Inativo</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>DESCRIÇÃO</label>
              <textarea name="descricao" onChange={handleChange} rows={2} required></textarea>
            </div>
          </form>
        );

      default: return null;
    }
  };

  // --- NOVA ESTRUTURA DE NAVEGAÇÃO ---
  
  // Define se o menu lateral de ações (o antigo) deve aparecer
  const showActionSidebar = location.pathname === "/estoque" || location.pathname === "/contatos";

  return (
    <div className="root-layout" style={{ display: 'flex', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      
      {/* 1. NOVO MENU DE NAVEGAÇÃO GLOBAL (Esquerda Extrema, Retrátil) */}
      <aside className={`global-nav ${!navOpen ? "collapsed" : ""}`}>
        <div className="nav-header">
            <button className="toggle-btn" onClick={() => setNavOpen(!navOpen)}>
               {navOpen ? "◀" : "☰"}
            </button>
        </div>
        <ul className="global-links">
            <li>
                <Link to="/" title="Início">
                    <span className="icon">🏠</span> 
                    {navOpen && <span>Início</span>}
                </Link>
            </li>
            <li>
                <Link to="/estoque" title="Estoque">
                    <span className="icon">📦</span> 
                    {navOpen && <span>Estoque</span>}
                </Link>
            </li>
            <li>
                <Link to="/contatos" title="Contatos">
                    <span className="icon">👥</span> 
                    {navOpen && <span>Contatos</span>}
                </Link>
            </li>
            {userIsAdmin && (
                <li>
                    <Link to="/admin" title="Admin" style={{color: '#c5a059'}}>
                        <span className="icon">🛡️</span> 
                        {navOpen && <span>Admin</span>}
                    </Link>
                </li>
            )}
        </ul>
        <div className="nav-footer">
            <button onClick={handleLogout} title="Sair">
                <span className="icon">🚪</span> 
                {navOpen && <span>Sair</span>}
            </button>
        </div>
      </aside>

      {/* 2. ÁREA PRINCIPAL (Header + Sidebar de Ações + Conteúdo) */}
      <div className="app-container" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        
        {/* Cabeçalho Superior (Agora só com User Info, sem links de navegação) */}
        <header className="top-nav">
            <div className="nav-left-group">
                <h2 style={{color: "white", fontSize: "1.2rem", marginLeft: "10px", margin: 0}}>
                    {location.pathname === "/" ? "INÍCIO" : 
                     location.pathname === "/admin" ? "ADMINISTRAÇÃO" :
                     location.pathname.replace("/", "").toUpperCase()}
                </h2>
            </div>
            <div className="nav-user-info">
                <span className="user-name">Logado como: <strong>ID {userId}</strong></span>
            </div>
        </header>

        <div className="main-content" style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
            
            {/* 3. MENU DE AÇÕES FIXO (O seu menu antigo, só em Estoque/Contatos) */}
            {showActionSidebar && (
                <aside className="sidebar" style={{ width: "250px", borderRight: "1px solid #ddd", background: "#f4f4f4", display: "flex", flexDirection: "column" }}>
                    <div className="sidebar-content" style={{ padding: "20px" }}>
                        <h3 style={{ fontSize: "0.9rem", color: "#888", marginBottom: "15px", textTransform: "uppercase" }}>Ações Rápidas</h3>
                        <ul className="sidebar-list">
                        {(location.pathname === "/contatos" ? 
                            [{ label: "Registrar cliente", id: "CLIENTE" }, { label: "Registrar fornecedor", id: "FORNECEDOR" }] :
                            [{ label: "Criar ordem de serviço", id: "OS" }, { label: "Gerar apontamento", id: "APONTAMENTO" }, { label: "Registrar matéria prima", id: "MP" }, { label: "Registrar produto", id: "PRODUTO" }, { label: "Cadastrar Ferramenta", id: "FERRAMENTA" }]
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
            )}

            {/* Conteúdo da Página */}
            <main className="page-body" style={{ flex: 1, overflowY: "auto", padding: "20px" }}>
                {children}
            </main>
        </div>
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