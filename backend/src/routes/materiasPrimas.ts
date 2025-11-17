import express from 'express';
const router = express.Router();

router.get('/materiasPrimas');
router.get('/materiasPrimas/:id');
router.post('/materiasPrimas');

//Rotas de administração
router.put('/materiasPrimas/:id');
router.delete('/materiasPrimas/:id');

export default router;