export const getUserInfo = () => {
  const token = localStorage.getItem("kadmill:token");
  if (!token) return null;

  try {
    // 1. Separa o payload (parte do meio do token)
    const base64Url = token.split('.')[1];
    
    // 2. Ajusta para Base64 padrão
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    
    // 3. Decodifica manualmente
    const jsonPayload = decodeURIComponent(
      window.atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Erro ao ler token:", error);
    return null;
  }
};

export const isAdmin = () => {
  const user = getUserInfo();
  return user?.funcao === 'ADMIN';
};