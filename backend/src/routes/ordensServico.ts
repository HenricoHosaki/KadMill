import express from 'express';
const router = express.Router();
import { OrdemServicoController } from '../controllers/ordensServico';
import { autenticadorMiddleware, apenasAdmin } from '../middlewares/authMiddeware';
const ordemServicoController = new OrdemServicoController();

router.get('/ordensServicos', autenticadorMiddleware, ordemServicoController.pegarTodosOrdemServico);
router.get('/ordensServicos/:id', autenticadorMiddleware, ordemServicoController.pegarOrdemServicoPorId);
router.post('/ordensServicos', autenticadorMiddleware, ordemServicoController.criarOrdemServico);

//Rotas de administração
router.put('/ordensServicos/:id', autenticadorMiddleware, apenasAdmin, ordemServicoController.atualizarOrdemServico);
router.delete('/ordensServicos/:id', autenticadorMiddleware, apenasAdmin, ordemServicoController.deletarOrdemServico);

export default router;