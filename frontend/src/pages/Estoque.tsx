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
        console.error("Erro ao buscar dados:", error);
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
            <th>Código</th><th>Nome</th><th>Quantidade</th><th>Fornecedor</th><th>Última entrada</th>
          </tr>
        );
      case "PRODUTO":
        return (
          <tr>
            <th>Código</th><th>Nome</th><th>Modelo</th><th>Quantidade</th><th>Preço unidade</th>
          </tr>
        );
      case "ORDEM_SERVICO":
        return (
          <tr>
            <th>Código</th><th>Cliente</th><th>Data de emissão</th><th>CNPJ/CPF</th><th>Status</th>
          </tr>
        );
      case "APONTAMENTO":
        return (
          <tr>
            <th>Código</th><th>Ordem de serviço</th><th>Data da criação</th><th>Tempo de execução</th><th>Operador</th>
          </tr>
        );
    }
  };

  return (
    <div className="estoque-container">
      <div className="page-header">
        <div className="tabs">
          {["Produto", "Matéria Prima", "Ordem de serviço", "Apontamento"].map((label) => {
            const tipo = label.toUpperCase().replace(/ /g, "_") as AbaTipo;
            return (
              <button 
                key={tipo}
                onClick={() => setAbaAtiva(tipo)} 
                className={abaAtiva === tipo ? "selected" : ""}
              >
                {label}
              </button>
            );
          })}
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
              dados.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  {abaAtiva === "MATERIA_PRIMA" && (
                    <><td>{item.nome}</td><td>{item.quantidade_disponivel}</td><td>{item.fornecedorId}</td><td>{item.ultima_entrada ? new Date(item.ultima_entrada).toLocaleDateString() : "-"}</td></>
                  )}
                  {abaAtiva === "PRODUTO" && (
                    <><td>{item.nome}</td><td>{item.descricao || "N/A"}</td><td>{item.quantidade_estoque}</td><td>R$ {Number(item.preco_unitario).toFixed(2)}</td></>
                  )}
                  {abaAtiva === "ORDEM_SERVICO" && (
                    <><td>{item.numero_os}</td><td>{item.clienteId}</td><td>{new Date(item.data_abertura).toLocaleDateString()}</td><td>-</td><td>{item.status}</td></>
                  )}
                  {abaAtiva === "APONTAMENTO" && (
                    <><td>{item.id}</td><td>{item.ordemServicoId}</td><td>{new Date(item.data_apontamento).toLocaleDateString()}</td><td>{item.tempo_execucao} min</td><td>TOR{item.usuarioId}</td></>
                  )}
                </tr>
              ))
            ) : (
              <tr><td colSpan={5} style={{ textAlign: 'center' }}>Nenhum dado encontrado.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Estoque;