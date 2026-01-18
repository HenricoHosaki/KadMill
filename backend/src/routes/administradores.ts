import express from 'express';
const router = express.Router();
import { AdministradorController } from '../controllers/administradores';
import { apenasAdmin, autenticadorMiddleware } from '../middlewares/authMiddeware';
const administradorController = new AdministradorController();

router.get('/administradores', autenticadorMiddleware, apenasAdmin,(req, res) => administradorController.pegarTodosUsuarios(req, res));
router.get('/administradores/:id', autenticadorMiddleware, apenasAdmin, (req, res) => administradorController.pegarUsuarioPorId(req, res));
router.post('/administradores', autenticadorMiddleware, apenasAdmin, (req, res) => administradorController. criarUsuario(req, res));
router.put('/administradores/:id', autenticadorMiddleware, apenasAdmin, (req, res) => administradorController.atualizarUsuario(req, res));
router.delete('/administradores/:id', autenticadorMiddleware, apenasAdmin, (req, res) => administradorController.deletarUsuario(req, res));
router.get('/administradores/backup/:id', autenticadorMiddleware, apenasAdmin, (req, res) => administradorController.fazerBackup(req, res));

export default router;