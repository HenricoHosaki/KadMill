import express from 'express';
const router = express.Router();
import { RelatorioController } from '../controllers/relatorios';
const relatorioController = new RelatorioController();

//Rotas de administração de relatórios
router.get('/relatorios', relatorioController.pegarTodasOrdensServicos);
router.get('/relatorios', relatorioController.pegarTodosApontamentos);
router.get('/relatorios', relatorioController.pegarTodosUsuarios);

export default router;