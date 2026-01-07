import React from "react";
import { Link, useLocation } from "react-router-dom";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  const renderSidebarActions = () => {
    if (location.pathname === "/contatos") {
      return (
        <ul>
          <li><button className="sidebar-action">Registrar cliente</button></li>
          <li><button className="sidebar-action">Registrar fornecedor</button></li>
        </ul>
      );
    }
    return (
      <ul>
        <li><button className="sidebar-action">Criar ordem de serviço</button></li>
        <li><button className="sidebar-action">Gerar apontamento</button></li>
        <li><button className="sidebar-action">Registrar matéria prima</button></li>
        <li><button className="sidebar-action">Registrar produto</button></li>
      </ul>
    );
  };

  return (
    <div className="app-container">
      <header className="top-nav">
        {/* Início através da logo */}
        <Link to="/" className="nav-logo-link">
          <img src="/logo.png" alt="KadMill" className="nav-logo-img" />
        </Link>
        <nav>
          <Link to="/estoque" className={location.pathname === "/estoque" ? "active" : ""}>Estoque</Link>
          <Link to="/contatos" className={location.pathname === "/contatos" ? "active" : ""}>Contatos</Link>
        </nav>
      </header>
      
      <div className="main-content">
        <aside className="sidebar">
          <div className="sidebar-content">{renderSidebarActions()}</div>
          <div className="log-footer">Log do sistema</div>
        </aside>
        <main className="page-body">{children}</main>
      </div>
    </div>
  );
};

export default Layout;