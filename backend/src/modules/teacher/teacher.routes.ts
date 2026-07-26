import { Router } from 'express';
import * as controller from './teacher.controller';
import { requireAuth } from '../../middlewares/auth.middleware';

const router = Router();

/**
 * @swagger
 * /teachers:
 *   get:
 *     summary: Lista professores (paginado)
 *     parameters:
 *       - in: query
 *         name: page
 *       - in: query
 *         name: limit
 */
router.get('/', requireAuth, controller.getAllTeachers);

/**
 * @swagger
 * /teachers/{id}:
 *   get:
 *     summary: Busca professor por ID
 */
router.get('/:id', requireAuth, controller.getTeacherById);

/**
 * @swagger
 * /teachers:
 *   post:
 *     summary: Cria um novo professor
 */
router.post('/', requireAuth, controller.createTeacher);

/**
 * @swagger
 * /teachers/{id}:
 *   put:
 *     summary: Atualiza um professor
 */
router.put('/:id', requireAuth, controller.updateTeacher);

/**
 * @swagger
 * /teachers/{id}:
 *   delete:
 *     summary: Remove um professor
 */
router.delete('/:id', requireAuth, controller.deleteTeacher);

export default router;
