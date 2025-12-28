import express from 'express';
const router = express.Router();
import { ClienteController } from '../controllers/clientes';
import { autenticadorMiddleware, apenasAdmin } from '../middlewares/authMiddeware';
const clienteController = new ClienteController();

router.get('/clientes', autenticadorMiddleware, clienteController.pegarTodosClientes);
router.get('/clientes/:id', autenticadorMiddleware, clienteController.pegarClientePorId);
router.post('/clientes', autenticadorMiddleware, clienteController.criarCliente);

//Rotas de administração
router.put('/clientes/:id', autenticadorMiddleware, apenasAdmin, clienteController.atualizarUsuario);
router.delete('/clientes/:id', autenticadorMiddleware, apenasAdmin, clienteController.deletarUsuario);

export default router;