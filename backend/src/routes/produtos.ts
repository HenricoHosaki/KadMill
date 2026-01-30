import express from 'express';
const router = express.Router();
import { ProdutoController } from '../controllers/produtos';
import { autenticadorMiddleware, apenasAdmin } from '../middlewares/authMiddeware';
const produtoController = new ProdutoController();

/**
 * Rotas de produto do servidor recebendo as funções criadas no controlador, o middleware de autenticação e a verificação de função Admin para liberar acesso.
 * @notes deve ser passado as funções nesta ordem para que funcione a rota.
 * @param req - Utilizada de Requisition para se comunicar com o express e utilizar as funções
 * @param res - Utilizada de Response para se comunicar com o express e utilizar as funções
 */
router.get('/produtos', autenticadorMiddleware, (req, res) => produtoController.pegarTodosProdutos(req, res));
router.get('/produtos/:id', autenticadorMiddleware, (req, res) => produtoController.pegarProdutoPorId(req, res));
router.post('/produtos', autenticadorMiddleware, (req, res) => produtoController.criarProduto(req, res));

//Rotas de administração
router.put('/produtos/:id', autenticadorMiddleware, apenasAdmin, (req, res) => produtoController.atualizarProduto(req, res));
router.delete('/produtos/:id', autenticadorMiddleware, apenasAdmin, (req, res) => produtoController.deletarProduto(req, res));

export default router;