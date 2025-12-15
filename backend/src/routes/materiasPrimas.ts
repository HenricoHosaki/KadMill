import express from 'express';
const router = express.Router();
import { MateriaPrimaController } from '../controllers/materiasPrimas';
const materiaPrimaController = new MateriaPrimaController();

router.get('/materiasPrimas', materiaPrimaController.pegarTodosMateriaPrimas);
router.get('/materiasPrimas/:id', materiaPrimaController.pegarMateriaPrimaPorId);
router.post('/materiasPrimas', materiaPrimaController.criarMateriaPrima);

//Rotas de administração
router.put('/materiasPrimas/:id', materiaPrimaController.atualizarMateriaPrima);
router.delete('/materiasPrimas/:id', materiaPrimaController.deletarMateriaPrima);

export default router;