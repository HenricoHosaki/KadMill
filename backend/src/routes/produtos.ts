import express from 'express';
const router = express.Router();

router.get('/produtos');
router.get('/produtos/:id');
router.post('/produtos');

//Rotas de administração
router.put('/produtos/:id');
router.delete('/produtos/:id');

export default router;