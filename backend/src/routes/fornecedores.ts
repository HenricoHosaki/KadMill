import express from 'express';
const router = express.Router();
import { FornecedorController } from '../controllers/fornecedores';
import { autenticadorMiddleware, apenasAdmin } from '../middlewares/authMiddeware';
const fornecedorController = new FornecedorController();

/**
 * Rotas de fornecedores do servidor recebendo as funções criadas no controlador, o middleware de autenticação e a verificação de função Admin para liberar acesso.
 * @notes deve ser passado as funções nesta ordem para que funcione a rota.
 * @param req - Utilizada de Requisition para se comunicar com o express e utilizar as funções
 * @param res - Utilizada de Response para se comunicar com o express e utilizar as funções
 */
router.get('/fornecedores', autenticadorMiddleware, (req, res) => fornecedorController.pegarTodosFornecedores(req, res));
router.get('/fornecedores/:id', autenticadorMiddleware, (req, res) => fornecedorController.pegarFornecedorPorId(req, res));
router.post('/fornecedores', autenticadorMiddleware, (req, res) => fornecedorController.criarFornecedor(req, res));

//Rotas de administração
router.put('/fornecedores/:id', autenticadorMiddleware, apenasAdmin, (req, res) => fornecedorController.atualizarFornecedor(req, res));
router.delete('/fornecedores/:id', autenticadorMiddleware, apenasAdmin, (req, res) => fornecedorController.deletarFornecedor(req, res));

export default router;