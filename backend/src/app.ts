import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import clientesRoutes from './routes/clientes';
import fornecedoresRoutes from './routes/fornecedores';
import produtosRoutes from './routes/produtos';
import ordensServicoRoutes from './routes/ordensServico';
import materiasPrimasRoutes from './routes/materiasPrimas';
import apontamentosRoutes from './routes/apontamentos';
import administradoresRoutes from './routes/administradores';
import loginRoutes from './routes/authLogin'
import relatoriosRoutes from './routes/relatorios';
import { criarAdmin } from './bootstrap/defaultAdmin'
import { errorHandler } from './middlewares/globalLogs';

async function start() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.use(clientesRoutes);
  app.use(fornecedoresRoutes);
  app.use(produtosRoutes);
  app.use(ordensServicoRoutes);
  app.use(materiasPrimasRoutes);
  app.use(apontamentosRoutes);
  app.use(administradoresRoutes);
  app.use(loginRoutes)
  app.use(relatoriosRoutes);
  app.use(errorHandler)

  await criarAdmin();

  app.listen(process.env.PORT || 3333, () => {
    console.log(`Server is running on port ${process.env.PORT || 3333}`);
  });
}

start().catch(err => {
  console.error("Erro ao iniciar a aplicação:", err);
  process.exit(1);
});