import express from 'express';
import { FerramentaController } from '../controllers/ferramentas';
import { autenticadorMiddleware, apenasAdmin } from '../middlewares/authMiddeware';

const router = express.Router();
const controller = new FerramentaController();

/**
 * Rotas de ferramentas do servidor recebendo as funções criadas no controlador, o middleware de autenticação e a verificação de função Admin para liberar acesso.
 * @notes deve ser passado as funções nesta ordem para que funcione a rota.
 * @param req - Utilizada de Requisition para se comunicar com o express e utilizar as funções
 * @param res - Utilizada de Response para se comunicar com o express e utilizar as funções
 */
router.get('/ferramentas', autenticadorMiddleware, (req, res) => controller.pegarTodas(req, res));
router.post('/ferramentas', autenticadorMiddleware, (req, res) => controller.criar(req, res));
router.put('/ferramentas/:id', autenticadorMiddleware, apenasAdmin, (req, res) => controller.atualizar(req, res));
router.delete('/ferramentas/:id', autenticadorMiddleware, apenasAdmin, (req, res) => controller.deletar(req, res));

export default router;