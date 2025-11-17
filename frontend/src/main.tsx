import { StrictMode } from "react";
import React from "react";
import { createRoot } from "react-dom/client"; //API para gerenciar o DOM de forma eficiente
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; //gerencia o cache de dados e o estado das requisições
import { BrowserRouter } from 'react-router-dom'; //gerencia as rotas da aplicação
import './index.css'
import App from './App.tsx'

const queryClient = new QueryClient(); //instância do gerenciador de queries

const container = document.getElementById('root')!;
const root = createRoot(container);


