/* Ele é responsável por controlar todas as rotas (páginas) do sistema.
Em outras palavras, o React Router olha a URL atual e 
decide qual componente renderizar (por exemplo, /login → Login, /clientes → Clientes). */

import React from "react";
import type { ReactNode } from "react";
import { Routes, Route, Navigate } from "react-router-dom"; //componentes do React Router para definir rotas
/*import Login from "../pages/Login";
import Contatos from "../pages/Contatos";
import Relatorios from "../pages/Relatorios";
import Administrador from "../pages/Administrador";
import Estoque from "../pages/Estoque";
*/
import Home from "../pages/Home";

const isAuthenticated = () =>!!localStorage.getItem("kadmill:token");

const PrivateRoute = ({ children }: { children: ReactNode }) => {
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
};