import express from 'express';
const router = express.Router();

router.get('/fornecedores');
router.get('/fornecedores/:id');
router.post('/fornecedores');

//Rotas de administração
router.put('/fornecedores/:id');
router.delete('/fornecedores/:id');

export default router;