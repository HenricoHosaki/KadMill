import express from 'express';
const router = express.Router();
import { OrdemServicoController } from '../controllers/ordensServico';
const ordemServicoController = new OrdemServicoController();

router.get('/ordensServicos', ordemServicoController.pegarTodosOrdemServico);
router.get('/ordensServicos/:id', ordemServicoController.pegarOrdemServicoPorId);
router.post('/ordensServicos', ordemServicoController.criarOrdemServico);

//Rotas de administração
router.put('/ordensServicos/:id', ordemServicoController.atualizarOrdemServico);
router.delete('/ordensServicos/:id', ordemServicoController.deletarOrdemServico);

export default router;