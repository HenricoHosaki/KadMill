/* O api.ts serve para centralizar toda a comunicação entre o frontend e o backend.
Em vez de chamar o axios diretamente em cada componente, você cria uma instância configurada e usa ela em todo o projeto.
Assim, se um dia você mudar a URL da API, ou quiser adicionar autenticação, logging, etc.,
você altera apenas esse arquivo — o resto do código continua igual.
Ele cuida do endereço, formato, e segurança (token) de todas as chamadas à API. */

import axios from "axios"; //cuida das requisições HTTP

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3333";

export const api = axios.create({
  baseURL, //endereço base do backend
  headers: {
    "Content-Type": "application/json", //todos os dados enviados e recebidos serão em JSON
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("kadmill:token"); //pega o token de autenticação do armazenamento local
  if (token && config.headers) { //adiciona o token de autenticação em cada requisição, se existir
    config.headers.Authorization = `Bearer ${token}`; //padrão Bearer token
  }
  return config;
});