import express from 'express';
const router = express.Router();

router.get('/ordensServicos');
router.get('/ordensServicos/:id');
router.post('/ordensServicos');

//Rotas de administração
router.put('/ordensServicos/:id');
router.delete('/ordensServicos/:id');

export default router;