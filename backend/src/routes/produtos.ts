import express from 'express';
const router = express.Router();
import { ProdutoController } from '../controllers/produtos';
import { autenticadorMiddleware, apenasAdmin } from '../middlewares/authMiddeware';
const produtoController = new ProdutoController();

router.get('/produtos', produtoController.pegarTodosProdutos, autenticadorMiddleware);
router.get('/produtos/:id', produtoController.pegarProdutoPorId, autenticadorMiddleware);
router.post('/produtos', produtoController.criarProduto, autenticadorMiddleware);

//Rotas de administração
router.put('/produtos/:id', produtoController.atualizarProduto, autenticadorMiddleware, apenasAdmin);
router.delete('/produtos/:id', produtoController.deletarProduto, autenticadorMiddleware, apenasAdmin);

export default router;