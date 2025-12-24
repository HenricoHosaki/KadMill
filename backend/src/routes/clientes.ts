import express from 'express';
const router = express.Router();
import { ClienteController } from '../controllers/clientes';
import { autenticadorMiddleware, apenasAdmin } from '../middlewares/authMiddeware';
const clienteController = new ClienteController();

router.get('/clientes', clienteController.pegarTodosClientes, autenticadorMiddleware);
router.get('/clientes/:id', clienteController.pegarClientePorId, autenticadorMiddleware);
router.post('/clientes', clienteController.criarCliente, autenticadorMiddleware);

//Rotas de administração
router.put('/clientes/:id', clienteController.atualizarUsuario, autenticadorMiddleware, apenasAdmin);
router.delete('/clientes/:id', clienteController.deletarUsuario, autenticadorMiddleware, apenasAdmin);

export default router;