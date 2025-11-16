import { EnrollmentRepository } from '@/repositories/EnrollmentRepository';
import { CourseRepository } from '@/repositories/CourseRepository';
import { AppError } from '@/types';

export class EnrollmentService {
  constructor(
    private enrollmentRepository: EnrollmentRepository,
    private courseRepository: CourseRepository
  ) {}

  async enrollInCourse(userId: string, courseId: string): Promise<any> {
    const course = await this.courseRepository.findById(courseId);
    if (!course) {
      throw new AppError(404, 'Course not found');
    }

    if (!course.published) {
      throw new AppError(400, 'Cannot enroll in unpublished course');
    }

    const isAlreadyEnrolled = await this.enrollmentRepository.isEnrolled(userId, courseId);
    if (isAlreadyEnrolled) {
      throw new AppError(409, 'Already enrolled in this course');
    }

    const enrollment = await this.enrollmentRepository.enroll(userId, courseId);
    return enrollment;
  }

  async getEnrolledCourses(userId: string): Promise<any[]> {
    return await this.enrollmentRepository.findByUser(userId);
  }

  async unenroll(userId: string, courseId: string): Promise<void> {
    const enrollment = await this.enrollmentRepository.findOne({ userId, courseId });
    if (!enrollment) {
      throw new AppError(404, 'Enrollment not found');
    }

    await this.enrollmentRepository.deleteById(enrollment._id);
  }
}

