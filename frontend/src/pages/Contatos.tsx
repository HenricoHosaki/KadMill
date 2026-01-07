import React, { useState, useEffect } from "react";
import { api } from "../services/api";

// Definição de tipos baseada no seu Prisma Schema
interface Contacto {
  id: number;
  nome: string;
  telefone: string;
  cpf_cnpj: string;
  email: string;
}

const Contatos: React.FC = () => {
  const [abaAtiva, setAbaAtiva] = useState<"CLIENTES" | "FORNECEDORES">("CLIENTES");
  const [lista, setLista] = useState<Contacto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarDados = async () => {
      setLoading(true);
      try {
        const endpoint = abaAtiva === "CLIENTES" ? "/clientes" : "/fornecedores";
        const response = await api.get(endpoint);
        setLista(response.data);
      } catch (error) {
        console.error("Erro ao procurar contactos:", error);
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
  }, [abaAtiva]);

  return (
    <div className="page-container">
      <div className="content-header">
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
      </div>

      <div className="table-responsive">
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
              <tr><td colSpan={5}>A carregar...</td></tr>
            ) : lista.length > 0 ? (
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
              <tr><td colSpan={5}>Nenhum registo encontrado.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Contatos;