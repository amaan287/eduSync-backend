import { Hono } from 'hono';
import { EnrollmentController } from '@/controllers/EnrollmentController';
import { authMiddleware, requireRole } from '@/middlewares/auth';

const enrollmentRoutes = new Hono();
const enrollmentController = new EnrollmentController();

enrollmentRoutes.use('*', authMiddleware, requireRole('student'));

enrollmentRoutes.post('/:id/enroll', enrollmentController.enroll);
enrollmentRoutes.get('/my-courses', enrollmentController.getEnrolledCourses);
enrollmentRoutes.delete('/:id/unenroll', enrollmentController.unenroll);

export default enrollmentRoutes;

