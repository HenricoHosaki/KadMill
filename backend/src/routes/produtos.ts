import express from 'express';
const router = express.Router();
import { ProdutoController } from '../controllers/produtos';
import { autenticadorMiddleware, apenasAdmin } from '../middlewares/authMiddeware';
const produtoController = new ProdutoController();

router.get('/produtos', autenticadorMiddleware, produtoController.pegarTodosProdutos);
router.get('/produtos/:id', autenticadorMiddleware, produtoController.pegarProdutoPorId);
router.post('/produtos', autenticadorMiddleware, produtoController.criarProduto);

//Rotas de administração
router.put('/produtos/:id', autenticadorMiddleware, apenasAdmin, produtoController.atualizarProduto);
router.delete('/produtos/:id', autenticadorMiddleware, apenasAdmin, produtoController.deletarProduto);

export default router;