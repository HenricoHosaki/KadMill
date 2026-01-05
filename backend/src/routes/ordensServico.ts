import express from 'express';
const router = express.Router();
import { OrdemServicoController } from '../controllers/ordensServico';
import { autenticadorMiddleware, apenasAdmin } from '../middlewares/authMiddeware';
const ordemServicoController = new OrdemServicoController();

router.get('/ordensServicos', autenticadorMiddleware, (req, res) => ordemServicoController.pegarTodosOrdemServico(req, res));
router.get('/ordensServicos/:id', autenticadorMiddleware, (req, res) => ordemServicoController.pegarOrdemServicoPorId(req, res));
router.post('/ordensServicos', autenticadorMiddleware, (req, res) => ordemServicoController.criarOrdemServico(req, res));

//Rotas de administração
router.put('/ordensServicos/:id', autenticadorMiddleware, apenasAdmin, (req, res) => ordemServicoController.atualizarOrdemServico(req, res));
router.delete('/ordensServicos/:id', autenticadorMiddleware, apenasAdmin, (req, res) => ordemServicoController.deletarOrdemServico(req, res));

export default router;