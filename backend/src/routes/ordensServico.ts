import express from 'express';
const router = express.Router();
import { OrdemServicoController } from '../controllers/ordensServico';
import { autenticadorMiddleware, apenasAdmin } from '../middlewares/authMiddeware';
const ordemServicoController = new OrdemServicoController();

router.get('/ordensServicos', ordemServicoController.pegarTodosOrdemServico, autenticadorMiddleware);
router.get('/ordensServicos/:id', ordemServicoController.pegarOrdemServicoPorId, autenticadorMiddleware);
router.post('/ordensServicos', ordemServicoController.criarOrdemServico, autenticadorMiddleware);

//Rotas de administração
router.put('/ordensServicos/:id', ordemServicoController.atualizarOrdemServico, autenticadorMiddleware, apenasAdmin);
router.delete('/ordensServicos/:id', ordemServicoController.deletarOrdemServico, autenticadorMiddleware, apenasAdmin);

export default router;