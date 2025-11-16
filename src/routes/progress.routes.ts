import { Hono } from 'hono';
import { ProgressController } from '@/controllers/ProgressController';
import { authMiddleware, requireRole } from '@/middlewares/auth';
import { validateBody } from '@/middlewares/validator';
import { updateProgressSchema } from '@/utils/validators';

const progressRoutes = new Hono();
const progressController = new ProgressController();

progressRoutes.use('*', authMiddleware, requireRole('student'));

progressRoutes.post('/', validateBody(updateProgressSchema), progressController.updateProgress);
progressRoutes.get('/course/:courseId', progressController.getCourseProgress);
progressRoutes.get('/lesson/:lessonId', progressController.getLessonProgress);

export default progressRoutes;

