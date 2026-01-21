import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "../components/Layout";
import Home from "../pages/Home";
import Estoque from "../pages/Estoque";
import Contatos from "../pages/Contatos";
import ImpressaoOS from "../pages/ImpressaoOs"; 
import Admin from "../pages/Admin"; 
import Login from "../pages/Login";
import { isAdmin } from "../utils/authUtils"; 

const isAuthenticated = () => !!localStorage.getItem("kadmill:token");

// 1. Rota Protegida PADRÃO (Com Menu Lateral e Cabeçalho)
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  return isAuthenticated() ? <Layout>{children}</Layout> : <Navigate to="/login" replace />;
};

// 2. Rota Protegida para ADMIN
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  if (!isAuthenticated()) return <Navigate to="/login" replace />;
  if (!isAdmin()) return <Navigate to="/" replace />;
  return <Layout>{children}</Layout>;
};

// 3. NOVO: Rota Protegida de IMPRESSÃO (SEM O LAYOUT)
// Essa rota verifica o login, mas retorna o 'children' direto, sem envolver no <Layout>
const PrintRoute = ({ children }: { children: React.ReactNode }) => {
  return isAuthenticated() ? <>{children}</> : <Navigate to="/login" replace />;
};

const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      {/* Rotas do Sistema (Com Layout) */}
      <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
      <Route path="/estoque" element={<PrivateRoute><Estoque /></PrivateRoute>} />
      <Route path="/contatos" element={<PrivateRoute><Contatos /></PrivateRoute>} />
      <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
      
      {/* ALTERAÇÃO AQUI: 
         Usamos PrintRoute ao invés de PrivateRoute.
         Isso remove o menu lateral e o header da tela de impressão.
      */}
      <Route path="/imprimir/os/:id" element={<PrintRoute><ImpressaoOS /></PrintRoute>} />
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRouter;