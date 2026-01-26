import React, { useEffect, useState } from "react";
import { api } from "../services/api";
import { Link } from "react-router-dom";
import { isAdmin } from "../utils/authUtils";

interface OSData {
  id: number;
  cliente?: { nome: string };
  clienteId: number | string;
  equipamento_utilizado?: string;
  status: "ABERTA" | "EM_ANDAMENTO" | "CONCLUIDA" | "CANCELADA";
  data_abertura: string;
  valor_total?: number;
}

const Home: React.FC = () => {
  const [osList, setOsList] = useState<OSData[]>([]);
  const [loading, setLoading] = useState(true);
  const userIsAdmin = isAdmin();

  // KPIs
  const [kpis, setKpis] = useState({
    abertas: 0,
    andamento: 0,
    concluidas: 0,
    faturamentoPotencial: 0,
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await api.get("/ordensServicos");
      const dados: OSData[] = response.data;
      setOsList(dados);

      const abertas = dados.filter((d) => d.status === "ABERTA");
      const andamento = dados.filter((d) => d.status === "EM_ANDAMENTO");
      const concluidas = dados.filter((d) => d.status === "CONCLUIDA");

      const valorAbertas = abertas.reduce((acc, curr) => acc + Number(curr.valor_total || 0), 0);
      const valorAndamento = andamento.reduce((acc, curr) => acc + Number(curr.valor_total || 0), 0);

      setKpis({
        abertas: abertas.length,
        andamento: andamento.length,
        concluidas: concluidas.length,
        faturamentoPotencial: valorAbertas + valorAndamento,
      });

    } catch (error) {
      console.error("Erro ao carregar home:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ABERTA": return "#faad14";
      case "EM_ANDAMENTO": return "#1890ff";
      case "CONCLUIDA": return "#52c41a";
      default: return "#d9d9d9";
    }
  };

  const KanbanCard = ({ os }: { os: OSData }) => (
    <div style={{
      background: "white",
      padding: "15px",
      borderRadius: "8px",
      marginBottom: "10px",
      boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
      borderLeft: `5px solid ${getStatusColor(os.status)}`,
      display: "flex",
      flexDirection: "column",
      gap: "5px"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <strong style={{ fontSize: "0.95rem", color: "#333" }}>#{os.id} - {os.cliente?.nome || "Cliente"}</strong>
      </div>
      
      <div style={{ fontSize: "0.85rem", color: "#666" }}>
        🛠️ {os.equipamento_utilizado || "Sem equipamento"}
      </div>
      
      <div style={{ fontSize: "0.8rem", color: "#999", marginTop: "5px" }}>
        📅 {new Date(os.data_abertura).toLocaleDateString()}
      </div>

      {/* Exibe valor só para admin */}
      {userIsAdmin && os.valor_total && os.valor_total > 0 && (
         <div style={{ fontSize: "0.85rem", fontWeight: "bold", color: "#555", marginTop: "5px" }}>
           R$ {Number(os.valor_total).toFixed(2)}
         </div>
      )}
    </div>
  );

  return (
    <div className="home-container" style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      
      {/* 1. CABEÇALHO E MÉTRICAS (KPIS) */}
      <div style={{ marginBottom: "30px" }}>
        <h2 style={{ color: "#ffffff", marginBottom: "20px" }}>Painel de Controle</h2>
        
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px" }}>
          
          {/* Card ABERTAS */}
          <div style={{ background: "white", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)", borderBottom: "4px solid #faad14" }}>
            <h3 style={{ margin: 0, color: "#888", fontSize: "0.9rem", textTransform: "uppercase" }}>Aguardando</h3>
            <p style={{ fontSize: "2rem", fontWeight: "bold", margin: "10px 0 0 0", color: "#333" }}>{kpis.abertas}</p>
          </div>

          {/* Card EM ANDAMENTO */}
          <div style={{ background: "white", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)", borderBottom: "4px solid #1890ff" }}>
            <h3 style={{ margin: 0, color: "#888", fontSize: "0.9rem", textTransform: "uppercase" }}>Em Produção</h3>
            <p style={{ fontSize: "2rem", fontWeight: "bold", margin: "10px 0 0 0", color: "#333" }}>{kpis.andamento}</p>
          </div>

          {/* Card CONCLUÍDAS */}
          <div style={{ background: "white", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)", borderBottom: "4px solid #52c41a" }}>
            <h3 style={{ margin: 0, color: "#888", fontSize: "0.9rem", textTransform: "uppercase" }}>Finalizadas</h3>
            <p style={{ fontSize: "2rem", fontWeight: "bold", margin: "10px 0 0 0", color: "#333" }}>{kpis.concluidas}</p>
          </div>

          {/* Card FATURAMENTO (Apenas Admin) */}
          {userIsAdmin && (
            <div style={{ background: "#538630", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)", color: "white" }}>
               <h3 style={{ margin: 0, color: "#ffffff", fontSize: "0.9rem", textTransform: "uppercase" }}>Em Carteira (Estimado)</h3>
               <p style={{ fontSize: "1.8rem", fontWeight: "bold", margin: "10px 0 0 0" }}>
                 R$ {kpis.faturamentoPotencial.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
               </p>
            </div>
          )}
        </div>
      </div>

      {/* 2. QUADRO KANBAN */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
            <h3 style={{ color: "#ffffff" }}>Fluxo de Trabalho</h3>
            <Link to="/estoque" style={{ textDecoration: "none", fontSize: "0.9rem", color: "#1890ff", fontWeight: "bold" }}>Ver Lista Completa →</Link>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px", alignItems: "start" }}>
            
            {/* Coluna 1: A FAZER */}
            <div style={{ background: "#f4f5f7", padding: "15px", borderRadius: "8px", minHeight: "200px" }}>
                <h4 style={{ margin: "0 0 15px 0", paddingBottom: "10px", borderBottom: "2px solid #e0e0e0", color: "#666", display: "flex", justifyContent: "space-between" }}>
                    <span> A Fazer</span>
                    <span style={{ background: "#e0e0e0", padding: "2px 8px", borderRadius: "10px", fontSize: "0.8rem" }}>{kpis.abertas}</span>
                </h4>
                {loading ? <p>Carregando...</p> : 
                 osList.filter(os => os.status === "ABERTA").map(os => (
                    <KanbanCard key={os.id} os={os} />
                ))}
                {osList.filter(os => os.status === "ABERTA").length === 0 && !loading && (
                    <p style={{ textAlign: "center", color: "#aaa", fontSize: "0.9rem", marginTop: "20px" }}>Tudo limpo por aqui!</p>
                )}
            </div>

            {/* Coluna 2: EM PRODUÇÃO */}
            <div style={{ background: "#e6f7ff", padding: "15px", borderRadius: "8px", minHeight: "200px", border: "1px dashed #91d5ff" }}>
                <h4 style={{ margin: "0 0 15px 0", paddingBottom: "10px", borderBottom: "2px solid #91d5ff", color: "#0050b3", display: "flex", justifyContent: "space-between" }}>
                    <span> Em Produção</span>
                    <span style={{ background: "#bae7ff", padding: "2px 8px", borderRadius: "10px", fontSize: "0.8rem" }}>{kpis.andamento}</span>
                </h4>
                {loading ? <p>Carregando...</p> : 
                 osList.filter(os => os.status === "EM_ANDAMENTO").map(os => (
                    <KanbanCard key={os.id} os={os} />
                ))}
            </div>

            {/* Coluna 3: PRONTO */}
            <div style={{ background: "#f6ffed", padding: "15px", borderRadius: "8px", minHeight: "200px" }}>
                <h4 style={{ margin: "0 0 15px 0", paddingBottom: "10px", borderBottom: "2px solid #b7eb8f", color: "#389e0d", display: "flex", justifyContent: "space-between" }}>
                    <span> Finalizado</span>
                    <span style={{ background: "#d9f7be", padding: "2px 8px", borderRadius: "10px", fontSize: "0.8rem" }}>{kpis.concluidas}</span>
                </h4>
                {loading ? <p>Carregando...</p> : 
                 osList.filter(os => os.status === "CONCLUIDA").slice(0, 5).map(os => (
                    <KanbanCard key={os.id} os={os} />
                ))}
                {osList.filter(os => os.status === "CONCLUIDA").length > 5 && (
                    <p style={{ textAlign: "center", color: "#aaa", fontSize: "0.8rem" }}>+ {osList.filter(os => os.status === "CONCLUIDA").length - 5} itens recentes...</p>
                )}
            </div>

        </div>
      </div>
    </div>
  );
};

export default Home;