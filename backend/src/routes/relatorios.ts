import express from 'express';
const router = express.Router();
import { RelatorioController } from '../controllers/relatorios';
import { autenticadorMiddleware, apenasAdmin } from '../middlewares/authMiddeware';
const relatorioController = new RelatorioController();

/**
 * Rotas de relatório do servidor recebendo as funções criadas no controlador, o middleware de autenticação e a verificação de função Admin para liberar acesso.
 * @notes deve ser passado as funções nesta ordem para que funcione a rota.
 * @param req - Utilizada de Requisition para se comunicar com o express e utilizar as funções
 * @param res - Utilizada de Response para se comunicar com o express e utilizar as funções
 */
router.get('/relatorios/ordens', autenticadorMiddleware, apenasAdmin, (req, res) => relatorioController.pegarTodasOrdensServicos(req, res));
router.get('/relatorios/apontamentos', autenticadorMiddleware, apenasAdmin, (req, res) => relatorioController.pegarTodosApontamentos(req, res));
router.get('/relatorios/usuarios', autenticadorMiddleware, apenasAdmin, (req, res) => relatorioController.pegarTodosUsuarios(req, res));

export default router;