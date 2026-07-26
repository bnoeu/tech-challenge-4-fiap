import { Router } from 'express';
import * as controller from './auth.controller';
import { requireAuth } from '../../middlewares/auth.middleware';

const router = Router();

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Autentica um professor e retorna um token JWT
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 */
router.post('/login', controller.login);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Retorna os dados do professor autenticado
 */
router.get('/me', requireAuth, controller.me);

export default router;
