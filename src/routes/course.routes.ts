import { Hono } from 'hono';
import { CourseController } from '@/controllers/CourseController';
import { authMiddleware, requireRole } from '@/middlewares/auth';
import { validateBody } from '@/middlewares/validator';
import { createCourseSchema, updateCourseSchema, createSectionSchema } from '@/utils/validators';

const courseRoutes = new Hono();
const courseController = new CourseController();

// Public routes
courseRoutes.get('/', courseController.getPublishedCourses);
courseRoutes.get('/:id', courseController.getCourse);

// Instructor routes
courseRoutes.post(
  '/',
  authMiddleware,
  requireRole('instructor'),
  courseController.createCourse
);

courseRoutes.put(
  '/:id',
  authMiddleware,
  requireRole('instructor'),
  courseController.updateCourse
);

courseRoutes.delete(
  '/:id',
  authMiddleware,
  requireRole('instructor'),
  courseController.deleteCourse
);

courseRoutes.get(
  '/instructor/my-courses',
  authMiddleware,
  requireRole('instructor'),
  courseController.getInstructorCourses
);

courseRoutes.put(
  '/:id/publish',
  authMiddleware,
  requireRole('instructor'),
  courseController.publishCourse
);

courseRoutes.post(
  '/:id/sections',
  authMiddleware,
  requireRole('instructor'),
  validateBody(createSectionSchema),
  courseController.addSection
);

courseRoutes.post(
  '/:id/lessons',
  authMiddleware,
  requireRole('instructor'),
  courseController.addLesson
);

courseRoutes.post(
  '/:id/resources',
  authMiddleware,
  requireRole('instructor'),
  courseController.addResource
);

export default courseRoutes;

