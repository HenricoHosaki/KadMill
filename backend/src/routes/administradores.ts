import express from 'express';
const router = express.Router();
import { AdministradorController } from '../controllers/administradores';
import { apenasAdmin, autenticadorMiddleware } from '../middlewares/authMiddeware';
const administradorController = new AdministradorController();

/**
 * Rotas de administração do servidor recebendo as funções criadas no controlador, o middleware de autenticação e a verificação de função Admin para liberar acesso.
 * @notes deve ser passado as funções nesta ordem para que funcione a rota.
 * @param req - Utilizada de Requisition para se comunicar com o express e utilizar as funções
 * @param res - Utilizada de Response para se comunicar com o express e utilizar as funções
 */
router.get('/administradores/backup', autenticadorMiddleware, apenasAdmin, (req, res) => administradorController.fazerBackup(req, res));
router.get('/administradores', autenticadorMiddleware, apenasAdmin,(req, res) => administradorController.pegarTodosUsuarios(req, res));
router.get('/administradores/:id', autenticadorMiddleware, apenasAdmin, (req, res) => administradorController.pegarUsuarioPorId(req, res));
router.post('/administradores', autenticadorMiddleware, apenasAdmin, (req, res) => administradorController. criarUsuario(req, res));
router.put('/administradores/:id', autenticadorMiddleware, apenasAdmin, (req, res) => administradorController.atualizarUsuario(req, res));
router.delete('/administradores/:id', autenticadorMiddleware, apenasAdmin, (req, res) => administradorController.deletarUsuario(req, res));

export default router;