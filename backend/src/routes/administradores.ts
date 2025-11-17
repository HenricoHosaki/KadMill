import express from 'express';
const router = express.Router();

router.get('/admministradores');
router.get('/admministradores/:id');
router.post('/admministradores');

//Rotas de administração
router.put('/admministradores/:id');
router.delete('/admministradores/:id');

export default router;