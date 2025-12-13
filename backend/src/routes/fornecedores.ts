import express from 'express';
const router = express.Router();
import { FornecedorController } from '../controllers/fornecedores';
const fornecedorController = new FornecedorController();

router.get('/fornecedores', fornecedorController.pegarTodosFornecedores);
router.get('/fornecedores/:id', fornecedorController.pegarFornecedorPorId);
router.post('/fornecedores', fornecedorController.criarFornecedor);

//Rotas de administração
router.put('/fornecedores/:id', fornecedorController.atualizarFornecedor);
router.delete('/fornecedores/:id', fornecedorController.deletarFornecedor);

export default router;