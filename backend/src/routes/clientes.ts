import express from 'express';
const router = express.Router();
import { ClienteController } from '../controllers/clientes';
const clienteController = new ClienteController();

router.get('/clientes', clienteController.pegarTodosClientes);
router.get('/clientes/:id', clienteController.pegarClientePorId);
router.post('/clientes', clienteController.criarCliente);

//Rotas de administração
router.put('/clientes/:id', clienteController.atualizarUsuario);
router.delete('/clientes/:id', clienteController.deletarUsuario);

export default router;