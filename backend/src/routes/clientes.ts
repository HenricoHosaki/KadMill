import express from 'express';
const router = express.Router();

router.get('/clientes');
router.get('/clientes/:id');
router.post('/clientes');

//Rotas de administração
router.put('/clientes/:id');
router.delete('/clientes/:id');

export default router;