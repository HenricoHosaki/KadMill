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

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  return isAuthenticated() ? <Layout>{children}</Layout> : <Navigate to="/login" replace />;
};

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  if (!isAuthenticated()) return <Navigate to="/login" replace />;
  if (!isAdmin()) return <Navigate to="/" replace />;
  return <Layout>{children}</Layout>;
};

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
      <Route path="/imprimir/os/:id" element={<PrintRoute><ImpressaoOS /></PrintRoute>} />
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRouter;