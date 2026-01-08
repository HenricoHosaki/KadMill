// frontend/src/pages/Estoque.tsx
import React, { useState, useEffect } from "react";
import { api } from "../services/api";
import Modal from "../components/Modal"; 

type AbaTipo = "PRODUTO" | "MATERIA_PRIMA" | "ORDEM_SERVICO" | "APONTAMENTO";

const Estoque: React.FC = () => {
  const [abaAtiva, setAbaAtiva] = useState<AbaTipo>("MATERIA_PRIMA");
  const [dados, setDados] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Estados para controlar qual item está selecionado para o Modal
  const [osSelecionada, setOsSelecionada] = useState<any | null>(null);
  const [apontamentoSelecionado, setApontamentoSelecionado] = useState<any | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let endpoint = "";
        switch (abaAtiva) {
          case "PRODUTO": endpoint = "/produtos"; break;
          case "MATERIA_PRIMA": endpoint = "/materiasPrimas"; break;
          case "ORDEM_SERVICO": endpoint = "/ordensServicos"; break;
          case "APONTAMENTO": endpoint = "/apontamentos"; break;
        }
        
        const response = await api.get(endpoint);
        setDados(response.data);
      } catch (error) {
        console.error(`Erro ao procurar dados de ${abaAtiva}:`, error);
        setDados([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [abaAtiva]);

  const renderTableHead = () => {
    switch (abaAtiva) {
      case "MATERIA_PRIMA":
        return (
          <tr>
            <th>Código</th>
            <th>Nome</th>
            <th>Quantidade</th>
            <th>Fornecedor</th>
            <th>Última entrada</th>
          </tr>
        );
      case "PRODUTO":
        return (
          <tr>
            <th>Código</th>
            <th>Nome</th>
            <th>Modelo</th>
            <th>Quantidade</th>
            <th>Preço unidade</th>
          </tr>
        );
      case "ORDEM_SERVICO":
        return (
          <tr>
            <th>Código</th>
            <th>Cliente</th>
            <th>Data de emissão</th>
            <th>CNPJ/CPF</th>
            <th>Status</th>
          </tr>
        );
      case "APONTAMENTO":
        return (
          <tr>
            <th>Código</th>
            <th>Ordem de serviço</th>
            <th>Data da criação</th>
            <th>Tempo de execução</th>
            <th>Operador</th>
          </tr>
        );
    }
  };

  const renderTableRow = (item: any) => {
    switch (abaAtiva) {
      case "MATERIA_PRIMA":
        return (
          <tr key={item.id}>
            <td>MP-{item.id}</td>
            <td>{item.nome}</td>
            <td>{item.quantidade_disponivel}</td>
            <td>{item.fornecedorId}</td>
            <td>{item.ultima_entrada ? new Date(item.ultima_entrada).toLocaleDateString() : "-"}</td>
          </tr>
        );
      case "PRODUTO":
        return (
          <tr key={item.id}>
            <td>PI-{item.id}</td>
            <td>{item.nome}</td>
            <td>{item.descricao || "Padrão"}</td>
            <td>{item.quantidade_estoque}</td>
            <td>R$ {Number(item.preco_unitario).toFixed(2)}</td>
          </tr>
        );
      case "ORDEM_SERVICO":
        return (
          <tr 
            key={item.id} 
            onClick={() => setOsSelecionada(item)} 
            style={{ cursor: "pointer" }}
            title="Clique para ver detalhes completos"
          >
            <td>OS-{item.id}</td>
            <td>{item.cliente?.nome || item.clienteId}</td> 
            <td>{new Date(item.data_abertura).toLocaleDateString()}</td>
            <td>{item.cliente?.cpf_cnpj || "-"}</td> 
            <td><span className={`status-badge ${item.status}`}>{item.status}</span></td>
          </tr>
        );
      case "APONTAMENTO":
        return (
          <tr 
            key={item.id} 
            onClick={() => setApontamentoSelecionado(item)} 
            style={{ cursor: "pointer" }}
            title="Clique para ver detalhes do apontamento"
          >
            <td>AP-{item.id}</td>
            <td>OS-{item.ordemServicoId}</td>
            <td>{new Date(item.data_apontamento).toLocaleDateString()}</td>
            <td>{item.tempo_execucao} min</td>
            <td>TOR-{item.usuarioId}</td>
          </tr>
        );
    }
  };

  return (
    <div className="estoque-container">
      <div className="page-header">
        <div className="tabs">
          <button onClick={() => setAbaAtiva("PRODUTO")} className={abaAtiva === "PRODUTO" ? "selected" : ""}>Produto</button>
          <button onClick={() => setAbaAtiva("MATERIA_PRIMA")} className={abaAtiva === "MATERIA_PRIMA" ? "selected" : ""}>Matéria Prima</button>
          <button onClick={() => setAbaAtiva("ORDEM_SERVICO")} className={abaAtiva === "ORDEM_SERVICO" ? "selected" : ""}>Ordem de serviço</button>
          <button onClick={() => setAbaAtiva("APONTAMENTO")} className={abaAtiva === "APONTAMENTO" ? "selected" : ""}>Apontamento</button>
        </div>
        <div className="filter-icon">🔍 Filtro</div>
      </div>

      <div className="table-container">
        <table className="kadmill-table">
          <thead>{renderTableHead()}</thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} style={{ textAlign: 'center' }}>A carregar dados...</td></tr>
            ) : dados.length > 0 ? (
              dados.map(item => renderTableRow(item))
            ) : (
              <tr><td colSpan={5} style={{ textAlign: 'center', padding: '20px' }}>Nenhum dado encontrado.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Único para Detalhes da Ordem de Serviço */}
      <Modal 
        isOpen={!!osSelecionada} 
        onClose={() => setOsSelecionada(null)} 
        title={`Detalhes da Ordem de Serviço #OS-${osSelecionada?.id}`}
      >
        {osSelecionada && (
          <div className="os-details-view">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
              <p><strong>Cliente:</strong> {osSelecionada.cliente?.nome || osSelecionada.clienteId}</p>
              <p><strong>CNPJ/CPF:</strong> {osSelecionada.cliente?.cpf_cnpj || "-"}</p>
              <p><strong>Data Abertura:</strong> {new Date(osSelecionada.data_abertura).toLocaleDateString()}</p>
              <p><strong>Status:</strong> <span className={`status-badge ${osSelecionada.status}`}>{osSelecionada.status}</span></p>
              <p><strong>Valor Total:</strong> R$ {Number(osSelecionada.valor_total || 0).toFixed(2)}</p>
            </div>

            <div style={{ marginTop: "15px" }}>
              <p><strong>Descrição do Serviço:</strong></p>
              <div style={{ background: "#f4f4f4", padding: "10px", borderRadius: "4px", border: "1px solid #ddd", marginTop: "5px" }}>
                {osSelecionada.descricao_servico || osSelecionada.descricao || "Nenhuma descrição detalhada."}
              </div>
            </div>

            <div style={{ marginTop: "15px" }}>
              <p><strong>Observações Internas:</strong></p>
              <p style={{ color: "#666", fontSize: "0.9rem" }}>{osSelecionada.observacao || "Sem observações registradas."}</p>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal para Detalhes do Apontamento */}
      <Modal
        isOpen={!!apontamentoSelecionado} 
        onClose={() => setApontamentoSelecionado(null)} 
        title={`Detalhes do Apontamento #AP-${apontamentoSelecionado?.id}`}
      >
        {apontamentoSelecionado && (
          <div className="os-details-view">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
              <p><strong>Ordem de Serviço:</strong> OS-{apontamentoSelecionado.ordemServicoId}</p>
              <p><strong>Operador:</strong> TOR-{apontamentoSelecionado.usuarioId}</p>
              <p><strong>Data:</strong> {new Date(apontamentoSelecionado.data_apontamento).toLocaleDateString()}</p>
              <p><strong>Tempo:</strong> {apontamentoSelecionado.tempo_execucao} minutos</p>
            </div>

            <div style={{ marginTop: "15px", padding: "10px", background: "#f8f9fa", borderRadius: "4px", border: "1px solid #ddd" }}>
              <h4 style={{ fontSize: "0.9rem", color: "#333", marginBottom: "5px" }}>Produção e Insumos</h4>
              <p><strong>Qtd. Produzida:</strong> {apontamentoSelecionado.quantidade_produzida} peças</p>
              <p><strong>Qtd. Matéria Usada:</strong> {apontamentoSelecionado.quantidade_utilizada || 0}</p>
              <p><strong>Matéria Prima (ID):</strong> {apontamentoSelecionado.materiaPrimaId || "N/A"}</p>
            </div>

            <div style={{ marginTop: "15px" }}>
              <p><strong>Observações do Operador:</strong></p>
              <div style={{ background: "#fffbe6", padding: "10px", borderRadius: "4px", border: "1px solid #ffe58f", color: "#856404", fontSize: "0.9rem" }}>
                {apontamentoSelecionado.observacao || "Nenhuma observação registrada."}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Estoque;