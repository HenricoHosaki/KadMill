// frontend/src/pages/Estoque.tsx
import React, { useState, useEffect } from "react";
import { api } from "../services/api"; // Já configurado com Bearer token

const Estoque: React.FC = () => {
  const [abaAtiva, setAbaAtiva] = useState<"PRODUTO" | "MATERIA_PRIMA">("PRODUTO");
  const [dados, setDados] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const endpoint = abaAtiva === "PRODUTO" ? "/produtos" : "/materiasPrimas";
        const response = await api.get(endpoint);
        setDados(response.data);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };
    fetchData();
  }, [abaAtiva]);

  return (
    <div className="estoque-container">
      <div className="tabs">
        <button onClick={() => setAbaAtiva("PRODUTO")} className={abaAtiva === "PRODUTO" ? "selected" : ""}>Produto</button>
        <button onClick={() => setAbaAtiva("MATERIA_PRIMA")} className={abaAtiva === "MATERIA_PRIMA" ? "selected" : ""}>Matéria Prima</button>
      </div>

      <table className="kadmill-table">
        <thead>
          {abaAtiva === "PRODUTO" ? (
            <tr>
              <th>Código</th>
              <th>Nome</th>
              <th>Quantidade</th>
              <th>Preço Unit.</th>
            </tr>
          ) : (
            <tr>
              <th>Código</th>
              <th>Nome</th>
              <th>Quantidade</th>
              <th>Fornecedor</th>
            </tr>
          )}
        </thead>
        <tbody>
          {dados.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.nome}</td>
              <td>{item.quantidade_estoque || item.quantidade_disponivel}</td>
              <td>{item.preco_unitario || item.fornecedorId}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Estoque;