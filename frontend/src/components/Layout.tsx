import React, { useState, useEffect } from "react";
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

  // --- Estados para as Listas dos Selects ---
  const [listaFerramentas, setListaFerramentas] = useState<any[]>([]);
  const [listaMaterias, setListaMaterias] = useState<any[]>([]);

  // --- CORREÇÃO AQUI: Ler Nome e ID ---
  const [userId, setUserId] = useState<string>("Usuário");
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    // Busca os dados do localStorage ao carregar o componente
    const storedId = localStorage.getItem("kadmill:userId");
    const storedName = localStorage.getItem("kadmill:userName");

    if (storedId) setUserId(storedId);
    if (storedName) setUserName(storedName);
  }, []);

  // --- Busca ferramentas e matérias-primas ao carregar o Layout ---
  useEffect(() => {
    const fetchAuxiliares = async () => {
        if (listaFerramentas.length === 0 || listaMaterias.length === 0) {
            try {
                const [resFerr, resMat] = await Promise.all([
                    api.get("/ferramentas"),
                    api.get("/materiasPrimas")
                ]);
                setListaFerramentas(resFerr.data);
                setListaMaterias(resMat.data);
            } catch (error) {
                console.error("Erro ao carregar listas auxiliares no Layout:", error);
            }
        }
    };
    fetchAuxiliares();
  }, [listaFerramentas.length, listaMaterias.length]); // Adicionei dependências para evitar loop

  const handleLogout = () => {
    localStorage.removeItem("kadmill:token");
    localStorage.removeItem("kadmill:userId");
    localStorage.removeItem("kadmill:userName"); // Limpa o nome também
    navigate("/login");
  };

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
        case "FERRAMENTA": endpoint = "/ferramentas"; break;
      }

      const payload = { ...formData };

      // Blocos de correção de dados
      if (activeModal === "MP") {
          if (!payload.unidade_medida) payload.unidade_medida = "KG";
          if (!payload.descricao) payload.descricao = "-";
      }

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
        "numero_os", "tempo_total_execucao", "quantidade_esperada"
      ];
      
      numericFields.forEach(field => {
        if (payload[field] === "") {
            delete payload[field];
        } 
        else if (payload[field] !== undefined) {
          payload[field] = Number(payload[field]);
        }
      });

      // Envia os dados
      const response = await api.post(endpoint, payload);

      // Lógica de Impressão para OS
      if (activeModal === "OS") {
        const novoId = response.data?.id;
        if (novoId) {
          const desejaImprimir = window.confirm("Ordem de Serviço salva! Deseja imprimir agora?");
          if (desejaImprimir) {
            window.open(`/imprimir/os/${novoId}`, '_blank');
          }
        }
      } else {
        alert("Registro salvo com sucesso!");
      }

      // Limpa e recarrega
      setActiveModal(null);
      setFormData({});
      window.location.reload(); 

    } catch (error: any) {
      console.error("Erro ao salvar:", error);
      alert(error.response?.data?.message || error.response?.data?.error || "Erro ao salvar o registro.");
    } finally {
      setLoading(false);
    }
  };

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
                <label>CLIENTE (ID)</label>
                <input name="clienteId" type="number" onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>EQUIPAMENTO</label>
                {/* [MODIFICADO] AGORA USA O SELECT DE FERRAMENTAS */}
                <select 
                    name="equipamento_utilizado" 
                    onChange={handleChange}
                    style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc", width: "100%" }}
                >
                    <option value="">Selecione (Opcional)...</option>
                    {listaFerramentas.map(f => (
                        <option key={f.id} value={f.nome}>{f.nome} - {f.tipo}</option>
                    ))}
                </select>
              </div>
            </div>
            
            <div className="form-row">
                <div className="form-group">
                    <label>VALOR TOTAL (R$)</label>
                    <input name="valor_total" type="number" step="0.01" onChange={handleChange} required />
                </div>
                
                <div className="form-group">
                    <label>TEMPO TOTAL ESTIMADO (Min)</label>
                    <input name="tempo_total_execucao" type="number" onChange={handleChange} />
                </div>
            </div>
                  <div className="form-group">
                    <label>META DE PRODUÇÃO (Qtd.)</label>
                    <input name="quantidade_esperada" type="number" onChange={handleChange} placeholder="Ex: 100" />
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
                <label>INÍCIO TRABALHO</label>
                <input name="inicio_trabalho" type="datetime-local" onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>FIM TRABALHO</label>
                <input name="fim_trabalho" type="datetime-local" onChange={handleChange} />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>DATA REGISTRO</label>
                <input name="data_apontamento" type="date" onChange={handleChange} defaultValue={new Date().toISOString().split('T')[0]} />
              </div>
              <div className="form-group">
                <label>TEMPO (MIN)</label>
                <input name="tempo_execucao" type="number" onChange={handleChange} required />
              </div>
            </div>

             {/* BLOCO DE SELECTS DE INSUMOS */}
             <div style={{ background: "#f8f9fa", padding: "10px", borderRadius: "4px", border: "1px solid #ddd" }}>
                <div className="form-row" style={{ marginBottom: "10px" }}>
                    <div className="form-group">
                        <label>MATÉRIA PRIMA</label>
                        <select 
                            name="materiaPrimaId" 
                            onChange={handleChange}
                            style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc", width: "100%" }}
                        >
                            <option value="">Selecione (Opcional)...</option>
                            {listaMaterias.map(m => (
                                <option key={m.id} value={m.id}>{m.nome} (Qtd: {m.quantidade_disponivel})</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>FERRAMENTA</label>
                        <select 
                            name="ferramentaId" 
                            onChange={handleChange}
                            style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc", width: "100%" }}
                        >
                            <option value="">Selecione (Opcional)...</option>
                            {listaFerramentas.map(f => (
                                <option key={f.id} value={f.id}>{f.nome} - {f.tipo}</option>
                            ))}
                        </select>
                    </div>
                </div>
                
                <div className="form-row">
                    <div className="form-group">
                        <label style={{ color: "#d9534f" }}>QTD. MP USADA</label>
                        <input name="quantidade_utilizada" type="number" onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label style={{ color: "#5cb85c" }}>QTD. PRODUZIDA</label>
                        <input name="quantidade_produzida" type="number" onChange={handleChange} />
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

  const showActionSidebar = location.pathname === "/estoque" || location.pathname === "/contatos";

  return (
    <div className="root-layout" style={{ display: 'flex', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      
      {/* 1. MENU DE NAVEGAÇÃO GLOBAL */}
      <aside className={`global-nav ${!navOpen ? "collapsed" : ""}`}>
        <div className="nav-header">
            <button className="toggle-btn" onClick={() => setNavOpen(!navOpen)}>
               {navOpen ? "◀" : "☰"}
            </button>
        </div>
        <ul className="global-links">
            <li>
                <Link to="/" title="Início">
                    <span className="icon">🌐</span> 
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
                        <span className="icon">🔐</span> 
                        {navOpen && <span>Admin</span>}
                    </Link>
                </li>
            )}
        </ul>
        <div className="nav-footer">
            <button onClick={handleLogout} title="Sair">
                <span className="icon">📤</span> 
                {navOpen && <span>Sair</span>}
            </button>
        </div>
      </aside>

      {/* 2. ÁREA PRINCIPAL */}
      <div className="app-container" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        
        <header className="top-nav">
            <div className="nav-left-group">
                <h2 style={{color: "white", fontSize: "1.2rem", marginLeft: "10px", margin: 0}}>
                    {location.pathname === "/" ? "INÍCIO" : 
                     location.pathname === "/admin" ? "ADMINISTRAÇÃO" :
                     location.pathname.replace("/", "").toUpperCase()}
                </h2>
            </div>
            <div className="nav-user-info">
                {/* --- MUDANÇA VISUAL AQUI --- */}
                <span className="user-name">Logado como: <strong>{userName || `ID ${userId}`}</strong></span>
            </div>
        </header>

        <div className="main-content" style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
            
            {/* 3. MENU DE AÇÕES FIXO */}
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