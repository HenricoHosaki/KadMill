import express from 'express';
const router = express.Router();

//Rotas de administração de relatórios
router.get('/relatorios');
router.get('/relatorios/:id');
router.post('/relatorios');
router.put('/relatorios/:id');
router.delete('/relatorios/:id');

export default router;