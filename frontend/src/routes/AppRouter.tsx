import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "../components/Layout";
import Home from "../pages/Home";
import Estoque from "../pages/Estoque";
import Contatos from "../pages/Contatos";
import ImpressaoOS from "../pages/ImpressaoOs"; // Verifique se o nome do arquivo começa com Maiúscula
import Admin from "../pages/Admin"; 
import Login from "../pages/Login";
import { isAdmin } from "../utils/authUtils"; 

const isAuthenticated = () => !!localStorage.getItem("kadmill:token");

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  return isAuthenticated() ? <Layout>{children}</Layout> : <Navigate to="/login" replace />;
};

// Rota Protegida Exclusiva para ADMIN
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  if (!isAuthenticated()) return <Navigate to="/login" replace />;
  // Se não for admin, joga para a Home
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
      
      {/* Rota de Admin */}
      <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
      
      {/* IMPORTANTE: A Rota de Impressão deve vir ANTES do "*" 
         para não cair no redirecionamento padrão.
      */}
      <Route path="/imprimir/os/:id" element={<PrivateRoute><ImpressaoOS /></PrivateRoute>} />
      
      {/* Qualquer outra rota desconhecida vai para o início (Coringa) */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRouter;