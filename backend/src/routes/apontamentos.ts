import express from 'express';
const router = express.Router();
import { ApontamentoController } from '../controllers/apontamentos';
import { autenticadorMiddleware, apenasAdmin } from '../middlewares/authMiddeware';
const apontamentoController = new ApontamentoController();

router.get('/apontamentos', apontamentoController.pegarTodosApontamentos, autenticadorMiddleware);
router.get('/apontamentos:id', apontamentoController.pegarApontamentoPorId, autenticadorMiddleware);
router.post('/apontamentos', apontamentoController.criarApontamento, autenticadorMiddleware);

//Rotas de administração
router.put('/apontamentos:id', apontamentoController.atualizarApontamento, autenticadorMiddleware, apenasAdmin);
router.delete('/apontamentos:id', apontamentoController.deletarApontamento, autenticadorMiddleware, apenasAdmin);

export default router;