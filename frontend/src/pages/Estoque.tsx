import React, { useState, useEffect } from "react";
import { api } from "../services/api";
import Modal from "../components/Modal";
import { isAdmin } from "../utils/authUtils";

type AbaTipo = "PRODUTO" | "MATERIA_PRIMA" | "ORDEM_SERVICO" | "APONTAMENTO" | "FERRAMENTA";

const Estoque: React.FC = () => {
  const [abaAtiva, setAbaAtiva] = useState<AbaTipo>("MATERIA_PRIMA");
  const [dados, setDados] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const userIsAdmin = isAdmin();

  // --- ESTADOS DE FILTRO ---
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [filtros, setFiltros] = useState({
    termo: "",      // Para Nome, Descrição, Modelo
    id: "",         // Para IDs específicos
    status: "TODOS",// Para Status (OS, Ferramenta)
    data: ""        // Para datas específicas
  });

  // Estados dos Modais (Visualização/Edição)
  const [osSelecionada, setOsSelecionada] = useState<any | null>(null);
  const [apontamentoSelecionado, setApontamentoSelecionado] = useState<any | null>(null);
  const [produtoSelecionado, setProdutoSelecionado] = useState<any | null>(null);
  const [mpSelecionada, setMpSelecionada] = useState<any | null>(null);
  const [ferramentaSelecionada, setFerramentaSelecionada] = useState<any | null>(null);

  // Estados de Edição
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<any>({});

  // Resetar filtros ao trocar de aba
  useEffect(() => {
    setFiltros({ termo: "", id: "", status: "TODOS", data: "" });
  }, [abaAtiva]);

  const fetchData = async () => {
    setLoading(true);
    try {
      let endpoint = "";
      switch (abaAtiva) {
        case "PRODUTO": endpoint = "/produtos"; break;
        case "MATERIA_PRIMA": endpoint = "/materiasPrimas"; break;
        case "ORDEM_SERVICO": endpoint = "/ordensServicos"; break;
        case "APONTAMENTO": endpoint = "/apontamentos"; break;
        case "FERRAMENTA": endpoint = "/ferramentas"; break;
      }
      
      const response = await api.get(endpoint);
      setDados(response.data);
    } catch (error) {
      console.error(`Erro ao buscar dados:`, error);
      setDados([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [abaAtiva]);

  // --- LÓGICA DE FILTRAGEM ---
  const dadosFiltrados = dados.filter((item) => {
    // 1. Filtro por ID (Genérico para todos)
    if (filtros.id && !String(item.id).includes(filtros.id)) return false;

    // 2. Filtros Específicos por Aba
    switch (abaAtiva) {
      case "PRODUTO":
        if (filtros.termo && !item.nome.toLowerCase().includes(filtros.termo.toLowerCase()) && 
            !item.modelo?.toLowerCase().includes(filtros.termo.toLowerCase())) return false;
        break;

      case "MATERIA_PRIMA":
        if (filtros.termo && !item.nome.toLowerCase().includes(filtros.termo.toLowerCase())) return false;
        break;

      case "FERRAMENTA":
        if (filtros.termo && !item.nome.toLowerCase().includes(filtros.termo.toLowerCase()) &&
            !item.tipo.toLowerCase().includes(filtros.termo.toLowerCase())) return false;
        if (filtros.status !== "TODOS" && item.status !== filtros.status) return false;
        break;

      case "ORDEM_SERVICO":
        // Filtro por Nome do Cliente ou CNPJ (acessando o objeto cliente aninhado)
        if (filtros.termo) {
            const termo = filtros.termo.toLowerCase();
            const clienteNome = item.cliente?.nome?.toLowerCase() || "";
            const clienteDoc = item.cliente?.cpf_cnpj || "";
            if (!clienteNome.includes(termo) && !clienteDoc.includes(termo)) return false;
        }
        if (filtros.status !== "TODOS" && item.status !== filtros.status) return false;
        if (filtros.data && !item.data_abertura.startsWith(filtros.data)) return false;
        break;

      case "APONTAMENTO":
        // Filtro "Termo" aqui serve para buscar pelo ID da OS vinculada
        if (filtros.termo && !String(item.ordemServicoId).includes(filtros.termo)) return false;
        if (filtros.data && !item.data_apontamento.startsWith(filtros.data)) return false;
        break;
    }

    return true;
  });

  // --- LÓGICA DE EDIÇÃO E EXCLUSÃO (MANTIDA) ---
  const abrirModal = (item: any, setModal: React.Dispatch<any>) => {
    setModal(item);
    setEditData(item); 
    setIsEditing(false); 
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSaveEdit = async () => {
    try {
      let endpoint = "";
      const payload = { ...editData };
      
      const numericFields = [
        "quantidade_estoque", "quantidade_disponivel", "preco_unitario", 
        "custo_unitario", "valor_unitario", "valor_total",
        "quantidade_utilizada", "quantidade_produzida", "tempo_execucao",
        "ferramentaId", "materiaPrimaId", "usuarioId", "ordemServicoId"
      ];
      
      numericFields.forEach(field => {
        if(payload[field]) payload[field] = Number(payload[field]);
      });

      switch (abaAtiva) {
        case "PRODUTO": endpoint = `/produtos/${payload.id}`; break;
        case "MATERIA_PRIMA": endpoint = `/materiasPrimas/${payload.id}`; break;
        case "FERRAMENTA": endpoint = `/ferramentas/${payload.id}`; break;
        case "ORDEM_SERVICO": endpoint = `/ordensServicos/${payload.id}`; break;
        case "APONTAMENTO": endpoint = `/apontamentos/${payload.id}`; break;
      }

      await api.put(endpoint, payload);
      alert("Atualizado com sucesso!");
      setIsEditing(false);
      fetchData(); 
      
      if(produtoSelecionado) setProdutoSelecionado(payload);
      if(mpSelecionada) setMpSelecionada(payload);
      if(ferramentaSelecionada) setFerramentaSelecionada(payload);
      if(osSelecionada) setOsSelecionada(payload);
      if(apontamentoSelecionado) setApontamentoSelecionado(payload);

    } catch (error) {
      console.error("Erro ao atualizar:", error);
      alert("Erro ao atualizar o registro.");
    }
  };

  const handleDelete = async (id: number) => {
    if(!window.confirm("Tem certeza que deseja EXCLUIR este item?")) return;
    try {
      let endpoint = "";
      switch (abaAtiva) {
        case "PRODUTO": endpoint = `/produtos/${id}`; break;
        case "MATERIA_PRIMA": endpoint = `/materiasPrimas/${id}`; break;
        case "FERRAMENTA": endpoint = `/ferramentas/${id}`; break;
        case "ORDEM_SERVICO": endpoint = `/ordensServicos/${id}`; break;
        case "APONTAMENTO": endpoint = `/apontamentos/${id}`; break;
      }
      await api.delete(endpoint);
      alert("Item excluído.");
      setProdutoSelecionado(null); setMpSelecionada(null); setFerramentaSelecionada(null); setOsSelecionada(null); setApontamentoSelecionado(null);
      fetchData();
    } catch (error) {
      alert("Erro ao excluir.");
    }
  };

  const ModalActions = ({ id }: { id: number }) => (
    <div style={{ marginTop: "20px", borderTop: "1px solid #eee", paddingTop: "15px", display: "flex", justifyContent: "space-between" }}>
        <div>
            {userIsAdmin && (
                <button onClick={() => handleDelete(id)} style={{ background: "#ff4d4f", color: "white", border: "none", padding: "8px 15px", borderRadius: "4px", cursor: "pointer", marginRight: "10px" }}>🗑️ Excluir</button>
            )}
        </div>
        <div>
            {isEditing ? (
                <>
                    <button onClick={() => setIsEditing(false)} className="btn-secondary" style={{ marginRight: "10px" }}>Cancelar</button>
                    <button onClick={handleSaveEdit} className="btn-primary">💾 Salvar</button>
                </>
            ) : (
                <button onClick={() => setIsEditing(true)} className="btn-primary">✏️ Editar</button>
            )}
        </div>
    </div>
  );

  // --- RENDERIZAÇÃO DA BARRA DE FILTROS ---
  const renderFiltros = () => {
    if (!mostrarFiltros) return null;

    return (
      <div style={{ background: "#f1f1f1", padding: "15px", marginBottom: "20px", borderRadius: "4px", border: "1px solid #ddd", display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "flex-end" }}>
        
        {/* Filtro ID (Comum a todos) */}
        <div style={{ display: "flex", flexDirection: "column" }}>
            <label style={{ fontSize: "0.8rem", fontWeight: "bold", marginBottom: "3px" }}>ID / CÓDIGO</label>
            <input 
                type="text" 
                placeholder="Ex: 5" 
                value={filtros.id}
                onChange={(e) => setFiltros({ ...filtros, id: e.target.value })}
                style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc", width: "80px" }}
            />
        </div>

        {/* Filtro Texto (Nome, Modelo, Cliente) - Variável */}
        {(abaAtiva !== "APONTAMENTO") && (
            <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
                <label style={{ fontSize: "0.8rem", fontWeight: "bold", marginBottom: "3px" }}>
                    {abaAtiva === "ORDEM_SERVICO" ? "CLIENTE / CNPJ" : "NOME / MODELO"}
                </label>
                <input 
                    type="text" 
                    placeholder="Pesquisar..." 
                    value={filtros.termo}
                    onChange={(e) => setFiltros({ ...filtros, termo: e.target.value })}
                    style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc", width: "100%" }}
                />
            </div>
        )}

        {/* Filtro Específico Apontamento */}
        {abaAtiva === "APONTAMENTO" && (
             <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={{ fontSize: "0.8rem", fontWeight: "bold", marginBottom: "3px" }}>ID DA OS</label>
                <input 
                    type="text" 
                    placeholder="OS ID" 
                    value={filtros.termo}
                    onChange={(e) => setFiltros({ ...filtros, termo: e.target.value })}
                    style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
                />
            </div>
        )}

        {/* Filtro Data (OS e Apontamento) */}
        {(abaAtiva === "ORDEM_SERVICO" || abaAtiva === "APONTAMENTO") && (
            <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={{ fontSize: "0.8rem", fontWeight: "bold", marginBottom: "3px" }}>DATA</label>
                <input 
                    type="date" 
                    value={filtros.data}
                    onChange={(e) => setFiltros({ ...filtros, data: e.target.value })}
                    style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
                />
            </div>
        )}

        {/* Filtro Status (OS e Ferramenta) */}
        {(abaAtiva === "ORDEM_SERVICO" || abaAtiva === "FERRAMENTA") && (
            <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={{ fontSize: "0.8rem", fontWeight: "bold", marginBottom: "3px" }}>STATUS</label>
                <select 
                    value={filtros.status}
                    onChange={(e) => setFiltros({ ...filtros, status: e.target.value })}
                    style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
                >
                    <option value="TODOS">Todos</option>
                    <option value="ATIVO">Ativo</option>
                    <option value="INATIVO">Inativo</option>
                    {abaAtiva === "ORDEM_SERVICO" && (
                        <>
                            <option value="ABERTA">Aberta</option>
                            <option value="EM_ANDAMENTO">Em Andamento</option>
                            <option value="CONCLUIDA">Concluída</option>
                            <option value="CANCELADA">Cancelada</option>
                        </>
                    )}
                </select>
            </div>
        )}

        <button 
            onClick={() => setFiltros({ termo: "", id: "", status: "TODOS", data: "" })}
            style={{ padding: "8px 15px", background: "#eee", border: "1px solid #ccc", borderRadius: "4px", cursor: "pointer", height: "35px" }}
        >
            Limpar
        </button>
      </div>
    );
  };

  const renderTableHead = () => {
    switch (abaAtiva) {
      case "MATERIA_PRIMA": return (<tr><th>Código</th><th>Nome</th><th>Quantidade</th><th>Fornecedor</th><th>Última entrada</th></tr>);
      case "PRODUTO": return (<tr><th>Código</th><th>Nome</th><th>Modelo</th><th>Quantidade</th><th>Preço unidade</th></tr>);
      case "ORDEM_SERVICO": return (<tr><th>Código</th><th>Cliente</th><th>Data de emissão</th><th>CNPJ/CPF</th><th>Status</th></tr>);
      case "APONTAMENTO": return (<tr><th>Código</th><th>Ordem de serviço</th><th>Data da criação</th><th>Tempo de execução</th><th>Operador</th></tr>);
      case "FERRAMENTA": return (<tr><th>Código</th><th>Nome</th><th>Tipo</th><th>Qtd. Disponível</th><th>Status</th></tr>);
    }
  };

  const renderTableRow = (item: any) => {
    const rowProps = (setter: any) => ({
        key: item.id,
        onClick: () => abrirModal(item, setter),
        style: { cursor: "pointer" },
        title: "Clique para ver detalhes"
    });

    switch (abaAtiva) {
      case "MATERIA_PRIMA":
        return (
          <tr {...rowProps(setMpSelecionada)}>
            <td>MP-{item.id}</td><td>{item.nome}</td><td>{item.quantidade_disponivel} {item.unidade_medida}</td><td>{item.fornecedorId}</td><td>{item.ultima_entrada ? new Date(item.ultima_entrada).toLocaleDateString() : "-"}</td>
          </tr>
        );
      case "PRODUTO":
        return (
          <tr {...rowProps(setProdutoSelecionado)}>
            <td>PI-{item.id}</td><td>{item.nome}</td><td>{item.modelo || "-"}</td><td>{item.quantidade_estoque} {item.unidade}</td><td>R$ {Number(item.preco_unitario).toFixed(2)}</td>
          </tr>
        );
      case "ORDEM_SERVICO":
        return (
          <tr {...rowProps(setOsSelecionada)}>
            <td>OS-{item.id}</td><td>{item.cliente?.nome || item.clienteId}</td><td>{new Date(item.data_abertura).toLocaleDateString()}</td><td>{item.cliente?.cpf_cnpj || "-"}</td><td><span className={`status-badge ${item.status}`}>{item.status}</span></td>
          </tr>
        );
      case "APONTAMENTO":
        return (
          <tr {...rowProps(setApontamentoSelecionado)}>
            <td>AP-{item.id}</td><td>OS-{item.ordemServicoId}</td><td>{new Date(item.data_apontamento).toLocaleDateString()}</td><td>{item.tempo_execucao} min</td><td>TOR-{item.usuarioId}</td>
          </tr>
        );
      case "FERRAMENTA":
        return (
          <tr {...rowProps(setFerramentaSelecionada)}>
            <td>FER-{item.id}</td><td>{item.nome}</td><td>{item.tipo}</td><td>{item.quantidade_disponivel}</td><td><span className={`status-badge ${item.status}`}>{item.status}</span></td>
          </tr>
        );
    }
  };

  return (
    <div className="estoque-container">
      <div className="page-header">
        <div className="tabs">
          <button onClick={() => setAbaAtiva("MATERIA_PRIMA")} className={abaAtiva === "MATERIA_PRIMA" ? "selected" : ""}>Matéria Prima</button>
          <button onClick={() => setAbaAtiva("PRODUTO")} className={abaAtiva === "PRODUTO" ? "selected" : ""}>Produto</button>
          <button onClick={() => setAbaAtiva("FERRAMENTA")} className={abaAtiva === "FERRAMENTA" ? "selected" : ""}>Ferramentas</button>
          <button onClick={() => setAbaAtiva("ORDEM_SERVICO")} className={abaAtiva === "ORDEM_SERVICO" ? "selected" : ""}>Ordem de Serviço</button>
          <button onClick={() => setAbaAtiva("APONTAMENTO")} className={abaAtiva === "APONTAMENTO" ? "selected" : ""}>Apontamento</button>
        </div>
        <div 
            className="filter-icon" 
            onClick={() => setMostrarFiltros(!mostrarFiltros)}
            style={{ background: mostrarFiltros ? "#e0e0e0" : "white" }}
        >
            🔍 Filtro {mostrarFiltros ? "▲" : "▼"}
        </div>
      </div>

      {/* RENDERIZA OS FILTROS AQUI */}
      {renderFiltros()}

      <div className="table-container">
        <table className="kadmill-table">
          <thead>{renderTableHead()}</thead>
          <tbody>
            {loading ? <tr><td colSpan={5} style={{textAlign: "center"}}>Carregando...</td></tr> : 
             dadosFiltrados.length > 0 ? dadosFiltrados.map(item => renderTableRow(item)) : 
             <tr><td colSpan={5} style={{textAlign: "center", padding: "20px"}}>Nenhum dado encontrado para os filtros aplicados.</td></tr>}
          </tbody>
        </table>
      </div>

      {/* --- MODAIS COM EDIÇÃO --- */}
      {/* 1. Modal Produto */}
      <Modal isOpen={!!produtoSelecionado} onClose={() => setProdutoSelecionado(null)} title={`Detalhes do Produto #PI-${produtoSelecionado?.id}`}>
        {produtoSelecionado && (
          <div className="os-details-view modal-form">
            {!isEditing ? (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                    <p><strong>Nome:</strong> {produtoSelecionado.nome}</p>
                    <p><strong>Tipo:</strong> {produtoSelecionado.tipo}</p>
                    <p><strong>Modelo:</strong> {produtoSelecionado.modelo || "-"}</p>
                    <p><strong>Unidade:</strong> {produtoSelecionado.unidade}</p>
                    <p><strong>Preço:</strong> R$ {Number(produtoSelecionado.preco_unitario).toFixed(2)}</p>
                    <p><strong>Custo:</strong> R$ {Number(produtoSelecionado.custo_unitario).toFixed(2)}</p>
                    <p><strong>Estoque:</strong> {produtoSelecionado.quantidade_estoque}</p>
                    <div style={{gridColumn: "1 / -1"}}><strong>Descrição:</strong> <br/>{produtoSelecionado.descricao}</div>
                </div>
            ) : (
                <>
                    <div className="form-group"><label>Nome</label><input name="nome" value={editData.nome} onChange={handleEditChange} /></div>
                    <div className="form-row">
                        <div className="form-group"><label>Tipo</label><input name="tipo" value={editData.tipo} onChange={handleEditChange} /></div>
                        <div className="form-group"><label>Modelo</label><input name="modelo" value={editData.modelo} onChange={handleEditChange} /></div>
                    </div>
                    <div className="form-row">
                        <div className="form-group"><label>Preço (R$)</label><input type="number" name="preco_unitario" value={editData.preco_unitario} onChange={handleEditChange} /></div>
                        <div className="form-group"><label>Custo (R$)</label><input type="number" name="custo_unitario" value={editData.custo_unitario} onChange={handleEditChange} /></div>
                    </div>
                    <div className="form-row">
                        <div className="form-group"><label>Qtd.</label><input type="number" name="quantidade_estoque" value={editData.quantidade_estoque} onChange={handleEditChange} /></div>
                        <div className="form-group"><label>Unidade</label><select name="unidade" value={editData.unidade} onChange={handleEditChange}><option value="KG">KG</option><option value="UN">UN</option></select></div>
                    </div>
                    <div className="form-group"><label>Descrição</label><textarea name="descricao" value={editData.descricao} onChange={handleEditChange} rows={2} /></div>
                </>
            )}
            <ModalActions id={produtoSelecionado.id} />
          </div>
        )}
      </Modal>

      {/* 2. Modal Matéria Prima */}
      <Modal isOpen={!!mpSelecionada} onClose={() => setMpSelecionada(null)} title={`Detalhes MP #MP-${mpSelecionada?.id}`}>
        {mpSelecionada && (
          <div className="os-details-view modal-form">
            {!isEditing ? (
               <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                  <p><strong>Nome:</strong> {mpSelecionada.nome}</p>
                  <p><strong>Fornecedor ID:</strong> {mpSelecionada.fornecedorId}</p>
                  <p><strong>Qtd:</strong> {mpSelecionada.quantidade_disponivel} {mpSelecionada.unidade_medida}</p>
                  <p><strong>Valor Unit.:</strong> R$ {Number(mpSelecionada.valor_unitario).toFixed(2)}</p>
                  <div style={{gridColumn: "1 / -1"}}><strong>Descrição:</strong> <br/>{mpSelecionada.descricao}</div>
               </div>
            ) : (
                <>
                    <div className="form-group"><label>Nome</label><input name="nome" value={editData.nome} onChange={handleEditChange} /></div>
                    <div className="form-row">
                        <div className="form-group"><label>Qtd.</label><input type="number" name="quantidade_disponivel" value={editData.quantidade_disponivel} onChange={handleEditChange} /></div>
                        <div className="form-group"><label>Valor (R$)</label><input type="number" name="valor_unitario" value={editData.valor_unitario} onChange={handleEditChange} /></div>
                    </div>
                    <div className="form-group"><label>Descrição</label><textarea name="descricao" value={editData.descricao} onChange={handleEditChange} /></div>
                </>
            )}
            <ModalActions id={mpSelecionada.id} />
          </div>
        )}
      </Modal>

      {/* 3. Modal Ferramenta */}
      <Modal isOpen={!!ferramentaSelecionada} onClose={() => setFerramentaSelecionada(null)} title={`Detalhes Ferramenta #FER-${ferramentaSelecionada?.id}`}>
        {ferramentaSelecionada && (
          <div className="os-details-view modal-form">
            {!isEditing ? (
               <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                  <p><strong>Nome:</strong> {ferramentaSelecionada.nome}</p>
                  <p><strong>Tipo:</strong> {ferramentaSelecionada.tipo}</p>
                  <p><strong>Qtd:</strong> {ferramentaSelecionada.quantidade_disponivel}</p>
                  <p><strong>Status:</strong> {ferramentaSelecionada.status}</p>
                  <div style={{gridColumn: "1 / -1"}}><strong>Descrição:</strong> <br/>{ferramentaSelecionada.descricao}</div>
               </div>
            ) : (
                <>
                    <div className="form-group"><label>Nome</label><input name="nome" value={editData.nome} onChange={handleEditChange} /></div>
                    <div className="form-row">
                        <div className="form-group"><label>Tipo</label><input name="tipo" value={editData.tipo} onChange={handleEditChange} /></div>
                        <div className="form-group"><label>Qtd.</label><input type="number" name="quantidade_disponivel" value={editData.quantidade_disponivel} onChange={handleEditChange} /></div>
                    </div>
                    <div className="form-group"><label>Status</label>
                        <select name="status" value={editData.status} onChange={handleEditChange}>
                            <option value="ATIVO">Ativo</option>
                            <option value="INATIVO">Inativo</option>
                        </select>
                    </div>
                    <div className="form-group"><label>Descrição</label><textarea name="descricao" value={editData.descricao} onChange={handleEditChange} /></div>
                </>
            )}
            <ModalActions id={ferramentaSelecionada.id} />
          </div>
        )}
      </Modal>

      {/* 4. Modal Apontamento */}
      <Modal isOpen={!!apontamentoSelecionado} onClose={() => setApontamentoSelecionado(null)} title={`Apontamento #AP-${apontamentoSelecionado?.id}`}>
        {apontamentoSelecionado && (
            <div className="os-details-view modal-form">
                {!isEditing ? (
                    // --- MODO VISUALIZAÇÃO ---
                    <>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                            <p><strong>OS ID:</strong> {apontamentoSelecionado.ordemServicoId}</p>
                            <p><strong>Operador ID:</strong> {apontamentoSelecionado.usuarioId}</p>
                            <p><strong>Data:</strong> {new Date(apontamentoSelecionado.data_apontamento).toLocaleDateString()}</p>
                            <p><strong>Tempo:</strong> {apontamentoSelecionado.tempo_execucao} min</p>
                        </div>

                        <div style={{ marginTop: "15px", padding: "10px", background: "#f8f9fa", borderRadius: "4px", border: "1px solid #ddd" }}>
                            <h4 style={{ fontSize: "0.9rem", color: "#333", marginBottom: "10px", borderBottom: "1px solid #ddd", paddingBottom: "5px" }}>Recursos e Produção</h4>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                                <p><strong>Ferramenta (ID):</strong> {apontamentoSelecionado.ferramentaId || "-"}</p>
                                <p><strong>Matéria Prima (ID):</strong> {apontamentoSelecionado.materiaPrimaId || "-"}</p>
                                <p><strong>Qtd. MP Usada:</strong> {apontamentoSelecionado.quantidade_utilizada}</p>
                                <p><strong>Qtd. Produzida:</strong> {apontamentoSelecionado.quantidade_produzida}</p>
                            </div>
                        </div>

                        <div style={{marginTop: "15px"}}>
                            <strong>Observação:</strong> <br/>
                            <span style={{color: "#555"}}>{apontamentoSelecionado.observacao || "Sem observações."}</span>
                        </div>
                    </>
                ) : (
                    // --- MODO EDIÇÃO ---
                    <>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Data</label>
                                <input 
                                    type="date" 
                                    name="data_apontamento" 
                                    value={editData.data_apontamento ? new Date(editData.data_apontamento).toISOString().split('T')[0] : ""} 
                                    onChange={handleEditChange} 
                                />
                            </div>
                            <div className="form-group">
                                <label>Tempo (min)</label>
                                <input type="number" name="tempo_execucao" value={editData.tempo_execucao} onChange={handleEditChange} />
                            </div>
                        </div>

                        <div style={{ background: "#f8f9fa", padding: "10px", borderRadius: "4px", border: "1px solid #ddd", margin: "10px 0" }}>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>ID Ferramenta</label>
                                    <input type="number" name="ferramentaId" value={editData.ferramentaId || ""} onChange={handleEditChange} placeholder="ID" />
                                </div>
                                <div className="form-group">
                                    <label>ID Matéria Prima</label>
                                    <input type="number" name="materiaPrimaId" value={editData.materiaPrimaId || ""} onChange={handleEditChange} placeholder="ID" />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Qtd. MP Usada</label>
                                    <input type="number" name="quantidade_utilizada" value={editData.quantidade_utilizada} onChange={handleEditChange} />
                                </div>
                                <div className="form-group">
                                    <label>Qtd. Produzida</label>
                                    <input type="number" name="quantidade_produzida" value={editData.quantidade_produzida} onChange={handleEditChange} />
                                </div>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Observação</label>
                            <textarea name="observacao" value={editData.observacao || ""} onChange={handleEditChange} rows={2} />
                        </div>
                    </>
                )}
                <ModalActions id={apontamentoSelecionado.id} />
            </div>
        )}
      </Modal>

      {/* 5. Modal OS */}
      <Modal isOpen={!!osSelecionada} onClose={() => setOsSelecionada(null)} title={`OS #${osSelecionada?.id}`}>
        {osSelecionada && (
            <div className="os-details-view modal-form">
                {!isEditing ? (
                    // --- MODO VISUALIZAÇÃO ---
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                        <p><strong>Cliente:</strong> {osSelecionada.cliente?.nome || osSelecionada.clienteId}</p>
                        <p><strong>CNPJ/CPF:</strong> {osSelecionada.cliente?.cpf_cnpj || "-"}</p>
                        <p><strong>Data de Emissão:</strong> {new Date(osSelecionada.data_abertura).toLocaleDateString()}</p>
                        <p><strong>Prazo de Entrega:</strong> {osSelecionada.data_fechamento ? new Date(osSelecionada.data_fechamento).toLocaleDateString() : "Em aberto"}</p>
                        <p><strong>Status:</strong> <span className={`status-badge ${osSelecionada.status}`}>{osSelecionada.status}</span></p>
                        <p><strong>Valor Total:</strong> R$ {Number(osSelecionada.valor_total || 0).toFixed(2)}</p>
                        
                        <div style={{gridColumn: "1 / -1", marginTop: "10px"}}>
                            <strong>Descrição do Serviço:</strong>
                            <div style={{background: "#f4f4f4", padding: "10px", borderRadius: "4px", marginTop: "5px"}}>
                                {osSelecionada.descricao_servico}
                            </div>
                        </div>
                    </div>
                ) : (
                    // --- MODO EDIÇÃO ---
                    <>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Valor (R$)</label>
                                <input type="number" name="valor_total" value={editData.valor_total} onChange={handleEditChange} />
                            </div>
                            <div className="form-group">
                                <label>Status</label>
                                <select name="status" value={editData.status} onChange={handleEditChange}>
                                    <option value="ABERTA">Aberta</option>
                                    <option value="EM_ANDAMENTO">Em Andamento</option>
                                    <option value="CONCLUIDA">Concluída</option>
                                    <option value="CANCELADA">Cancelada</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Data de Emissão</label>
                                <input 
                                    type="date" 
                                    name="data_abertura" 
                                    value={editData.data_abertura ? new Date(editData.data_abertura).toISOString().split('T')[0] : ""} 
                                    onChange={handleEditChange} 
                                />
                            </div>
                            <div className="form-group">
                                <label>Prazo de Entrega</label>
                                <input 
                                    type="date" 
                                    name="data_fechamento" 
                                    value={editData.data_fechamento ? new Date(editData.data_fechamento).toISOString().split('T')[0] : ""} 
                                    onChange={handleEditChange} 
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Descrição</label>
                            <textarea name="descricao_servico" rows={3} value={editData.descricao_servico} onChange={handleEditChange} />
                        </div>
                        
                         <div className="form-group">
                            <label>Observação</label>
                            <textarea name="observacao" rows={2} value={editData.observacao || ""} onChange={handleEditChange} />
                        </div>
                    </>
                )}
                <ModalActions id={osSelecionada.id} />
            </div>
        )}
      </Modal>

    </div>
  );
};

export default Estoque;