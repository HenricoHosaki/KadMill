import express from 'express';
const router = express.Router();
import { ApontamentoController } from '../controllers/apontamentos';
const apontamentoController = new ApontamentoController();

router.get('/apontamentos', apontamentoController.pegarTodosApontamentos);
router.get('/apontamentos:id', apontamentoController.pegarApontamentoPorId);
router.post('/apontamentos', apontamentoController.criarApontamento);

//Rotas de administração
router.put('/apontamentos:id', apontamentoController.atualizarApontamento);
router.delete('/apontamentos:id', apontamentoController.deletarApontamento);

export default router;