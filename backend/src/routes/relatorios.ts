import express from 'express';
const router = express.Router();
import { RelatorioController } from '../controllers/relatorios';
import { autenticadorMiddleware, apenasAdmin } from '../middlewares/authMiddeware';
const relatorioController = new RelatorioController();

//Rotas de administração de relatórios
router.get('/relatorios', autenticadorMiddleware, apenasAdmin, relatorioController.pegarTodasOrdensServicos);
router.get('/relatorios', autenticadorMiddleware, apenasAdmin, relatorioController.pegarTodosApontamentos);
router.get('/relatorios', autenticadorMiddleware, apenasAdmin, relatorioController.pegarTodosUsuarios);

export default router;