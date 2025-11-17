import express from 'express';
import dotenv from 'dotenv';
import clientesRoutes from './routes/clientes';
import fornecedoresRoutes from './routes/fornecedores';
import produtosRoutes from './routes/produtos';
import ordensServicoRoutes from './routes/ordensServico';
import materiasPrimasRoutes from './routes/materiasPrimas';
import apontamentosRoutes from './routes/apontamentos';
import administradoresRoutes from './routes/administradores';
dotenv.config();

const port = process.env.PORT;
const app = express();
app.use(express.json());
app.use(clientesRoutes)
app.use(fornecedoresRoutes)
app.use(produtosRoutes)
app.use(ordensServicoRoutes)
app.use(materiasPrimasRoutes)
app.use(apontamentosRoutes)
app.use(administradoresRoutes)

app.listen(process.env.PORT || 3333, () => {
    console.log(`Server is running on port ${process.env.PORT || 3333}`);
});