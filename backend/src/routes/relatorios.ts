import express from 'express';
const router = express.Router();
import { RelatorioController } from '../controllers/relatorios';
import { autenticadorMiddleware, apenasAdmin } from '../middlewares/authMiddeware';
const relatorioController = new RelatorioController();

//Rotas de administração de relatórios
router.get('/relatorios', relatorioController.pegarTodasOrdensServicos, autenticadorMiddleware, apenasAdmin);
router.get('/relatorios', relatorioController.pegarTodosApontamentos, autenticadorMiddleware, apenasAdmin);
router.get('/relatorios', relatorioController.pegarTodosUsuarios, autenticadorMiddleware, apenasAdmin);

export default router;