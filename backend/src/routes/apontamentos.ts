import express from 'express';
const router = express.Router();
import { ApontamentoController } from '../controllers/apontamentos';
import { autenticadorMiddleware, apenasAdmin } from '../middlewares/authMiddeware';
const apontamentoController = new ApontamentoController();

/**
 * Rotas de apontamento do servidor recebendo as funções criadas no controlador, o middleware de autenticação e a verificação de função Admin para liberar acesso.
 * @notes deve ser passado as funções nesta ordem para que funcione a rota.
 * @param req - Utilizada de Requisition para se comunicar com o express e utilizar as funções
 * @param res - Utilizada de Response para se comunicar com o express e utilizar as funções
 */
router.get('/apontamentos', autenticadorMiddleware, (req, res) => apontamentoController.pegarTodosApontamentos(req, res));
router.get('/apontamentos/:id', autenticadorMiddleware, (req, res) => apontamentoController.pegarApontamentoPorId(req, res));
router.post('/apontamentos', autenticadorMiddleware, (req, res) => apontamentoController.criarApontamento(req, res));

//Rotas de administração
router.put('/apontamentos/:id', autenticadorMiddleware, apenasAdmin, (req, res) => apontamentoController.atualizarApontamento(req, res));
router.delete('/apontamentos/:id', autenticadorMiddleware, apenasAdmin, (req, res) => apontamentoController.deletarApontamento(req, res));
export default router;