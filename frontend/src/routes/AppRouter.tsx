import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "../components/Layout";
import Home from "../pages/Home";
import Estoque from "../pages/Estoque";
import Contatos from "../pages/Contatos";
import ImpressaoOS from "../pages/ImpressaoOs";
import Admin from "../pages/Admin"; // <--- Importante: Importar a página Admin
import Login from "../pages/Login";
import { isAdmin } from "../utils/authUtils"; // <--- Importante: Importar a verificação

const isAuthenticated = () => !!localStorage.getItem("kadmill:token");

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  return isAuthenticated() ? <Layout>{children}</Layout> : <Navigate to="/login" replace />;
};

// Rota Protegida Exclusiva para ADMIN
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  if (!isAuthenticated()) return <Navigate to="/login" replace />;
  // Se não for admin, joga para a Home (por isso você via a página de início)
  if (!isAdmin()) return <Navigate to="/" replace />;
  return <Layout>{children}</Layout>;
};

const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      {/* Rotas Normais */}
      <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
      <Route path="/estoque" element={<PrivateRoute><Estoque /></PrivateRoute>} />
      <Route path="/contatos" element={<PrivateRoute><Contatos /></PrivateRoute>} />
      
      {/* Rota de Admin (ESTAVA FALTANDO ISTO) */}
      <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
      
      {/* Qualquer outra rota vai para o início */}
      <Route path="*" element={<Navigate to="/" replace />} />

      <Route path="/imprimir/os/:id" element={<PrivateRoute><ImpressaoOS /></PrivateRoute>} />
    </Routes>
  );
};

export default AppRouter;