import axios from "axios"; 

const getBaseURL = () => {
  const url = import.meta.env.VITE_API_URL;
  
  if (!url) return 'http://localhost:3333';

  let cleanUrl = url.trim().replace(/\/$/, "");
  
  if (!cleanUrl.startsWith('http')) {
    cleanUrl = `https://${cleanUrl}`;
  }
  
  return cleanUrl;
};

export const api = axios.create({
  baseURL: getBaseURL(), 
  headers: {
    "Content-Type": "application/json", 
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("kadmill:token"); 
  if (token && config.headers) { 
    config.headers.Authorization = `Bearer ${token}`; 
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
   
    if (error.response?.status === 401) {
      localStorage.removeItem("kadmill:token");
      window.location.href = "/login";
      return Promise.reject(error);
    }

    let mensagem = "Ocorreu um erro inesperado.";

    if (error.response?.data?.message) {
      mensagem = error.response.data.message;
    } else if (error.response?.data?.error) {
      mensagem = error.response.data.error;
    } else if (error.message) {
      mensagem = error.message;
    }

    if (mensagem.toLowerCase().includes("network error")) {
      mensagem = "Sem conexão com o servidor. Verifique se o backend está rodando.";
    }
    if (mensagem.includes("localhost") || mensagem.includes("127.0.0.1") || mensagem.includes("refused")) {
      mensagem = "Falha de comunicação interna com o servidor.";
    }

    alert(`❌ ERRO: ${mensagem}`);

    return Promise.reject(error);
  }
);