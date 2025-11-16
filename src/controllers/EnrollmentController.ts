import { Context } from 'hono';
import { EnrollmentService } from '@/services/EnrollmentService';
import { EnrollmentRepository } from '@/repositories/EnrollmentRepository';
import { CourseRepository } from '@/repositories/CourseRepository';
import { asyncHandler } from '@/utils/helpers';

export class EnrollmentController {
  private enrollmentService: EnrollmentService;

  constructor() {
    const enrollmentRepository = new EnrollmentRepository();
    const courseRepository = new CourseRepository();
    this.enrollmentService = new EnrollmentService(enrollmentRepository, courseRepository);
  }

  enroll = asyncHandler(async (c: Context) => {
    const user = c.get('user');
    const { id } = c.req.param();

    const enrollment = await this.enrollmentService.enrollInCourse(user.id, id);

    return c.json({
      success: true,
      message: 'Enrolled in course successfully',
      data: enrollment,
    }, 201);
  });

  getEnrolledCourses = asyncHandler(async (c: Context) => {
    const user = c.get('user');
    const courses = await this.enrollmentService.getEnrolledCourses(user.id);

    return c.json({
      success: true,
      data: courses,
    });
  });

  unenroll = asyncHandler(async (c: Context) => {
    const user = c.get('user');
    const { id } = c.req.param();

    await this.enrollmentService.unenroll(user.id, id);

    return c.json({
      success: true,
      message: 'Unenrolled from course successfully',
    });
  });
}

