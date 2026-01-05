import express from 'express';
const router = express.Router();
import { AuthController } from '../controllers/authLogin';
const authController = new AuthController();

router.post('/login', (req, res) => authController.login(req, res))

export default router;