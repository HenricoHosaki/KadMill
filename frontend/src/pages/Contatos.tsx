// frontend/src/pages/Contatos.tsx
import React, { useState, useEffect } from "react";
import { api } from "../services/api";

const Contatos: React.FC = () => {
  const [abaAtiva, setAbaAtiva] = useState<"CLIENTES" | "FORNECEDORES">("CLIENTES");
  const [lista, setLista] = useState<any[]>([]);
  const [loading, setLoading] = useState(true); // Adicionado estado de carregamento

  useEffect(() => {
    const carregarDados = async () => {
      setLoading(true); // Inicia o carregamento ao trocar de aba
      try {
        const endpoint = abaAtiva === "CLIENTES" ? "/clientes" : "/fornecedores";
        const response = await api.get(endpoint);
        setLista(response.data);
      } catch (error) {
        console.error("Erro ao procurar contactos:", error);
        setLista([]); // Garante lista vazia em caso de erro
      } finally {
        setLoading(false); // Finaliza o carregamento
      }
    };
    carregarDados();
  }, [abaAtiva]);

  return (
    <div className="contatos-container">
      <div className="page-header">
        <div className="tabs">
          <button 
            className={abaAtiva === "CLIENTES" ? "active" : ""} 
            onClick={() => setAbaAtiva("CLIENTES")}
          >
            Clientes
          </button>
          <button 
            className={abaAtiva === "FORNECEDORES" ? "active" : ""} 
            onClick={() => setAbaAtiva("FORNECEDORES")}
          >
            Fornecedores
          </button>
        </div>
        <div className="filter-icon">🔍 Filtro</div>
      </div>

      <div className="table-container">
        <table className="kadmill-table">
          <thead>
            <tr>
              <th>Código</th>
              <th>Nome</th>
              <th>Telefone</th>
              <th>CNPJ/CPF</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              // Exibe mensagem de carregamento
              <tr><td colSpan={5} style={{ textAlign: 'center' }}>A carregar contactos...</td></tr>
            ) : lista.length > 0 ? (
              // Mapeia a lista se existirem dados
              lista.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.nome}</td>
                  <td>{item.telefone}</td>
                  <td>{item.cpf_cnpj}</td>
                  <td>{item.email}</td>
                </tr>
              ))
            ) : (
              // Exibe mensagem caso a tabela esteja vazia (Igual ao Estoque)
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '20px' }}>
                  Nenhum dado encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Contatos;