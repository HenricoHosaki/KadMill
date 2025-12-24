import express from 'express';
const router = express.Router();
import { FornecedorController } from '../controllers/fornecedores';
import { autenticadorMiddleware, apenasAdmin } from '../middlewares/authMiddeware';
const fornecedorController = new FornecedorController();

router.get('/fornecedores', fornecedorController.pegarTodosFornecedores, autenticadorMiddleware);
router.get('/fornecedores/:id', fornecedorController.pegarFornecedorPorId, autenticadorMiddleware);
router.post('/fornecedores', fornecedorController.criarFornecedor, autenticadorMiddleware);

//Rotas de administração
router.put('/fornecedores/:id', fornecedorController.atualizarFornecedor, autenticadorMiddleware, apenasAdmin);
router.delete('/fornecedores/:id', fornecedorController.deletarFornecedor, autenticadorMiddleware, apenasAdmin);

export default router;