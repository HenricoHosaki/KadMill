// frontend/src/components/Layout.tsx
import React from "react";
import { Link, useLocation } from "react-router-dom";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  // Função para renderizar as ações baseadas na rota atual dos protótipos
  const renderSidebarActions = () => {
    // Se estiver na tela de Contatos
    if (location.pathname === "/contatos") {
      return (
        <ul>
          <li><button className="sidebar-action">Registrar cliente</button></li>
          <li><button className="sidebar-action">Registrar fornecedor</button></li>
        </ul>
      );
    }

    // Se estiver na tela de Estoque ou Home
    return (
      <ul>
        <li><button className="sidebar-action">Criar ordem de serviço</button></li>
        <li><button className="sidebar-action">Gerar apontamento de serviço</button></li>
        <li><button className="sidebar-action">Imprimir ordem de Serviço</button></li>
        <li><button className="sidebar-action">Registrar matéria prima</button></li>
        <li><button className="sidebar-action">Registrar produto</button></li>
      </ul>
    );
  };

  return (
    <div className="app-container">
      <header className="top-nav">
        <nav>
          {/* Links de navegação superior conforme o protótipo */}
          <Link to="/" className={location.pathname === "/" ? "active" : ""}>Inventário</Link>
          <Link to="/estoque" className={location.pathname === "/estoque" ? "active" : ""}>Estoque</Link>
          <Link to="/contatos" className={location.pathname === "/contatos" ? "active" : ""}>Contatos</Link>
        </nav>
      </header>
      
      <div className="main-content">
        <aside className="sidebar">
          <div className="sidebar-content">
            {renderSidebarActions()}
          </div>
          {/* Rodapé da sidebar conforme o protótipo */}
          <div className="log-footer">Log do sistema</div>
        </aside>
        
        <main className="page-body">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;