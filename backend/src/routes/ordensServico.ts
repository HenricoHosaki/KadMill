import express from 'express';
const router = express.Router();
import { OrdemServicoController } from '../controllers/ordensServico';
import { autenticadorMiddleware, apenasAdmin } from '../middlewares/authMiddeware';
const ordemServicoController = new OrdemServicoController();

/**
 * Rotas de ordemServiço do servidor recebendo as funções criadas no controlador, o middleware de autenticação e a verificação de função Admin para liberar acesso.
 * @notes deve ser passado as funções nesta ordem para que funcione a rota.
 * @param req - Utilizada de Requisition para se comunicar com o express e utilizar as funções
 * @param res - Utilizada de Response para se comunicar com o express e utilizar as funções
 */
router.get('/ordensServicos', autenticadorMiddleware, (req, res) => ordemServicoController.pegarTodosOrdemServico(req, res));
router.get('/ordensServicos/:id', autenticadorMiddleware, (req, res) => ordemServicoController.pegarOrdemServicoPorId(req, res));
router.post('/ordensServicos', autenticadorMiddleware, (req, res) => ordemServicoController.criarOrdemServico(req, res));

//Rotas de administração
router.put('/ordensServicos/:id', autenticadorMiddleware, apenasAdmin, (req, res) => ordemServicoController.atualizarOrdemServico(req, res));
router.delete('/ordensServicos/:id', autenticadorMiddleware, apenasAdmin, (req, res) => ordemServicoController.deletarOrdemServico(req, res));

export default router;