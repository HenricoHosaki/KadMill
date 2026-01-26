import axios from "axios"; 

// Esta função garante que a URL seja válida, não importa como você digitou no Railway
const getBaseURL = () => {
  const url = import.meta.env.VITE_API_URL;
  
  if (!url) return 'http://localhost:3333';

  // 1. Remove espaços e barras no final
  let cleanUrl = url.trim().replace(/\/$/, "");
  
  // 2. IMPORTANTE: Se a URL não começar com http, nós adicionamos. 
  // Isso evita que o navegador tente concatenar com o domínio do frontend.
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

// 1. INTERCEPTOR DE REQUISIÇÃO (Envia o Token)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("kadmill:token"); 
  if (token && config.headers) { 
    config.headers.Authorization = `Bearer ${token}`; 
  }
  return config;
});

// 2. INTERCEPTOR DE RESPOSTA (Trata os Erros Sozinho)
api.interceptors.response.use(
  (response) => {
    // Se a requisição funcionou, deixa passar os dados
    return response;
  },
  (error) => {
    // --- NOVO: REDIRECIONAMENTO DE SESSÃO EXPIRADA ---
    // Se o backend responder 401 (Não autorizado), forçamos o logout.
    if (error.response?.status === 401) {
      localStorage.removeItem("kadmill:token");
      // Usa window.location para garantir um refresh limpo e redirecionar
      window.location.href = "/login";
      return Promise.reject(error);
    }

    // Se deu erro (e não for 401), entra aqui AUTOMATICAMENTE
    let mensagem = "Ocorreu um erro inesperado.";

    // Tenta pegar a mensagem explicativa que o Backend mandou (ex: "Estoque insuficiente")
    if (error.response?.data?.message) {
      mensagem = error.response.data.message;
    } else if (error.response?.data?.error) {
      mensagem = error.response.data.error;
    } else if (error.message) {
      mensagem = error.message;
    }

    // --- FILTRO DE LIMPEZA (Remove "localhost" e erros técnicos) ---
    if (mensagem.toLowerCase().includes("network error")) {
      mensagem = "Sem conexão com o servidor. Verifique se o backend está rodando.";
    }
    if (mensagem.includes("localhost") || mensagem.includes("127.0.0.1") || mensagem.includes("refused")) {
      mensagem = "Falha de comunicação interna com o servidor.";
    }

    // --- VISUALIZADOR DE ERRO (Alerta Nativo) ---
    // Mostra o erro na tela para o usuário, já limpo
    alert(`❌ ERRO: ${mensagem}`);

    // Rejeita a promessa para que o seu botão de "Salvar" saiba que falhou e não feche o modal
    return Promise.reject(error);
  }
);