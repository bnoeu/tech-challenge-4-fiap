import { Router } from 'express';
import postRoutes from '../modules/post/post.routes';
import teacherRoutes from '../modules/teacher/teacher.routes';
import studentRoutes from '../modules/student/student.routes';
import authRoutes from '../modules/auth/auth.routes';

const router = Router();

router.use('/posts', postRoutes);
router.use('/teachers', teacherRoutes);
router.use('/students', studentRoutes);
router.use('/auth', authRoutes);

export default router;