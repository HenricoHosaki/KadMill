import React, { useEffect, useState } from "react";
import { api } from "../services/api";
import Modal from "../components/Modal";

// --- INTERFACES ---
interface Usuario {
  id: number;
  nome: string;
  email: string;
  funcao: string;
}

interface Apontamento {
  id: number;
  data_apontamento: string;
  quantidade_produzida: number;
  quantidade_utilizada: number;
  tempo_execucao: number;
  observacao?: string;
  usuario?: Usuario;
  usuarioId: number;
  ordemServicoId: number;
}

interface LogSistema {
  id: number;
  data: string;
  acao: string;
  usuario: string;
  detalhes: string;
}

const Admin: React.FC = () => {
  // Estados de Navegação
  const [abaAtiva, setAbaAtiva] = useState("DASHBOARD");
  const [loading, setLoading] = useState(true);

  // Estados de Dados
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [apontamentos, setApontamentos] = useState<Apontamento[]>([]);
  const [logs, setLogs] = useState<LogSistema[]>([]);

  // Estados do Dashboard
  const [dataFiltro, setDataFiltro] = useState(new Date().toISOString().split('T')[0]);

  // Estados de Manipulação de Usuário
  const [modalUsuarioOpen, setModalUsuarioOpen] = useState(false);
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [usuarioEmEdicao, setUsuarioEmEdicao] = useState<any>({ nome: "", email: "", senha: "", funcao: "OPERADOR" });

  // --- CARREGAMENTO DE DADOS ---
  const fetchDados = async () => {
    setLoading(true);
    try {
      const [resUsers, resApont, resLogs] = await Promise.all([
        api.get("/administradores"), // Rota de usuários
        api.get("/apontamentos"),
        api.get("/logs").catch(() => ({ data: [] })) // Fallback se não houver rota de logs
      ]);
      
      setUsuarios(resUsers.data || []);
      setApontamentos(resApont.data || []);
      setLogs(resLogs.data || []);

    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDados();
  }, []);

  // --- LÓGICA DO DASHBOARD ---
  const getDadosGrafico = () => {
    const hoje = new Date();
    const mesAtual = hoje.getMonth();
    const anoAtual = hoje.getFullYear();

    const apontamentosDoMes = apontamentos.filter(ap => {
      const dataAp = new Date(ap.data_apontamento);
      return dataAp.getMonth() === mesAtual && dataAp.getFullYear() === anoAtual;
    });

    const producaoPorUsuario: Record<string, number> = {};
    apontamentosDoMes.forEach(ap => {
      const nomeUser = ap.usuario?.nome || `Operador ${ap.usuarioId}`;
      const qtd = Number(ap.quantidade_produzida || 0);
      producaoPorUsuario[nomeUser] = (producaoPorUsuario[nomeUser] || 0) + qtd;
    });

    const dadosOrdenados = Object.entries(producaoPorUsuario)
      .map(([nome, total]) => ({ nome, total }))
      .sort((a, b) => b.total - a.total);

    const maxValor = Math.max(...dadosOrdenados.map(d => d.total), 1);
    return { dados: dadosOrdenados, maxValor };
  };

  const listaApontamentosFiltrada = apontamentos.filter(ap => 
    ap.data_apontamento && ap.data_apontamento.startsWith(dataFiltro)
  );

  const { dados: dadosGrafico, maxValor } = getDadosGrafico();
  const totalPecasDia = listaApontamentosFiltrada.reduce((acc, curr) => acc + (curr.quantidade_produzida || 0), 0);
  const totalMinutosDia = listaApontamentosFiltrada.reduce((acc, curr) => acc + (curr.tempo_execucao || 0), 0);

  // --- LÓGICA DE USUÁRIOS (CRIAR / EDITAR / EXCLUIR) ---
  const handleOpenNovoUsuario = () => {
    setUsuarioEmEdicao({ nome: "", email: "", senha: "", funcao: "OPERADOR" });
    setIsEditingUser(false);
    setModalUsuarioOpen(true);
  };

  const handleOpenEditarUsuario = (user: Usuario) => {
    setUsuarioEmEdicao({ ...user, senha: "" }); // Senha vazia para não alterar se não quiser
    setIsEditingUser(true);
    setModalUsuarioOpen(true);
  };

  const handleSaveUsuario = async () => {
    try {
      if (!usuarioEmEdicao.nome || !usuarioEmEdicao.email) {
        alert("Preencha nome e email!");
        return;
      }

      if (isEditingUser) {
        // Editar
        await api.put(`/administradores/${usuarioEmEdicao.id}`, usuarioEmEdicao);
        alert("Usuário atualizado com sucesso!");
      } else {
        // Criar Novo
        if (!usuarioEmEdicao.senha) {
            alert("Senha é obrigatória para novos usuários.");
            return;
        }
        await api.post("/administradores", usuarioEmEdicao);
        alert("Usuário criado com sucesso!");
      }
      
      setModalUsuarioOpen(false);
      fetchDados(); // Recarrega lista
    } catch (error) {
      console.error("Erro ao salvar usuário:", error);
      alert("Erro ao salvar usuário. Verifique os dados.");
    }
  };

  const handleDeleteUsuario = async (id: number) => {
    if (window.confirm("Tem certeza que deseja excluir este usuário?")) {
      try {
        await api.delete(`/administradores/${id}`);
        alert("Usuário excluído.");
        fetchDados();
      } catch (error) {
        alert("Erro ao excluir usuário.");
      }
    }
  };

  // --- LÓGICA DE SISTEMA (BACKUP) ---
  const handleBackup = async () => {
    try {
        // Tenta chamar uma rota de backup se existir, ou apenas alerta
        // await api.get('/backup'); 
        alert("Solicitação de Backup enviada! O download iniciará em breve (Simulado).");
        // window.open('http://localhost:3333/backup', '_blank'); // Exemplo real
    } catch (error) {
        alert("Erro ao gerar backup.");
    }
  };

  return (
    <div className="admin-container" style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      
      {/* Cabeçalho e Navegação */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", borderBottom: "1px solid #ddd", paddingBottom: "10px" }}>
        <h2 style={{ margin: 0, color: "#333" }}>Painel Administrativo</h2>
        <div className="tabs" style={{ display: "flex", gap: "10px" }}>
          <button onClick={() => setAbaAtiva("DASHBOARD")} style={getTabStyle(abaAtiva === "DASHBOARD")}>📊 Produção</button>
          <button onClick={() => setAbaAtiva("USUARIOS")} style={getTabStyle(abaAtiva === "USUARIOS")}>👥 Usuários</button>
          <button onClick={() => setAbaAtiva("SISTEMA")} style={getTabStyle(abaAtiva === "SISTEMA")}>⚙️ Sistema</button>
        </div>
      </div>

      {loading ? <p>Carregando dados...</p> : (
        <>
          {/* --- ABA DASHBOARD --- */}
          {abaAtiva === "DASHBOARD" && (
            <div className="dashboard-view">
              {/* Gráfico */}
              <div className="card-box" style={{ marginBottom: "30px" }}>
                <h3 className="card-title">🏆 Produtividade (Mês Atual)</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "15px", marginTop: "15px" }}>
                  {dadosGrafico.length > 0 ? dadosGrafico.map((d, index) => (
                    <div key={d.nome} style={{ display: "flex", alignItems: "center" }}>
                      <div style={{ width: "150px", textAlign: "right", marginRight: "15px", fontWeight: "bold", color: "#444" }}>
                        {index + 1}º {d.nome}
                      </div>
                      <div style={{ flex: 1, background: "#f0f0f0", height: "24px", borderRadius: "4px", overflow: "hidden", position: "relative" }}>
                        <div style={{ width: `${(d.total / maxValor) * 100}%`, background: index === 0 ? "#52c41a" : "#1890ff", height: "100%", transition: "width 0.5s ease" }}></div>
                        <span style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", fontSize: "0.8rem", color: d.total / maxValor > 0.1 ? "white" : "#333", fontWeight: "bold" }}>{d.total} pçs</span>
                      </div>
                    </div>
                  )) : <p style={{ color: "#999", textAlign: "center" }}>Sem dados este mês.</p>}
                </div>
              </div>

              {/* Lista e Filtros */}
              <div className="card-box">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "20px" }}>
                  <div>
                    <h3 className="card-title">📝 Produção Diária</h3>
                    <div style={{ display: "flex", gap: "15px", marginTop: "10px" }}>
                        <InfoBadge label="Total Peças" value={`${totalPecasDia}`} color="#0050b3" bg="#e6f7ff" border="#91d5ff" />
                        <InfoBadge label="Tempo Total" value={`${totalMinutosDia} min`} color="#d46b08" bg="#fff7e6" border="#ffd591" />
                    </div>
                  </div>
                  <div>
                    <label style={{ fontSize: "0.8rem", fontWeight: "bold", display: "block" }}>Data:</label>
                    <input type="date" value={dataFiltro} onChange={(e) => setDataFiltro(e.target.value)} style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }} />
                  </div>
                </div>

                <table className="kadmill-table" style={{ width: "100%" }}>
                    <thead>
                      <tr style={{ background: "#fafafa" }}>
                        <th>Hora</th><th>Operador</th><th>OS</th><th style={{textAlign:"center"}}>Qtd</th><th style={{textAlign:"center"}}>Tempo</th><th>Obs</th>
                      </tr>
                    </thead>
                    <tbody>
                      {listaApontamentosFiltrada.length > 0 ? listaApontamentosFiltrada.map(ap => (
                        <tr key={ap.id}>
                          <td>{new Date(ap.data_apontamento).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</td>
                          <td>{ap.usuario?.nome || ap.usuarioId}</td>
                          <td>#{ap.ordemServicoId}</td>
                          <td style={{ textAlign: "center", fontWeight: "bold", color: "#389e0d" }}>{ap.quantidade_produzida}</td>
                          <td style={{ textAlign: "center" }}>{ap.tempo_execucao} min</td>
                          <td style={{ maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "#777" }}>{ap.observacao || "-"}</td>
                        </tr>
                      )) : <tr><td colSpan={6} style={{ textAlign: "center", padding: "20px", color: "#999" }}>Nada nesta data.</td></tr>}
                    </tbody>
                </table>
              </div>
            </div>
          )}

          {/* --- ABA USUÁRIOS --- */}
          {abaAtiva === "USUARIOS" && (
            <div className="card-box">
               <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                   <h3 className="card-title">Gerenciamento de Equipe</h3>
                   <button onClick={handleOpenNovoUsuario} className="btn-primary">➕ Novo Usuário</button>
               </div>
               
               <table className="kadmill-table" style={{ width: "100%" }}>
                 <thead>
                   <tr>
                     <th>ID</th><th>Nome</th><th>Função</th><th>Email</th><th>Ações</th>
                   </tr>
                 </thead>
                 <tbody>
                   {usuarios.map(u => (
                     <tr key={u.id}>
                       <td>{u.id}</td>
                       <td>{u.nome}</td>
                       <td><span className="status-badge">{u.funcao}</span></td>
                       <td>{u.email}</td>
                       <td>
                           <button onClick={() => handleOpenEditarUsuario(u)} style={{ marginRight: "10px", border: "none", background: "none", cursor: "pointer" }}>✏️</button>
                           <button onClick={() => handleDeleteUsuario(u.id)} style={{ border: "none", background: "none", cursor: "pointer" }}>🗑️</button>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
            </div>
          )}

          {/* --- ABA SISTEMA (BACKUP & LOGS) --- */}
          {abaAtiva === "SISTEMA" && (
            <div className="card-box">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", paddingBottom: "15px", borderBottom: "1px solid #eee" }}>
                    <div>
                        <h3 className="card-title">Manutenção do Sistema</h3>
                        <p style={{ color: "#777", fontSize: "0.9rem", margin: "5px 0" }}>Logs de atividade e cópia de segurança.</p>
                    </div>
                    <button onClick={handleBackup} style={{ background: "#52c41a", color: "white", border: "none", padding: "10px 20px", borderRadius: "5px", cursor: "pointer", fontWeight: "bold", display: "flex", alignItems: "center", gap: "8px" }}>
                        💾 Fazer Backup Completo
                    </button>
                </div>

                <h4 style={{ color: "#555", marginBottom: "10px" }}>Histórico de Atividades (Logs)</h4>
                <div style={{ maxHeight: "400px", overflowY: "auto", border: "1px solid #eee", borderRadius: "4px" }}>
                    <table className="kadmill-table" style={{ width: "100%", margin: 0 }}>
                        <thead style={{ position: "sticky", top: 0, background: "white", zIndex: 1 }}>
                            <tr><th>Data</th><th>Usuário</th><th>Ação</th><th>Detalhes</th></tr>
                        </thead>
                        <tbody>
                            {logs.length > 0 ? logs.map(log => (
                                <tr key={log.id}>
                                    <td>{new Date(log.data).toLocaleString()}</td>
                                    <td>{log.usuario}</td>
                                    <td><strong>{log.acao}</strong></td>
                                    <td>{log.detalhes}</td>
                                </tr>
                            )) : <tr><td colSpan={4} style={{ textAlign: "center", padding: "20px" }}>Sem logs registrados.</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>
          )}
        </>
      )}

      {/* --- MODAL CRIAR/EDITAR USUÁRIO --- */}
      <Modal isOpen={modalUsuarioOpen} onClose={() => setModalUsuarioOpen(false)} title={isEditingUser ? "Editar Usuário" : "Novo Usuário"}>
         <div className="modal-form">
             <div className="form-group">
                 <label>Nome Completo</label>
                 <input type="text" value={usuarioEmEdicao.nome} onChange={e => setUsuarioEmEdicao({...usuarioEmEdicao, nome: e.target.value})} />
             </div>
             <div className="form-group">
                 <label>Email (Login)</label>
                 <input type="email" value={usuarioEmEdicao.email} onChange={e => setUsuarioEmEdicao({...usuarioEmEdicao, email: e.target.value})} />
             </div>
             <div className="form-group">
                 <label>Função</label>
                 <select value={usuarioEmEdicao.funcao} onChange={e => setUsuarioEmEdicao({...usuarioEmEdicao, funcao: e.target.value})}>
                     <option value="OPERADOR">Operador</option>
                     <option value="SUPERVISOR">Supervisor</option>
                     <option value="ADMIN">Administrador</option>
                 </select>
             </div>
             <div className="form-group">
                 <label>{isEditingUser ? "Nova Senha (deixe em branco para manter)" : "Senha"}</label>
                 <input type="password" value={usuarioEmEdicao.senha} onChange={e => setUsuarioEmEdicao({...usuarioEmEdicao, senha: e.target.value})} />
             </div>
             <div className="modal-footer" style={{ marginTop: "20px", display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                 <button className="btn-secondary" onClick={() => setModalUsuarioOpen(false)}>Cancelar</button>
                 <button className="btn-primary" onClick={handleSaveUsuario}>Salvar</button>
             </div>
         </div>
      </Modal>

      {/* Estilos Inline para Simplificação */}
      <style>{`
        .card-box { background: white; padding: 20px; borderRadius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        .card-title { margin: 0; color: #555; font-size: 1.1rem; border-bottom: 1px solid #eee; padding-bottom: 10px; }
      `}</style>
    </div>
  );
};

// Componentes Auxiliares de Estilo
const getTabStyle = (active: boolean) => ({
    padding: "8px 16px",
    background: active ? "#1890ff" : "#f0f0f0",
    color: active ? "white" : "#333",
    border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold"
});

const InfoBadge = ({ label, value, color, bg, border }: any) => (
    <div style={{ background: bg, padding: "10px 15px", borderRadius: "6px", border: `1px solid ${border}`, minWidth: "120px" }}>
        <span style={{ display: "block", fontSize: "0.75rem", color: color, textTransform: "uppercase", fontWeight: "bold" }}>{label}</span>
        <strong style={{ fontSize: "1.2rem", color: color }}>{value}</strong>
    </div>
);

export default Admin;