import { Router } from 'express';
import * as controller from './student.controller';
import { requireAuth } from '../../middlewares/auth.middleware';

const router = Router();

/**
 * @swagger
 * /students:
 *   get:
 *     summary: Lista alunos (paginado)
 *     parameters:
 *       - in: query
 *         name: page
 *       - in: query
 *         name: limit
 */
router.get('/', requireAuth, controller.getAllStudents);

/**
 * @swagger
 * /students/{id}:
 *   get:
 *     summary: Busca aluno por ID
 */
router.get('/:id', requireAuth, controller.getStudentById);

/**
 * @swagger
 * /students:
 *   post:
 *     summary: Cria um novo aluno
 */
router.post('/', requireAuth, controller.createStudent);

/**
 * @swagger
 * /students/{id}:
 *   put:
 *     summary: Atualiza um aluno
 */
router.put('/:id', requireAuth, controller.updateStudent);

/**
 * @swagger
 * /students/{id}:
 *   delete:
 *     summary: Remove um aluno
 */
router.delete('/:id', requireAuth, controller.deleteStudent);

export default router;
