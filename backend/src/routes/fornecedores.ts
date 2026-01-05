import express from 'express';
const router = express.Router();
import { FornecedorController } from '../controllers/fornecedores';
import { autenticadorMiddleware, apenasAdmin } from '../middlewares/authMiddeware';
const fornecedorController = new FornecedorController();

router.get('/fornecedores', autenticadorMiddleware, (req, res) => fornecedorController.pegarTodosFornecedores(req, res));
router.get('/fornecedores/:id', autenticadorMiddleware, (req, res) => fornecedorController.pegarFornecedorPorId(req, res));
router.post('/fornecedores', autenticadorMiddleware, (req, res) => fornecedorController.criarFornecedor(req, res));

//Rotas de administração
router.put('/fornecedores/:id', autenticadorMiddleware, apenasAdmin, (req, res) => fornecedorController.atualizarFornecedor(req, res));
router.delete('/fornecedores/:id', autenticadorMiddleware, apenasAdmin, (req, res) => fornecedorController.deletarFornecedor(req, res));

export default router;