import React from "react";

const Home: React.FC = () => {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>Bem-vindo ao KadMill 👋</h1>
      <p>Esta é a página inicial do sistema.</p>

      <section style={{ marginTop: "2rem" }}>
        <h3>O que você pode fazer aqui:</h3>
        <ul>
          <li>Gerenciar clientes e torneiros</li>
          <li>Controlar matérias-primas e estoque</li>
          <li>Registrar ordens de serviço</li>
          <li>Visualizar relatórios da produção</li>
        </ul>
      </section>
    </div>
  );
};

export default Home;