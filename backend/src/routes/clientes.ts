import express from 'express';
const router = express.Router();
import { ClienteController } from '../controllers/clientes';
import { autenticadorMiddleware, apenasAdmin } from '../middlewares/authMiddeware';
const clienteController = new ClienteController();

/**
 * Rotas de clientes do servidor recebendo as funções criadas no controlador, o middleware de autenticação e a verificação de função Admin para liberar acesso.
 * @notes deve ser passado as funções nesta ordem para que funcione a rota.
 * @param req - Utilizada de Requisition para se comunicar com o express e utilizar as funções
 * @param res - Utilizada de Response para se comunicar com o express e utilizar as funções
 */
router.get('/clientes', autenticadorMiddleware, (req, res) => clienteController.pegarTodosClientes(req, res));
router.get('/clientes/:id', autenticadorMiddleware, (req, res) => clienteController.pegarClientePorId(req, res));
router.post('/clientes', autenticadorMiddleware, (req, res) => clienteController.criarCliente(req, res));

//Rotas de administração
router.put('/clientes/:id', autenticadorMiddleware, apenasAdmin, (req, res) => clienteController.atualizarUsuario(req, res));
router.delete('/clientes/:id', autenticadorMiddleware, apenasAdmin, (req, res) => clienteController.deletarUsuario(req, res));

export default router;