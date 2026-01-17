import React, { useEffect, useState } from "react";
import { api } from "../services/api";
import Modal from "../components/Modal"; // Importamos o componente Modal que já existe

const Admin: React.FC = () => {
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [backupLoading, setBackupLoading] = useState(false);

  // Estados para Criação de Usuário
  const [showModal, setShowModal] = useState(false);
  const [novoUsuario, setNovoUsuario] = useState({
    nome: "",
    email: "",
    senha: "",
    cpf: "",
    funcao: "OPERADOR", // Valor padrão
    setor: "DIURNO"     // Valor padrão
  });

  useEffect(() => {
    fetchDados();
  }, []);

  const fetchDados = async () => {
    setLoading(true);
    
    // Busca Usuários (Independente)
    try {
      const resUsers = await api.get("/administradores");
      setUsuarios(resUsers.data);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
    }

    // Busca Logs (Independente) - Se falhar (vazio), não quebra a tela
    try {
      const resLogs = await api.get("/relatorios/apontamentos");
      setLogs(resLogs.data);
    } catch (error) {
      console.warn("Sem logs ou erro ao buscar apontamentos:", error);
      setLogs([]); // Garante que a lista fique vazia visualmente
    } finally {
      setLoading(false);
    }
  };

  const handleExcluirUsuario = async (id: number) => {
    if (!window.confirm("Tem certeza que deseja remover o acesso deste usuário?")) return;
    try {
      await api.delete(`/administradores/${id}`);
      alert("Usuário removido.");
      fetchDados();
    } catch {
      alert("Erro ao excluir usuário.");
    }
  };

  const handleDownloadBackup = async () => {
    setBackupLoading(true);
    try {
      const response = await api.get('/administradores/backup', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `kadmill_backup_${new Date().toISOString().slice(0,10)}.sql`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch (error) {
      alert("Erro ao gerar backup.");
    } finally {
      setBackupLoading(false);
    }
  };

  // --- Lógica de Criação de Usuário ---
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setNovoUsuario({ ...novoUsuario, [e.target.name]: e.target.value });
  };

  const handleSalvarUsuario = async () => {
    // Validação básica
    if (novoUsuario.cpf.length !== 11) {
      alert("O CPF deve ter exatamente 11 números (apenas números).");
      return;
    }
    if (novoUsuario.senha.length < 4) {
      alert("A senha deve ter pelo menos 4 caracteres.");
      return;
    }

    try {
      await api.post("/administradores", novoUsuario);
      alert("Usuário criado com sucesso!");
      setShowModal(false);
      setNovoUsuario({ nome: "", email: "", senha: "", cpf: "", funcao: "OPERADOR", setor: "DIURNO" }); // Limpa form
      fetchDados(); // Recarrega a lista
    } catch (error: any) {
      alert(error.response?.data?.message || "Erro ao criar usuário. Verifique se o Email ou CPF já existem.");
    }
  };

  if (loading) return <div style={{padding: "40px", color: "white", textAlign: "center"}}>Carregando Painel...</div>;

  return (
    <div className="admin-container" style={{ padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #444", paddingBottom: "15px", marginBottom: "30px" }}>
        <h2 style={{ color: "white", margin: 0 }}>PAINEL ADMINISTRATIVO</h2>
        <button 
            className="btn-primary" 
            onClick={() => setShowModal(true)}
            style={{ display: "flex", alignItems: "center", gap: "8px" }}
        >
            ➕ Novo Usuário
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
        
        {/* CARD 1: GESTÃO DE USUÁRIOS */}
        <div style={{ background: "white", padding: "20px", borderRadius: "8px", boxShadow: "0 4px 10px rgba(0,0,0,0.2)" }}>
          <h3 style={{ color: "#0b192e", marginBottom: "15px", borderBottom: "2px solid #c5a059", paddingBottom: "5px" }}>
            👥 Equipe Cadastrada
          </h3>
          <div className="table-container" style={{ maxHeight: "300px", overflowY: "auto", border: "none" }}>
            <table className="kadmill-table" style={{ fontSize: "0.85rem" }}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nome / Email</th>
                  <th>Função</th>
                  <th style={{textAlign: "center"}}>Ação</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map(u => (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td>
                      <strong>{u.nome}</strong><br/>
                      <span style={{color: "#666", fontSize: "0.75rem"}}>{u.email}</span>
                    </td>
                    <td>
                        <span style={{ 
                            background: u.funcao === 'ADMIN' ? '#0b192e' : '#eee', 
                            color: u.funcao === 'ADMIN' ? '#c5a059' : '#333',
                            padding: "2px 6px", borderRadius: "4px", fontSize: "0.7rem", fontWeight: "bold"
                        }}>
                            {u.funcao}
                        </span>
                    </td>
                    <td style={{textAlign: "center"}}>
                      {u.funcao !== 'ADMIN' && (
                        <button onClick={() => handleExcluirUsuario(u.id)} className="btn-icon delete" title="Remover Acesso">🗑️</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* CARD 2: BACKUP E MANUTENÇÃO */}
        <div style={{ background: "white", padding: "20px", borderRadius: "8px", boxShadow: "0 4px 10px rgba(0,0,0,0.2)" }}>
          <h3 style={{ color: "#0b192e", marginBottom: "15px", borderBottom: "2px solid #c5a059", paddingBottom: "5px" }}>
            💾 Manutenção de Dados
          </h3>
          <p style={{ fontSize: "0.9rem", color: "#555", marginBottom: "20px" }}>
            Segurança em primeiro lugar. Faça backups regulares do banco de dados para evitar perda de informações.
          </p>
          <button 
            onClick={handleDownloadBackup} 
            disabled={backupLoading}
            style={{
                width: "100%", padding: "15px", 
                background: backupLoading ? "#ccc" : "#0b192e", 
                color: "white", border: "none", borderRadius: "4px", 
                fontWeight: "bold", cursor: backupLoading ? "wait" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "10px"
            }}
          >
            {backupLoading ? "Gerando Arquivo..." : "📥 BAIXAR BACKUP AGORA"}
          </button>
        </div>

        {/* CARD 3: LOGS DE OPERAÇÃO */}
        <div style={{ gridColumn: "1 / -1", background: "white", padding: "20px", borderRadius: "8px", boxShadow: "0 4px 10px rgba(0,0,0,0.2)" }}>
          <h3 style={{ color: "#0b192e", marginBottom: "15px", borderBottom: "2px solid #c5a059", paddingBottom: "5px" }}>
            📋 Logs de Produção (Apontamentos Recentes)
          </h3>
          <div className="table-container" style={{ maxHeight: "400px", overflowY: "auto", border: "none" }}>
            <table className="kadmill-table">
              <thead>
                <tr>
                  <th>Data/Hora</th>
                  <th>Operador (ID)</th>
                  <th>OS Vinculada</th>
                  <th>Produção</th>
                  <th>Tempo</th>
                </tr>
              </thead>
              <tbody>
                {logs.length > 0 ? logs.slice().reverse().map(log => (
                  <tr key={log.id}>
                    <td>{new Date(log.data_apontamento).toLocaleString()}</td>
                    <td>TOR-{log.usuarioId}</td>
                    <td>OS-{log.ordemServicoId}</td>
                    <td>{log.quantidade_produzida} peças</td>
                    <td>{log.tempo_execucao} min</td>
                  </tr>
                )) : (
                    <tr><td colSpan={5} style={{textAlign: "center", padding: "20px"}}>Nenhum log registrado ainda.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* --- MODAL PARA CRIAR USUÁRIO --- */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="CADASTRAR NOVO USUÁRIO">
        <div className="modal-form">
            <div className="form-group">
                <label>Nome Completo</label>
                <input name="nome" value={novoUsuario.nome} onChange={handleInputChange} placeholder="Ex: João Silva" />
            </div>
            
            <div className="form-row">
                <div className="form-group">
                    <label>Email (Login)</label>
                    <input name="email" type="email" value={novoUsuario.email} onChange={handleInputChange} placeholder="joao@kadmill.com" />
                </div>
                <div className="form-group">
                    <label>CPF (11 dígitos)</label>
                    <input name="cpf" value={novoUsuario.cpf} onChange={handleInputChange} placeholder="Apenas números" maxLength={11} />
                </div>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label>Senha Inicial</label>
                    <input name="senha" type="password" value={novoUsuario.senha} onChange={handleInputChange} placeholder="******" />
                </div>
                <div className="form-group">
                    <label>Função / Permissão</label>
                    <select name="funcao" value={novoUsuario.funcao} onChange={handleInputChange}>
                        <option value="OPERADOR">Operador (Padrão)</option>
                        <option value="GERENTE">Gerente</option>
                        <option value="ADMIN">Administrador</option>
                    </select>
                </div>
            </div>

            <div className="form-group">
                <label>Setor de Trabalho</label>
                <select name="setor" value={novoUsuario.setor} onChange={handleInputChange}>
                    <option value="DIURNO">Diurno</option>
                    <option value="NOTURNO">Noturno</option>
                </select>
            </div>

            <div className="modal-footer">
                <button className="btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                <button className="btn-primary" onClick={handleSalvarUsuario}>Salvar Usuário</button>
            </div>
        </div>
      </Modal>

    </div>
  );
};

export default Admin;