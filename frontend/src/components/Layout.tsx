import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Modal from "./Modal";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const handleLogout = () => {
    localStorage.removeItem("kadmill:token");
    localStorage.removeItem("kadmill:userId");
    navigate("/login");
  };

  const userId = localStorage.getItem("kadmill:userId") || "Usuário";

  const renderModalContent = () => {
  switch (activeModal) {
    case "OS":
      return (
        <form className="modal-form">
          <div className="form-row">
            <div className="form-group">
              <label>Número da OS (Único)</label>
              <input type="text" placeholder="Ex: OS-123" required />
            </div>
            <div className="form-group">
              <label>ID do Cliente</label>
              <input type="number" placeholder="Código do cliente" required />
            </div>
          </div>
          <div className="form-group">
            <label>Descrição do Serviço</label>
            <textarea placeholder="Ex: Usinagem de flange de aço 1020" required></textarea>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Valor Total (R$)</label>
              <input type="number" step="0.01" required />
            </div>
            <div className="form-group">
              <label>Status</label>
              <select defaultValue="ABERTA">
                <option value="ABERTA">Aberta</option>
                <option value="FINALIZADA">Finalizada</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>Observação</label>
            <textarea placeholder="Detalhes adicionais..."></textarea>
          </div>
        </form>
      );

    case "APONTAMENTO":
      return (
        <form className="modal-form">
          <div className="form-row">
            <div className="form-group">
              <label>ID do Operador (Você)</label>
              <input type="number" placeholder="Seu ID de usuário" required />
            </div>
            <div className="form-group">
              <label>ID da Ordem de Serviço</label>
              <input type="number" placeholder="Código da OS" required />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>ID da Matéria Prima</label>
              <input type="number" placeholder="Código do material (opcional)" />
            </div>
            <div className="form-group">
              <label>ID da Ferramenta</label>
              <input type="number" placeholder="Código da ferramenta (opcional)" />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Quantidade Utilizada</label>
              <input type="number" defaultValue="0" required />
            </div>
            <div className="form-group">
              <label>Tempo de Execução (Minutos)</label>
              <input type="number" placeholder="Ex: 60" required />
            </div>
          </div>
          <div className="form-group">
            <label>Observações do Trabalho</label>
            <textarea placeholder="Relate o que foi feito..."></textarea>
          </div>
        </form>
      );

    case "MP":
      return (
        <form className="modal-form">
          <div className="form-row">
            <div className="form-group">
              <label>Nome da Matéria Prima</label>
              <input type="text" placeholder="Ex: Barra Inox 304" required />
            </div>
            <div className="form-group">
              <label>Unidade de Medida</label>
              <select required>
                <option value="KG">Quilograma (KG)</option>
                <option value="L">Litro (L)</option>
                <option value="UN">Unidade (UN)</option>
                <option value="M">Metro (M)</option>
                <option value="CAIXA">Caixa</option>
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Quantidade Disponível</label>
              <input type="number" defaultValue="0" required />
            </div>
            <div className="form-group">
              <label>Valor Unitário (R$)</label>
              <input type="number" step="0.01" required />
            </div>
          </div>
          <div className="form-group">
            <label>ID do Fornecedor</label>
            <input type="number" placeholder="Código do fornecedor" required />
          </div>
          <div className="form-group">
            <label>Descrição</label>
            <textarea placeholder="Especificações técnicas..."></textarea>
          </div>
        </form>
      );

    case "PRODUTO":
      return (
        <form className="modal-form">
          <div className="form-group">
            <label>Nome do Produto</label>
            <input type="text" placeholder="Ex: Peça acabada X" required />
          </div>
          <div className="form-group">
            <label>Descrição / Modelo</label>
            <textarea required></textarea>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Custo Unitário (R$)</label>
              <input type="number" step="0.01" required />
            </div>
            <div className="form-group">
              <label>Preço Unitário (R$)</label>
              <input type="number" step="0.01" required />
            </div>
          </div>
          <div className="form-group">
            <label>Quantidade em Estoque</label>
            <input type="number" defaultValue="0" required />
          </div>
        </form>
      );

    default:
      return null;
  }
};

  const renderSidebarActions = () => {
    const isContatos = location.pathname === "/contatos";
    const actions = isContatos 
      ? [
          { label: "Registrar cliente", id: "CLIENTE" },
          { label: "Registrar fornecedor", id: "FORNECEDOR" }
        ]
      : [
          { label: "Criar ordem de serviço", id: "OS" },
          { label: "Gerar apontamento", id: "APONTAMENTO" },
          { label: "Registrar matéria prima", id: "MP" },
          { label: "Registrar produto", id: "PRODUTO" }
        ];

    return (
      <ul className="sidebar-list">
        {actions.map((action) => (
          <li key={action.id}>
            <button className="sidebar-action" onClick={() => setActiveModal(action.id)}>
              {action.label}
            </button>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="app-container">
      <header className="top-nav">
        <div className="nav-left-group">
          <nav className="header-links">
            <Link to="/" className={location.pathname === "/" ? "active" : ""}>Início</Link>
            <Link to="/estoque" className={location.pathname === "/estoque" ? "active" : ""}>Estoque</Link>
            <Link to="/contatos" className={location.pathname === "/contatos" ? "active" : ""}>Contatos</Link>
          </nav>
        </div>
        <div className="nav-user-info">
          <span className="user-name">Logado como: <strong>ID {userId}</strong></span>
          <button onClick={handleLogout} className="logout-button">Sair</button>
        </div>
      </header>
      
      <div className="main-content">
        <aside className="sidebar">
          <div className="sidebar-content">{renderSidebarActions()}</div>
          <div className="log-footer">Log do sistema</div>
        </aside>
        <main className="page-body">{children}</main>
      </div>

      <Modal 
        isOpen={!!activeModal} 
        onClose={() => setActiveModal(null)} 
        title={activeModal ? `Novo Registro: ${activeModal}` : ""}
      >
        {renderModalContent()}
        
        <div className="modal-footer">
          <button className="btn-secondary" onClick={() => setActiveModal(null)}>Cancelar</button>
          <button className="btn-primary">Salvar no Sistema</button>
        </div>
      </Modal>
    </div>
  );
};

export default Layout;