import { Router } from 'express';
import * as controller from './post.controller';
import { requireAuth } from '../../middlewares/auth.middleware';

const router = Router();

/**
 * @swagger
 * /posts/search:
 *   get:
 *     summary: Busca posts por termo
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 */
router.get('/search', controller.searchPosts);

/**
 * @swagger
 * /posts:
 *   get:
 *     summary: Lista todos os posts
 *     responses:
 *       200:
 *         description: Lista de posts
 */
router.get('/', controller.getAllPosts);

/**
 * @swagger
 * /posts/{id}:
 *   get:
 *     summary: Busca post por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Post encontrado
 */
router.get('/:id', controller.getPostById);

/**
 * @swagger
 * /posts:
 *   post:
 *     summary: Cria um novo post
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               author:
 *                 type: string
 *     responses:
 *       201:
 *         description: Post criado
 */
router.post('/', requireAuth, controller.createPost);

/**
 * @swagger
 * /posts/{id}:
 *   put:
 *     summary: Atualiza um post
 */
router.put('/:id', requireAuth, controller.updatePost);

/**
 * @swagger
 * /posts/{id}:
 *   delete:
 *     summary: Remove um post
 */
router.delete('/:id', requireAuth, controller.deletePost);

export default router;