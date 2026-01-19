import React, { useState, useEffect } from "react";
import { api } from "../services/api";
import Modal from "../components/Modal";
import { isAdmin } from "../utils/authUtils";

const Contatos: React.FC = () => {
  const [abaAtiva, setAbaAtiva] = useState<"CLIENTES" | "FORNECEDORES">("CLIENTES");
  const [lista, setLista] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const userIsAdmin = isAdmin();

  // Estados dos Modais
  const [clienteSelecionado, setClienteSelecionado] = useState<any | null>(null);
  const [fornecedorSelecionado, setFornecedorSelecionado] = useState<any | null>(null);

  // Estados de Edição
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<any>({});

  const carregarDados = async () => {
    setLoading(true);
    try {
      const endpoint = abaAtiva === "CLIENTES" ? "/clientes" : "/fornecedores";
      const response = await api.get(endpoint);
      setLista(response.data);
    } catch (error) {
      console.error("Erro ao procurar contactos:", error);
      setLista([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, [abaAtiva]);

  // --- Lógica de Abertura de Modal ---
  const abrirModal = (item: any, type: "CLIENTE" | "FORNECEDOR") => {
      setEditData(item);
      setIsEditing(false);
      if (type === "CLIENTE") setClienteSelecionado(item);
      else setFornecedorSelecionado(item);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setEditData((prev: any) => ({ ...prev, [name]: value }));
  };

  // --- Salvar Edição ---
  const handleSaveEdit = async () => {
      try {
          const endpoint = abaAtiva === "CLIENTES" 
              ? `/clientes/${editData.id}` 
              : `/fornecedores/${editData.id}`;
          
          await api.put(endpoint, editData);
          
          alert("Registro atualizado com sucesso!");
          setIsEditing(false);
          carregarDados(); // Atualiza a tabela

          // Atualiza o modal visualmente
          if (abaAtiva === "CLIENTES") setClienteSelecionado(editData);
          else setFornecedorSelecionado(editData);

      } catch (error) {
          console.error("Erro ao atualizar:", error);
          alert("Erro ao atualizar o registro.");
      }
  };

  // --- Excluir Registro ---
  const handleDelete = async (id: number) => {
      if (!window.confirm("Tem certeza que deseja EXCLUIR este registro?")) return;

      try {
          const endpoint = abaAtiva === "CLIENTES" 
              ? `/clientes/${id}` 
              : `/fornecedores/${id}`;

          await api.delete(endpoint);
          alert("Registro excluído.");
          
          setClienteSelecionado(null);
          setFornecedorSelecionado(null);
          carregarDados();
      } catch (error) {
          console.error("Erro ao excluir:", error);
          alert("Erro ao excluir. Verifique se não há vínculos (ex: OS ou Materiais) com este registro.");
      }
  };

  // Componente de botões (igual ao Estoque)
  const ModalActions = ({ id }: { id: number }) => (
      <div style={{ marginTop: "20px", borderTop: "1px solid #eee", paddingTop: "15px", display: "flex", justifyContent: "space-between" }}>
          <div>
              {userIsAdmin && (
                  <button 
                      onClick={() => handleDelete(id)}
                      style={{ background: "#ff4d4f", color: "white", border: "none", padding: "8px 15px", borderRadius: "4px", cursor: "pointer" }}
                  >
                      🗑️ Excluir
                  </button>
              )}
          </div>
          <div>
              {isEditing ? (
                  <>
                      <button onClick={() => setIsEditing(false)} className="btn-secondary" style={{ marginRight: "10px" }}>Cancelar</button>
                      <button onClick={handleSaveEdit} className="btn-primary">💾 Salvar</button>
                  </>
              ) : (
                  <button onClick={() => setIsEditing(true)} className="btn-primary">✏️ Editar</button>
              )}
          </div>
      </div>
  );

  return (
    <div className="contatos-container">
      <div className="page-header">
        <div className="tabs">
          <button 
            className={abaAtiva === "CLIENTES" ? "selected" : ""} 
            onClick={() => setAbaAtiva("CLIENTES")}
          >
            Clientes
          </button>
          <button 
            className={abaAtiva === "FORNECEDORES" ? "selected" : ""} 
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
              <tr><td colSpan={5} style={{ textAlign: 'center' }}>A carregar contactos...</td></tr>
            ) : lista.length > 0 ? (
              lista.map((item) => (
                <tr 
                    key={item.id} 
                    onClick={() => abrirModal(item, abaAtiva === "CLIENTES" ? "CLIENTE" : "FORNECEDOR")}
                    style={{ cursor: "pointer" }}
                    title="Clique para ver detalhes"
                >
                  <td>{item.id}</td>
                  <td>{item.nome}</td>
                  <td>{item.telefone}</td>
                  <td>{item.cpf_cnpj}</td>
                  <td>{item.email}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '20px' }}>
                  Nenhum dado encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* --- MODAL DE CLIENTE --- */}
      <Modal isOpen={!!clienteSelecionado} onClose={() => setClienteSelecionado(null)} title={`Cliente #${clienteSelecionado?.id}`}>
        {clienteSelecionado && (
            <div className="os-details-view modal-form">
                {!isEditing ? (
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                        <p><strong>Nome:</strong> {clienteSelecionado.nome}</p>
                        <p><strong>CPF/CNPJ:</strong> {clienteSelecionado.cpf_cnpj}</p>
                        <p><strong>Email:</strong> {clienteSelecionado.email}</p>
                        <p><strong>Telefone:</strong> {clienteSelecionado.telefone}</p>
                        <p style={{ gridColumn: "1 / -1" }}><strong>Endereço:</strong> {clienteSelecionado.endereco}</p>
                        <p style={{ fontSize: "0.8rem", color: "#888" }}>Cadastrado em: {new Date(clienteSelecionado.data_cadastro).toLocaleDateString()}</p>
                    </div>
                ) : (
                    <>
                        <div className="form-group"><label>Nome</label><input name="nome" value={editData.nome} onChange={handleEditChange} /></div>
                        <div className="form-row">
                            <div className="form-group"><label>CPF/CNPJ</label><input name="cpf_cnpj" value={editData.cpf_cnpj} onChange={handleEditChange} /></div>
                            <div className="form-group"><label>Telefone</label><input name="telefone" value={editData.telefone} onChange={handleEditChange} /></div>
                        </div>
                        <div className="form-group"><label>Email</label><input name="email" value={editData.email} onChange={handleEditChange} /></div>
                        <div className="form-group"><label>Endereço</label><input name="endereco" value={editData.endereco} onChange={handleEditChange} /></div>
                    </>
                )}
                <ModalActions id={clienteSelecionado.id} />
            </div>
        )}
      </Modal>

      {/* --- MODAL DE FORNECEDOR --- */}
      <Modal isOpen={!!fornecedorSelecionado} onClose={() => setFornecedorSelecionado(null)} title={`Fornecedor #${fornecedorSelecionado?.id}`}>
        {fornecedorSelecionado && (
            <div className="os-details-view modal-form">
                {!isEditing ? (
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                        <p><strong>Razão Social:</strong> {fornecedorSelecionado.nome}</p>
                        <p><strong>CNPJ:</strong> {fornecedorSelecionado.cpf_cnpj}</p>
                        <p><strong>Contato:</strong> {fornecedorSelecionado.contato}</p>
                        <p><strong>Telefone:</strong> {fornecedorSelecionado.telefone}</p>
                        <p><strong>Email:</strong> {fornecedorSelecionado.email}</p>
                        <p style={{ gridColumn: "1 / -1" }}><strong>Endereço:</strong> {fornecedorSelecionado.endereco}</p>
                        {fornecedorSelecionado.observacao && <p style={{ gridColumn: "1 / -1", background: "#f9f9f9", padding: "5px" }}><strong>Obs:</strong> {fornecedorSelecionado.observacao}</p>}
                    </div>
                ) : (
                    <>
                        <div className="form-group"><label>Razão Social</label><input name="nome" value={editData.nome} onChange={handleEditChange} /></div>
                        <div className="form-row">
                             <div className="form-group"><label>Pessoa Contato</label><input name="contato" value={editData.contato} onChange={handleEditChange} /></div>
                             <div className="form-group"><label>CNPJ</label><input name="cpf_cnpj" value={editData.cpf_cnpj} onChange={handleEditChange} /></div>
                        </div>
                        <div className="form-row">
                            <div className="form-group"><label>Telefone</label><input name="telefone" value={editData.telefone} onChange={handleEditChange} /></div>
                            <div className="form-group"><label>Email</label><input name="email" value={editData.email} onChange={handleEditChange} /></div>
                        </div>
                        <div className="form-group"><label>Endereço</label><input name="endereco" value={editData.endereco} onChange={handleEditChange} /></div>
                        <div className="form-group"><label>Observação</label><input name="observacao" value={editData.observacao || ""} onChange={handleEditChange} /></div>
                    </>
                )}
                <ModalActions id={fornecedorSelecionado.id} />
            </div>
        )}
      </Modal>

    </div>
  );
};

export default Contatos;