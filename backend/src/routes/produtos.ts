import express from 'express';
const router = express.Router();
import { ProdutoController } from '../controllers/produtos';
import { autenticadorMiddleware, apenasAdmin } from '../middlewares/authMiddeware';
const produtoController = new ProdutoController();

router.get('/produtos', autenticadorMiddleware, (req, res) => produtoController.pegarTodosProdutos(req, res));
router.get('/produtos/:id', autenticadorMiddleware, (req, res) => produtoController.pegarProdutoPorId(req, res));
router.post('/produtos', autenticadorMiddleware, (req, res) => produtoController.criarProduto(req, res));

//Rotas de administração
router.put('/produtos/:id', autenticadorMiddleware, apenasAdmin, (req, res) => produtoController.atualizarProduto(req, res));
router.delete('/produtos/:id', autenticadorMiddleware, apenasAdmin, (req, res) => produtoController.deletarProduto(req, res));

export default router;