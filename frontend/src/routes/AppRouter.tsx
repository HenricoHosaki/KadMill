import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "../components/Layout";
import Home from "../pages/Home";
import Estoque from "../pages/Estoque";
import Contatos from "../pages/Contatos";
import Login from "../pages/Login";

const isAuthenticated = () => !!localStorage.getItem("kadmill:token");

// AQUI ESTÁ O SEGREDO: O PrivateRoute agora envolve as páginas com o <Layout>
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  return isAuthenticated() ? <Layout>{children}</Layout> : <Navigate to="/login" replace />;
};

const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
      <Route path="/estoque" element={<PrivateRoute><Estoque /></PrivateRoute>} />
      <Route path="/contatos" element={<PrivateRoute><Contatos /></PrivateRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRouter;