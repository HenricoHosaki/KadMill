import express from 'express';
const router = express.Router();
import { ProdutoController } from '../controllers/produtos';
const produtoController = new ProdutoController();

router.get('/produtos', produtoController.pegarTodosProdutos);
router.get('/produtos/:id', produtoController.pegarProdutoPorId);
router.post('/produtos', produtoController.criarProduto);

//Rotas de administração
router.put('/produtos/:id', produtoController.atualizarProduto);
router.delete('/produtos/:id', produtoController.deletarProduto);

export default router;