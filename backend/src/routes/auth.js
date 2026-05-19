import { Router } from 'express';
import { z } from 'zod';
import { validate } from '../middlewares/validate.js';
import * as authController from '../controllers/authController.js';

const registerSchema = z.object({
  name: z.string().min(2, 'Nome muito curto').max(80),
  email: z.string().email('E-mail invalido'),
  password: z.string().min(8, 'Senha precisa de no minimo 8 caracteres'),
});

const loginSchema = z.object({
  email: z.string().email('E-mail invalido'),
  password: z.string().min(1, 'Senha obrigatoria'),
});

export const authRoutes = Router();

authRoutes.post('/register', validate(registerSchema), authController.register);
authRoutes.post('/login', validate(loginSchema), authController.login);
