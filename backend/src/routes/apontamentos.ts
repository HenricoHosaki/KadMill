import express from 'express';
const router = express.Router();
import { ApontamentoController } from '../controllers/apontamentos';
import { autenticadorMiddleware, apenasAdmin } from '../middlewares/authMiddeware';
const apontamentoController = new ApontamentoController();

router.get('/apontamentos', autenticadorMiddleware, apontamentoController.pegarTodosApontamentos);
router.get('/apontamentos/:id', autenticadorMiddleware, apontamentoController.pegarApontamentoPorId);
router.post('/apontamentos', autenticadorMiddleware, apontamentoController.criarApontamento);

//Rotas de administração
router.put('/apontamentos/:id', autenticadorMiddleware, apenasAdmin, apontamentoController.atualizarApontamento);
router.delete('/apontamentos/:id', autenticadorMiddleware, apenasAdmin, apontamentoController.deletarApontamento);
export default router;