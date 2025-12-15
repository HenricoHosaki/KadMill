import express from 'express';
const router = express.Router();
import { AdministradorController } from '../controllers/administradores';
const administradorController = new AdministradorController();

router.get('/admministradores', administradorController.pegarTodosUsuarios);
router.get('/admministradores/:id', administradorController.pegarUsuarioPorId);
router.post('/admministradores', administradorController.criarUsuario);

//Rotas de administração
router.put('/admministradores/:id', administradorController.atualizarUsuario);
router.delete('/admministradores/:id', administradorController.deletarUsuario);

export default router;