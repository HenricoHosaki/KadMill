import express from 'express';
const router = express.Router();
import { MateriaPrimaController } from '../controllers/materiasPrimas';
import { autenticadorMiddleware, apenasAdmin } from '../middlewares/authMiddeware';
const materiaPrimaController = new MateriaPrimaController();

router.get('/materiasPrimas', materiaPrimaController.pegarTodosMateriaPrimas, autenticadorMiddleware);
router.get('/materiasPrimas/:id', materiaPrimaController.pegarMateriaPrimaPorId, autenticadorMiddleware);
router.post('/materiasPrimas', materiaPrimaController.criarMateriaPrima, autenticadorMiddleware);

//Rotas de administração
router.put('/materiasPrimas/:id', materiaPrimaController.atualizarMateriaPrima, autenticadorMiddleware, apenasAdmin);
router.delete('/materiasPrimas/:id', materiaPrimaController.deletarMateriaPrima, autenticadorMiddleware, apenasAdmin);

export default router;