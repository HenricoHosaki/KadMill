import express from 'express';
const router = express.Router();

router.get('/apontamentos');
router.get('/apontamentos:id');
router.post('/apontamentos');

//Rotas de administração
router.put('/apontamentos:id');
router.delete('/apontamentos:id');

export default router;