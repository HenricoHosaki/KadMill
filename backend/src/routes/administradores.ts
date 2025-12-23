import express from 'express';
const router = express.Router();
import { AdministradorController } from '../controllers/administradores';
import { autenticadorMiddleware, apenasAdmin } from '../middlewares/authMiddeware';
const administradorController = new AdministradorController();

router.get('/administradores', administradorController.pegarTodosUsuarios, autenticadorMiddleware, apenasAdmin);
router.get('/administradores/:id', administradorController.pegarUsuarioPorId, autenticadorMiddleware, apenasAdmin);
router.post('/administradores', administradorController.criarUsuario, autenticadorMiddleware, apenasAdmin);
router.put('/administradores/:id', administradorController.atualizarUsuario, autenticadorMiddleware, apenasAdmin);
router.delete('/administradores/:id', administradorController.deletarUsuario, autenticadorMiddleware, apenasAdmin);

export default router;