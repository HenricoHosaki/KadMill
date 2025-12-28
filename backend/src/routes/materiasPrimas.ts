import express from 'express';
const router = express.Router();
import { MateriaPrimaController } from '../controllers/materiasPrimas';
import { autenticadorMiddleware, apenasAdmin } from '../middlewares/authMiddeware';
const materiaPrimaController = new MateriaPrimaController();

router.get('/materiasPrimas', autenticadorMiddleware, materiaPrimaController.pegarTodosMateriaPrimas);
router.get('/materiasPrimas/:id', autenticadorMiddleware, materiaPrimaController.pegarMateriaPrimaPorId);
router.post('/materiasPrimas', autenticadorMiddleware, materiaPrimaController.criarMateriaPrima);

//Rotas de administração
router.put('/materiasPrimas/:id', autenticadorMiddleware, apenasAdmin, materiaPrimaController.atualizarMateriaPrima);
router.delete('/materiasPrimas/:id', autenticadorMiddleware, apenasAdmin, materiaPrimaController.deletarMateriaPrima);

export default router;