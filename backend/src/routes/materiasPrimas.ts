import express from 'express';
const router = express.Router();
import { MateriaPrimaController } from '../controllers/materiasPrimas';
import { autenticadorMiddleware, apenasAdmin } from '../middlewares/authMiddeware';
const materiaPrimaController = new MateriaPrimaController();

/**
 * Rotas de materiaPrima do servidor recebendo as funções criadas no controlador, o middleware de autenticação e a verificação de função Admin para liberar acesso.
 * @notes deve ser passado as funções nesta ordem para que funcione a rota.
 * @param req - Utilizada de Requisition para se comunicar com o express e utilizar as funções
 * @param res - Utilizada de Response para se comunicar com o express e utilizar as funções
 */
router.get('/materiasPrimas', autenticadorMiddleware, (req, res) => materiaPrimaController.pegarTodosMateriaPrimas(req, res));
router.get('/materiasPrimas/:id', autenticadorMiddleware, (req, res) => materiaPrimaController.pegarMateriaPrimaPorId(req, res));
router.post('/materiasPrimas', autenticadorMiddleware, (req, res) => materiaPrimaController.criarMateriaPrima(req, res));

//Rotas de administração
router.put('/materiasPrimas/:id', autenticadorMiddleware, apenasAdmin, (req, res) => materiaPrimaController.atualizarMateriaPrima(req, res));
router.delete('/materiasPrimas/:id', autenticadorMiddleware, apenasAdmin, (req, res) => materiaPrimaController.deletarMateriaPrima(req, res));

export default router;