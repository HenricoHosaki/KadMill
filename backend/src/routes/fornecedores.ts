import express from 'express';
const router = express.Router();
import { FornecedorController } from '../controllers/fornecedores';
import { autenticadorMiddleware, apenasAdmin } from '../middlewares/authMiddeware';
const fornecedorController = new FornecedorController();

router.get('/fornecedores', autenticadorMiddleware, fornecedorController.pegarTodosFornecedores);
router.get('/fornecedores/:id', autenticadorMiddleware, fornecedorController.pegarFornecedorPorId);
router.post('/fornecedores', autenticadorMiddleware, fornecedorController.criarFornecedor);

//Rotas de administração
router.put('/fornecedores/:id', autenticadorMiddleware, apenasAdmin, fornecedorController.atualizarFornecedor);
router.delete('/fornecedores/:id', autenticadorMiddleware, apenasAdmin, fornecedorController.deletarFornecedor);

export default router;