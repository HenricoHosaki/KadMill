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

  // Estados dos Modais
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
      // O api.ts já mostra o erro visualmente se falhar a conexão
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
    if (filtros.id && !String(item.id).includes(filtros.id)) return false;

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
        if (filtros.termo && !String(item.ordemServicoId).includes(filtros.termo)) return false;
        if (filtros.data && !item.data_apontamento.startsWith(filtros.data)) return false;
        break;
    }
    return true;
  });

  const abrirModal = (item: any, setModal: React.Dispatch<any>) => {
    setModal(item);
    setEditData(item); 
    setIsEditing(false); 
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditData((prev: any) => ({ ...prev, [name]: value }));
  };

  // --- SALVAR EDIÇÃO (LIMPO) ---
  const handleSaveEdit = async () => {
    try {
      let endpoint = "";
      const payload = { ...editData };
      
      const numericFields = [
        "quantidade_estoque", "quantidade_disponivel", "preco_unitario", 
        "custo_unitario", "valor_unitario", "valor_total",
        "quantidade_utilizada", "quantidade_produzida", "tempo_execucao",
        "ferramentaId", "materiaPrimaId", "usuarioId", "ordemServicoId",
        "clienteId", "tempo_total_execucao", "quantidade_esperada"
      ];
      
      numericFields.forEach(field => {
        if(payload[field] !== undefined && payload[field] !== null && payload[field] !== "") {
            payload[field] = Number(payload[field]);
        }
      });

      if (payload.inicio_trabalho === "") payload.inicio_trabalho = null;
      if (payload.fim_trabalho === "") payload.fim_trabalho = null;

      switch (abaAtiva) {
        case "PRODUTO": endpoint = `/produtos/${payload.id}`; break;
        case "MATERIA_PRIMA": endpoint = `/materiasPrimas/${payload.id}`; break;
        case "FERRAMENTA": endpoint = `/ferramentas/${payload.id}`; break;
        case "ORDEM_SERVICO": endpoint = `/ordensServicos/${payload.id}`; break;
        case "APONTAMENTO": endpoint = `/apontamentos/${payload.id}`; break;
      }

      await api.put(endpoint, payload);
      
      // SUCESSO!
      alert("✅ Atualizado com sucesso!");
      setIsEditing(false);
      fetchData(); 
      
      // Atualiza visualmente o modal aberto
      if(osSelecionada && abaAtiva === "ORDEM_SERVICO") setOsSelecionada(payload);
      if(apontamentoSelecionado && abaAtiva === "APONTAMENTO") setApontamentoSelecionado(payload);

    } catch (error) {
      // NÃO FAZ NADA! O api.ts já mostrou o alerta de erro.
    }
  };

  // --- EXCLUIR (LIMPO) ---
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
      
      // SUCESSO!
      alert("✅ Item excluído.");
      
      setProdutoSelecionado(null); setMpSelecionada(null); setFerramentaSelecionada(null); 
      setOsSelecionada(null); setApontamentoSelecionado(null);
      fetchData();
    } catch (error) {
      // NÃO FAZ NADA! O api.ts já mostrou o alerta de erro.
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

  const renderFiltros = () => {
    if (!mostrarFiltros) return null;
    return (
      <div style={{ background: "#f1f1f1", padding: "15px", marginBottom: "20px", borderRadius: "4px", border: "1px solid #ddd", display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "flex-end" }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
            <label style={{ fontSize: "0.8rem", fontWeight: "bold", marginBottom: "3px" }}>ID / CÓDIGO</label>
            <input type="text" placeholder="Ex: 5" value={filtros.id} onChange={(e) => setFiltros({ ...filtros, id: e.target.value })} style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc", width: "80px" }} />
        </div>
        {(abaAtiva !== "APONTAMENTO") && (
            <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
                <label style={{ fontSize: "0.8rem", fontWeight: "bold", marginBottom: "3px" }}>{abaAtiva === "ORDEM_SERVICO" ? "CLIENTE / CNPJ" : "NOME / MODELO"}</label>
                <input type="text" placeholder="Pesquisar..." value={filtros.termo} onChange={(e) => setFiltros({ ...filtros, termo: e.target.value })} style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc", width: "100%" }} />
            </div>
        )}
        {abaAtiva === "APONTAMENTO" && (
             <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={{ fontSize: "0.8rem", fontWeight: "bold", marginBottom: "3px" }}>ID DA OS</label>
                <input type="text" placeholder="OS ID" value={filtros.termo} onChange={(e) => setFiltros({ ...filtros, termo: e.target.value })} style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }} />
            </div>
        )}
        {(abaAtiva === "ORDEM_SERVICO" || abaAtiva === "APONTAMENTO") && (
            <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={{ fontSize: "0.8rem", fontWeight: "bold", marginBottom: "3px" }}>DATA</label>
                <input type="date" value={filtros.data} onChange={(e) => setFiltros({ ...filtros, data: e.target.value })} style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }} />
            </div>
        )}
        {(abaAtiva === "ORDEM_SERVICO" || abaAtiva === "FERRAMENTA") && (
            <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={{ fontSize: "0.8rem", fontWeight: "bold", marginBottom: "3px" }}>STATUS</label>
                <select value={filtros.status} onChange={(e) => setFiltros({ ...filtros, status: e.target.value })} style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}>
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
        <button onClick={() => setFiltros({ termo: "", id: "", status: "TODOS", data: "" })} style={{ padding: "8px 15px", background: "#eee", border: "1px solid #ccc", borderRadius: "4px", cursor: "pointer", height: "35px" }}>Limpar</button>
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
      case "MATERIA_PRIMA": return (<tr {...rowProps(setMpSelecionada)}><td>MP-{item.id}</td><td>{item.nome}</td><td>{item.quantidade_disponivel} {item.unidade_medida}</td><td>{item.fornecedorId}</td><td>{item.ultima_entrada ? new Date(item.ultima_entrada).toLocaleDateString() : "-"}</td></tr>);
      case "PRODUTO": return (<tr {...rowProps(setProdutoSelecionado)}><td>PI-{item.id}</td><td>{item.nome}</td><td>{item.modelo || "-"}</td><td>{item.quantidade_estoque} {item.unidade}</td><td>R$ {Number(item.preco_unitario).toFixed(2)}</td></tr>);
      case "ORDEM_SERVICO": return (<tr {...rowProps(setOsSelecionada)}><td>OS-{item.id}</td><td>{item.cliente?.nome || item.clienteId}</td><td>{new Date(item.data_abertura).toLocaleDateString()}</td><td>{item.cliente?.cpf_cnpj || "-"}</td><td><span className={`status-badge ${item.status}`}>{item.status}</span></td></tr>);
      case "APONTAMENTO": return (<tr {...rowProps(setApontamentoSelecionado)}><td>AP-{item.id}</td><td>OS-{item.ordemServicoId}</td><td>{new Date(item.data_apontamento).toLocaleDateString()}</td><td>{item.tempo_execucao} min</td><td>TOR-{item.usuarioId}</td></tr>);
      case "FERRAMENTA": return (<tr {...rowProps(setFerramentaSelecionada)}><td>FER-{item.id}</td><td>{item.nome}</td><td>{item.tipo}</td><td>{item.quantidade_disponivel}</td><td><span className={`status-badge ${item.status}`}>{item.status}</span></td></tr>);
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
        <div className="filter-icon" onClick={() => setMostrarFiltros(!mostrarFiltros)} style={{ background: mostrarFiltros ? "#e0e0e0" : "white" }}>🔍 Filtro {mostrarFiltros ? "▲" : "▼"}</div>
      </div>

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

      {/* 4. Modal Apontamento (COM NOVOS CAMPOS E EDIÇÃO) */}
      <Modal isOpen={!!apontamentoSelecionado} onClose={() => setApontamentoSelecionado(null)} title={`Apontamento #AP-${apontamentoSelecionado?.id}`}>
        {apontamentoSelecionado && (
            <div className="os-details-view modal-form">
                {!isEditing ? (
                    <>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                            <p><strong>OS ID:</strong> {apontamentoSelecionado.ordemServicoId}</p>
                            <p><strong>Operador ID:</strong> {apontamentoSelecionado.usuarioId}</p>
                            <p><strong>Início:</strong> {apontamentoSelecionado.inicio_trabalho ? new Date(apontamentoSelecionado.inicio_trabalho).toLocaleString() : "-"}</p>
                            <p><strong>Fim:</strong> {apontamentoSelecionado.fim_trabalho ? new Date(apontamentoSelecionado.fim_trabalho).toLocaleString() : "-"}</p>
                            <p><strong>Tempo Total:</strong> {apontamentoSelecionado.tempo_execucao} min</p>
                        </div>
                         <div style={{ marginTop: "15px", padding: "10px", background: "#f8f9fa", borderRadius: "4px", border: "1px solid #ddd" }}>
                            <h4 style={{ fontSize: "0.9rem", color: "#333", marginBottom: "10px" }}>Recursos e Produção</h4>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                                <p><strong>Ferramenta (ID):</strong> {apontamentoSelecionado.ferramentaId || "-"}</p>
                                <p><strong>Matéria Prima (ID):</strong> {apontamentoSelecionado.materiaPrimaId || "-"}</p>
                                <p><strong>Qtd. MP Usada:</strong> {apontamentoSelecionado.quantidade_utilizada}</p>
                                <p><strong>Qtd. Produzida:</strong> {apontamentoSelecionado.quantidade_produzida}</p>
                            </div>
                        </div>
                        <div style={{marginTop: "10px"}}><strong>Obs:</strong> {apontamentoSelecionado.observacao}</div>
                    </>
                ) : (
                    <>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Início Trabalho</label>
                                <input type="datetime-local" name="inicio_trabalho" value={editData.inicio_trabalho ? new Date(editData.inicio_trabalho).toISOString().slice(0, 16) : ""} onChange={handleEditChange} />
                            </div>
                            <div className="form-group">
                                <label>Fim Trabalho</label>
                                <input type="datetime-local" name="fim_trabalho" value={editData.fim_trabalho ? new Date(editData.fim_trabalho).toISOString().slice(0, 16) : ""} onChange={handleEditChange} />
                            </div>
                        </div>
                        <div className="form-row">
                             <div className="form-group"><label>Tempo (min)</label><input type="number" name="tempo_execucao" value={editData.tempo_execucao} onChange={handleEditChange} /></div>
                             <div className="form-group"><label>Data Reg.</label><input type="date" name="data_apontamento" value={editData.data_apontamento ? new Date(editData.data_apontamento).toISOString().split('T')[0] : ""} onChange={handleEditChange} /></div>
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
                        <div className="form-group"><label>Observação</label><textarea name="observacao" value={editData.observacao || ""} onChange={handleEditChange} rows={2} /></div>
                    </>
                )}
                <ModalActions id={apontamentoSelecionado.id} />
            </div>
        )}
      </Modal>

      {/* 5. Modal OS (COM LISTA SEPARADA) */}
      <Modal isOpen={!!osSelecionada} onClose={() => setOsSelecionada(null)} title={`OS #${osSelecionada?.id}`}>
        {osSelecionada && (
            <div className="os-details-view modal-form">
                {!isEditing ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                            <p><strong>Cliente:</strong> {osSelecionada.cliente?.nome || osSelecionada.clienteId}</p>
                            <p><strong>Equipamento:</strong> {osSelecionada.equipamento_utilizado || "-"}</p>
                            <p><strong>Status:</strong> <span className={`status-badge ${osSelecionada.status}`}>{osSelecionada.status}</span></p>
                            <p><strong>Valor Total:</strong> R$ {Number(osSelecionada.valor_total || 0).toFixed(2)}</p>
                        </div>

                        {/* Barra de Progresso (Meta) */}
                        {(() => {
                            const totalProduzido = osSelecionada.apontamentosOrdemServico?.reduce((acc: number, ap: any) => acc + (ap.quantidade_produzida || 0), 0) || 0;
                            const meta = osSelecionada.quantidade_esperada || 0;
                            const falta = meta - totalProduzido;
                            return (
                                <div style={{ background: "#f6ffed", padding: "10px", borderRadius: "4px", border: "1px solid #b7eb8f" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem", marginBottom: "5px" }}>
                                        <span><strong>Meta:</strong> {meta}</span>
                                        <span style={{color: "#389e0d"}}><strong>Feito:</strong> {totalProduzido}</span>
                                        <span style={{color: falta > 0 ? "#d46b08" : "#389e0d"}}><strong>Falta:</strong> {falta > 0 ? falta : 0}</span>
                                    </div>
                                    {meta > 0 && (
                                        <div style={{width: "100%", background: "#ddd", height: "8px", borderRadius: "4px", overflow: "hidden"}}>
                                            <div style={{ width: `${Math.min((totalProduzido / meta) * 100, 100)}%`, background: totalProduzido >= meta ? "#52c41a" : "#faad14", height: "100%" }}></div>
                                        </div>
                                    )}
                                </div>
                            );
                        })()}

                        <div style={{ background: "#e6f7ff", padding: "10px", borderRadius: "4px", border: "1px solid #91d5ff" }}>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px", fontSize: "0.85rem" }}>
                                <div><strong>Início Geral:</strong><br/> {osSelecionada.inicio_servico ? new Date(osSelecionada.inicio_servico).toLocaleString() : "-"}</div>
                                <div><strong>Último Fim:</strong><br/> {osSelecionada.fim_servico ? new Date(osSelecionada.fim_servico).toLocaleString() : "-"}</div>
                                <div><strong>Tempo Total:</strong><br/> {osSelecionada.tempo_total_execucao} min</div>
                            </div>
                        </div>

                        {/* LISTA SEPARADA DE APONTAMENTOS */}
                        <div>
                            <h4 style={{ margin: "0 0 5px 0", fontSize: "0.9rem", borderBottom: "1px solid #eee", paddingBottom: "5px" }}>🔨 Histórico Detalhado</h4>
                            {osSelecionada.apontamentosOrdemServico && osSelecionada.apontamentosOrdemServico.length > 0 ? (
                                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8rem" }}>
                                    <thead>
                                        <tr style={{ background: "#f9f9f9", textAlign: "left" }}>
                                            <th style={{ padding: "5px" }}>Op.</th>
                                            <th style={{ padding: "5px" }}>Início</th>
                                            <th style={{ padding: "5px" }}>Fim</th>
                                            <th style={{ padding: "5px" }}>Tempo</th>
                                            <th style={{ padding: "5px" }}>Prod.</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {osSelecionada.apontamentosOrdemServico.map((ap: any) => (
                                            <tr key={ap.id} style={{ borderBottom: "1px solid #eee" }}>
                                                <td style={{ padding: "5px" }}>{ap.usuario?.nome || ap.usuarioId}</td>
                                                <td style={{ padding: "5px" }}>{ap.inicio_trabalho ? new Date(ap.inicio_trabalho).toLocaleTimeString() : "-"}</td>
                                                <td style={{ padding: "5px" }}>{ap.fim_trabalho ? new Date(ap.fim_trabalho).toLocaleTimeString() : "-"}</td>
                                                <td style={{ padding: "5px" }}>{ap.tempo_execucao} min</td>
                                                <td style={{ padding: "5px" }}>{ap.quantidade_produzida}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : ( <p style={{ color: "#888", fontSize: "0.8rem" }}>Sem apontamentos.</p> )}
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="form-row">
                             <div className="form-group"><label>Meta Produção (Qtd)</label><input type="number" name="quantidade_esperada" value={editData.quantidade_esperada || 0} onChange={handleEditChange} /></div>
                             <div className="form-group"><label>Equipamento</label><input name="equipamento_utilizado" value={editData.equipamento_utilizado || ""} onChange={handleEditChange} /></div>
                        </div>
                        <div className="form-row">
                            <div className="form-group"><label>Valor Total (R$)</label><input type="number" name="valor_total" value={editData.valor_total} onChange={handleEditChange} /></div>
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
                            <div className="form-group"><label>Data de Emissão</label><input type="date" name="data_abertura" value={editData.data_abertura ? new Date(editData.data_abertura).toISOString().split('T')[0] : ""} onChange={handleEditChange} /></div>
                            <div className="form-group"><label>Prazo de Entrega</label><input type="date" name="data_fechamento" value={editData.data_fechamento ? new Date(editData.data_fechamento).toISOString().split('T')[0] : ""} onChange={handleEditChange} /></div>
                        </div>
                        <div className="form-group"><label>Descrição do Serviço</label><textarea name="descricao_servico" rows={3} value={editData.descricao_servico} onChange={handleEditChange} /></div>
                         <div className="form-group"><label>Observação</label><textarea name="observacao" rows={2} value={editData.observacao || ""} onChange={handleEditChange} /></div>
                    </>
                )}
                {/* --- RODAPÉ PERSONALIZADO PARA OS (COM IMPRESSÃO) --- */}
<div className="modal-footer" style={{ marginTop: "20px", borderTop: "1px solid #eee", paddingTop: "15px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
    
    {/* GRUPO ESQUERDA: Ações Extras (Imprimir + Excluir) */}
    <div style={{ display: "flex", gap: "10px" }}>
        
        {/* BOTÃO IMPRIMIR */}
        <button
            type="button"
            onClick={() => window.open(`/imprimir/os/${osSelecionada.id}`, '_blank')}
            style={{
                backgroundColor: "#6c757d",
                color: "white",
                border: "none",
                padding: "8px 15px",
                borderRadius: "4px",
                cursor: "pointer",
                display: "flex", alignItems: "center", gap: "5px"
            }}
            title="Gerar PDF para Impressão"
        >
            🖨️ Imprimir
        </button>

        {/* BOTÃO EXCLUIR (Reutiliza sua função handleDelete existente) */}
        {userIsAdmin && (
            <button
                type="button"
                onClick={() => handleDelete(osSelecionada.id)}
                style={{
                    backgroundColor: "#ff4d4f",
                    color: "white",
                    border: "none",
                    padding: "8px 15px",
                    borderRadius: "4px",
                    cursor: "pointer",
                    display: "flex", alignItems: "center", gap: "5px"
                }}
            >
                🗑️ Excluir
            </button>
        )}
    </div>

    {/* GRUPO DIREITA: Ações de Fluxo (Editar/Salvar) */}
    <div style={{ display: "flex", gap: "10px" }}>
        {!isEditing ? (
            <>
                <button className="btn-secondary" onClick={() => setOsSelecionada(null)}>
                    Fechar
                </button>
                <button 
                    className="btn-primary" 
                    onClick={() => {
                        setEditData(osSelecionada);
                        setIsEditing(true);
                    }}
                >
                    ✏️ Editar
                </button>
            </>
        ) : (
            <>
                <button className="btn-secondary" onClick={() => setIsEditing(false)}>
                    Cancelar
                </button>
                <button className="btn-primary" onClick={handleSaveEdit}>
                    💾 Salvar
                </button>
            </>
        )}
    </div>
</div>
            </div>
        )}
      </Modal>
    </div>
  );
};

export default Estoque;