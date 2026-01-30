import express from 'express';
const router = express.Router();
import { AuthController } from '../controllers/authLogin';
const authController = new AuthController();

/**
 * Rota de login para entrar no sistema.
 * @notes Esta rota deve ser pública para que todos os usuários vejam e possam logar no sistema com sua conta.
 * @param req - Utilizada de Requisition para se comunicar com o express e utilizar as funções
 * @param res - Utilizada de Response para se comunicar com o express e utilizar as funções
 */
router.post('/login', (req, res) => authController.login(req, res))

export default router;