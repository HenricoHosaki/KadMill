import express from 'express';
const router = express.Router();
import { AdministradorController } from '../controllers/administradores';
import { apenasAdmin, autenticadorMiddleware } from '../middlewares/authMiddeware';
const administradorController = new AdministradorController();

router.get('/administradores', autenticadorMiddleware, apenasAdmin, administradorController.pegarTodosUsuarios);
router.get('/administradores/:id', autenticadorMiddleware, apenasAdmin, administradorController.pegarUsuarioPorId);
router.post('/administradores', autenticadorMiddleware, apenasAdmin, administradorController. criarUsuario);
router.put('/administradores/:id', autenticadorMiddleware, apenasAdmin, administradorController.atualizarUsuario);
router.delete('/administradores/:id', autenticadorMiddleware, apenasAdmin, administradorController.deletarUsuario);

export default router;