// frontend/src/pages/Estoque.tsx
import React, { useState, useEffect } from "react";
import { api } from "../services/api";

type AbaTipo = "PRODUTO" | "MATERIA_PRIMA" | "ORDEM_SERVICO" | "APONTAMENTO";

const Estoque: React.FC = () => {
  const [abaAtiva, setAbaAtiva] = useState<AbaTipo>("MATERIA_PRIMA");
  const [dados, setDados] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
          <tr key={item.id}>
            <td>OS-{item.id}</td>
            <td>{item.clienteId}</td> {/* No futuro, o backend deve incluir o nome do cliente */}
            <td>{new Date(item.data_abertura).toLocaleDateString()}</td>
            <td>-</td> {/* CNPJ/CPF vindo da relação com cliente */}
            <td><span className={`status-badge ${item.status}`}>{item.status}</span></td>
          </tr>
        );
      case "APONTAMENTO":
        return (
          <tr key={item.id}>
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
    </div>
  );
};

export default Estoque;