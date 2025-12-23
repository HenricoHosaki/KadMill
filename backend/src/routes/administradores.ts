import express from 'express';
const router = express.Router();
import { AdministradorController } from '../controllers/administradores';
import { autenticadorMiddleware, apenasAdmin } from '../middlewares/authMiddeware';
const administradorController = new AdministradorController();

router.get('/admministradores', administradorController.pegarTodosUsuarios, autenticadorMiddleware, apenasAdmin);
router.get('/admministradores/:id', administradorController.pegarUsuarioPorId, autenticadorMiddleware, apenasAdmin);
router.post('/admministradores', administradorController.criarUsuario, autenticadorMiddleware, apenasAdmin);
router.put('/admministradores/:id', administradorController.atualizarUsuario, autenticadorMiddleware, apenasAdmin);
router.delete('/admministradores/:id', administradorController.deletarUsuario, autenticadorMiddleware, apenasAdmin);

export default router;