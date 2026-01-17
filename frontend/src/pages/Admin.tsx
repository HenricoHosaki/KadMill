import React, { useEffect, useState } from "react";
import { api } from "../services/api";

const Admin: React.FC = () => {
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]); // Apontamentos
  const [loading, setLoading] = useState(true);
  const [backupLoading, setBackupLoading] = useState(false);

  useEffect(() => {
    fetchDados();
  }, []);

  const fetchDados = async () => {
    setLoading(true);
    try {
      const [resUsers, resLogs] = await Promise.all([
        api.get("/administradores"),
        api.get("/relatorios/apontamentos")
      ]);
      setUsuarios(resUsers.data);
      setLogs(resLogs.data);
    } catch (error) {
      console.error("Erro ao carregar dados do admin");
    } finally {
      setLoading(false);
    }
  };

  const handleExcluirUsuario = async (id: number) => {
    if (!window.confirm("Tem a certeza que deseja remover este utilizador?")) return;
    try {
      await api.delete(`/administradores/${id}`);
      fetchDados();
    } catch {
      alert("Erro ao excluir.");
    }
  };

  const handleDownloadBackup = async () => {
    setBackupLoading(true);
    try {
      const response = await api.get('/backup', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `kadmill_backup_${new Date().toISOString().slice(0,10)}.sql`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch (error) {
      alert("Falha ao gerar backup. Verifique os logs do servidor.");
    } finally {
      setBackupLoading(false);
    }
  };

  if (loading) return <div style={{padding: "20px", color: "white"}}>A carregar painel...</div>;

  return (
    <div className="admin-page" style={{ padding: "20px", color: "#e1e1e1" }}>
      <h2 style={{ borderBottom: "2px solid #c5a059", paddingBottom: "10px", marginBottom: "30px" }}>
        PAINEL ADMINISTRATIVO
      </h2>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "30px" }}>
        
        {/* CARD 1: GESTÃO DE UTILIZADORES */}
        <div style={{ background: "white", borderRadius: "8px", padding: "20px", color: "#333", boxShadow: "0 4px 6px rgba(0,0,0,0.3)" }}>
          <h3 style={{ borderBottom: "1px solid #eee", paddingBottom: "10px", marginBottom: "15px", color: "#0b192e" }}>
             👥 Gestão de Acessos
          </h3>
          <div style={{ maxHeight: "300px", overflowY: "auto" }}>
            <table className="kadmill-table" style={{ fontSize: "0.85rem" }}>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Função</th>
                  <th style={{textAlign: 'center'}}>Ação</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map(u => (
                  <tr key={u.id}>
                    <td>{u.nome} <br/><span style={{fontSize: "0.75rem", color: "#666"}}>{u.email}</span></td>
                    <td><span className={`status-badge ${u.funcao === 'ADMIN' ? 'FECHADA' : 'ABERTA'}`}>{u.funcao}</span></td>
                    <td style={{textAlign: 'center'}}>
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

        {/* CARD 2: MANUTENÇÃO E BACKUP */}
        <div style={{ background: "white", borderRadius: "8px", padding: "20px", color: "#333", boxShadow: "0 4px 6px rgba(0,0,0,0.3)" }}>
          <h3 style={{ borderBottom: "1px solid #eee", paddingBottom: "10px", marginBottom: "15px", color: "#0b192e" }}>
             🛠️ Manutenção do Sistema
          </h3>
          <p style={{fontSize: "0.9rem", color: "#666", marginBottom: "20px"}}>
            Realize cópias de segurança de todo o banco de dados. O arquivo gerado (.sql) pode ser usado para restaurar o sistema em caso de falhas.
          </p>
          <button 
            onClick={handleDownloadBackup} 
            disabled={backupLoading}
            style={{
              background: backupLoading ? "#ccc" : "#0b192e",
              color: "white",
              padding: "12px 20px",
              border: "none",
              borderRadius: "4px",
              cursor: backupLoading ? "not-allowed" : "pointer",
              fontWeight: "bold",
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "10px"
            }}
          >
            {backupLoading ? "Gerando Arquivo..." : "📥 FAZER BACKUP COMPLETO"}
          </button>
        </div>
      </div>

      {/* CARD 3: LOGS DE OPERAÇÃO (APONTAMENTOS RECENTES) */}
      <div style={{ background: "white", borderRadius: "8px", padding: "20px", color: "#333", boxShadow: "0 4px 6px rgba(0,0,0,0.3)" }}>
        <h3 style={{ borderBottom: "1px solid #eee", paddingBottom: "10px", marginBottom: "15px", color: "#0b192e" }}>
           📋 Logs de Produção (Últimos Apontamentos)
        </h3>
        <div className="table-container" style={{ maxHeight: "400px", overflowY: "auto" }}>
          <table className="kadmill-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Data</th>
                <th>Operador (ID)</th>
                <th>Ordem Serviço</th>
                <th>Qtd. Produzida</th>
                <th>Tempo</th>
              </tr>
            </thead>
            <tbody>
              {logs.length > 0 ? logs.slice().reverse().map(log => ( // Inverte para mostrar mais recentes primeiro
                <tr key={log.id}>
                  <td>AP-{log.id}</td>
                  <td>{new Date(log.data_apontamento).toLocaleString()}</td>
                  <td>{log.usuarioId}</td>
                  <td>OS-{log.ordemServicoId}</td>
                  <td>{log.quantidade_produzida} un</td>
                  <td>{log.tempo_execucao} min</td>
                </tr>
              )) : <tr><td colSpan={6} style={{textAlign: "center"}}>Sem registos recentes.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default Admin;