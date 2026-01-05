import express from 'express';
const router = express.Router();
import { MateriaPrimaController } from '../controllers/materiasPrimas';
import { autenticadorMiddleware, apenasAdmin } from '../middlewares/authMiddeware';
const materiaPrimaController = new MateriaPrimaController();

router.get('/materiasPrimas', autenticadorMiddleware, (req, res) => materiaPrimaController.pegarTodosMateriaPrimas(req, res));
router.get('/materiasPrimas/:id', autenticadorMiddleware, (req, res) => materiaPrimaController.pegarMateriaPrimaPorId(req, res));
router.post('/materiasPrimas', autenticadorMiddleware, (req, res) => materiaPrimaController.criarMateriaPrima(req, res));

//Rotas de administração
router.put('/materiasPrimas/:id', autenticadorMiddleware, apenasAdmin, (req, res) => materiaPrimaController.atualizarMateriaPrima(req, res));
router.delete('/materiasPrimas/:id', autenticadorMiddleware, apenasAdmin, (req, res) => materiaPrimaController.deletarMateriaPrima(req, res));

export default router;