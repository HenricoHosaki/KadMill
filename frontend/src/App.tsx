/*Ele funciona como o “container raiz” da aplicação React — tudo o que o usuário vê na tela passa por aqui.
O App.tsx normalmente:
organiza as rotas (via um roteador como AppRouter);
define layout global (header, sidebar, tema, etc);
carrega contextos (ex: autenticação, idioma, tema);
e é renderizado dentro do main.tsx (que já vimos antes).*/


import React from "react";
import AppRouter from "./routes/AppRouter";
import './App.css'

const App: React.FC = () => {
  return <AppRouter/>;
};

export default App;

