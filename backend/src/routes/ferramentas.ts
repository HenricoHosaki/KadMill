import express from 'express';
import { FerramentaController } from '../controllers/ferramentas';
import { autenticadorMiddleware, apenasAdmin } from '../middlewares/authMiddeware';

const router = express.Router();
const controller = new FerramentaController();

router.get('/ferramentas', autenticadorMiddleware, (req, res) => controller.pegarTodas(req, res));
router.post('/ferramentas', autenticadorMiddleware, (req, res) => controller.criar(req, res));
router.put('/ferramentas/:id', autenticadorMiddleware, apenasAdmin, (req, res) => controller.atualizar(req, res));
router.delete('/ferramentas/:id', autenticadorMiddleware, apenasAdmin, (req, res) => controller.deletar(req, res));

export default router;