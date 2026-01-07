// frontend/src/pages/Estoque.tsx
import React, { useState, useEffect } from "react";
import { api } from "../services/api";

const Estoque: React.FC = () => {
  const [abaAtiva, setAbaAtiva] = useState<"PRODUTO" | "MATERIA_PRIMA">("MATERIA_PRIMA");
  const [dados, setDados] = useState<any[]>([]);
  const [loading, setLoading] = useState(true); // Adicionado estado de carregamento

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Inicia o carregamento ao trocar de aba
      try {
        const endpoint = abaAtiva === "PRODUTO" ? "/produtos" : "/materiasPrimas";
        const response = await api.get(endpoint);
        setDados(response.data);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
        setDados([]); // Garante lista vazia em caso de erro
      } finally {
        setLoading(false); // Finaliza o carregamento
      }
    };
    fetchData();
  }, [abaAtiva]);

  return (
    <div className="estoque-container">
      <div className="page-header">
        <div className="tabs">
          <button 
            onClick={() => setAbaAtiva("PRODUTO")} 
            className={abaAtiva === "PRODUTO" ? "selected" : ""}
          >
            Produto
          </button>
          <button 
            onClick={() => setAbaAtiva("MATERIA_PRIMA")} 
            className={abaAtiva === "MATERIA_PRIMA" ? "selected" : ""}
          >
            Matéria Prima
          </button>
        </div>
        <div className="filter-icon">🔍 Filtro</div>
      </div>

      <div className="table-container">
        <table className="kadmill-table">
          <thead>
            {abaAtiva === "MATERIA_PRIMA" ? (
              <tr>
                <th>Código</th>
                <th>Nome</th>
                <th>Quantidade</th>
                <th>Fornecedor</th>
                <th>Última entrada</th>
              </tr>
            ) : (
              <tr>
                <th>Código</th>
                <th>Nome</th>
                <th>Modelo</th>
                <th>Quantidade</th>
                <th>Preço unidade</th>
              </tr>
            )}
          </thead>
          <tbody>
            {loading ? (
              // Exibe mensagem de carregamento enquanto busca dados
              <tr><td colSpan={5} style={{ textAlign: 'center' }}>A carregar dados...</td></tr>
            ) : dados.length > 0 ? (
              // Mapeia os dados se a lista não estiver vazia
              dados.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.nome}</td>
                  {abaAtiva === "MATERIA_PRIMA" ? (
                    <>
                      <td>{item.quantidade_disponivel}</td>
                      <td>{item.fornecedorId}</td>
                      <td>{item.ultima_entrada ? new Date(item.ultima_entrada).toLocaleDateString() : "-"}</td>
                    </>
                  ) : (
                    <>
                      <td>{item.descricao || "N/A"}</td>
                      <td>{item.quantidade_estoque}</td>
                      <td>R$ {Number(item.preco_unitario).toFixed(2)}</td>
                    </>
                  )}
                </tr>
              ))
            ) : (
              // Exibe mensagem caso não existam registos (Igual à tela de Contatos)
              <tr><td colSpan={5} style={{ textAlign: 'center', padding: '20px' }}>Nenhum dado encontrado.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Estoque;