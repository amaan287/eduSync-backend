import { Hono } from 'hono';
import { StudentController } from '@/controllers/StudentController';
import { authMiddleware, requireRole } from '@/middlewares/auth';

const studentRoutes = new Hono();
const studentController = new StudentController();

studentRoutes.use('*', authMiddleware, requireRole('student'));

studentRoutes.get('/:id/download-manifest', studentController.getDownloadManifest);

export default studentRoutes;

