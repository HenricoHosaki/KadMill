import express from 'express';
const router = express.Router();
import { RelatorioController } from '../controllers/relatorios';
import { autenticadorMiddleware, apenasAdmin } from '../middlewares/authMiddeware';
const relatorioController = new RelatorioController();

//Rotas de administração de relatórios
router.get('/relatorios/ordens', autenticadorMiddleware, apenasAdmin, (req, res) => relatorioController.pegarTodasOrdensServicos(req, res));
router.get('/relatorios/apontamentos', autenticadorMiddleware, apenasAdmin, (req, res) => relatorioController.pegarTodosApontamentos(req, res));
router.get('/relatorios/usuarios', autenticadorMiddleware, apenasAdmin, (req, res) => relatorioController.pegarTodosUsuarios(req, res));

export default router;