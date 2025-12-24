import express from 'express';
const router = express.Router();
import { AuthController } from '../controllers/authLogin';
const authController = new AuthController();

router.get('/login', authController.login)