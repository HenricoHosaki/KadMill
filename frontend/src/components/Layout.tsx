import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Recupera o ID ou info do usuário se estiver salvo no localStorage
  const userId = localStorage.getItem("kadmill:userId") || "Usuário";

  const handleLogout = () => {
    localStorage.removeItem("kadmill:token");
    localStorage.removeItem("kadmill:userId");
    navigate("/login");
  };

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
        <div className="nav-left-group">
          {/* Links de navegação incluindo o novo botão Início */}
          <nav className="header-links">
            <Link to="/" className={location.pathname === "/" ? "active" : ""}>Início</Link>
            <Link to="/estoque" className={location.pathname === "/estoque" ? "active" : ""}>Estoque</Link>
            <Link to="/contatos" className={location.pathname === "/contatos" ? "active" : ""}>Contatos</Link>
          </nav>
        </div>

        {/* Seção da direita: Usuário e Sair */}
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
    </div>
  );
};

export default Layout;