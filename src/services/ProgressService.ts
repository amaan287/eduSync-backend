import { ProgressRepository } from '@/repositories/ProgressRepository';
import { LessonRepository } from '@/repositories/LessonRepository';
import { EnrollmentRepository } from '@/repositories/EnrollmentRepository';
import { AppError } from '@/types';

export class ProgressService {
  constructor(
    private progressRepository: ProgressRepository,
    private lessonRepository: LessonRepository,
    private enrollmentRepository: EnrollmentRepository
  ) {}

  async updateProgress(
    userId: string,
    lessonId: string,
    data: { watchTime: number; completed: boolean }
  ): Promise<any> {
    const lesson = await this.lessonRepository.findById(lessonId);
    if (!lesson) {
      throw new AppError(404, 'Lesson not found');
    }

    const isEnrolled = await this.enrollmentRepository.isEnrolled(userId, lesson.courseId.toString());
    if (!isEnrolled) {
      throw new AppError(403, 'You must be enrolled in the course to track progress');
    }

    const progress = await this.progressRepository.upsertProgress(
      userId,
      lessonId,
      lesson.courseId.toString(),
      data
    );

    return progress;
  }

  async getCourseProgress(userId: string, courseId: string): Promise<any> {
    const isEnrolled = await this.enrollmentRepository.isEnrolled(userId, courseId);
    if (!isEnrolled) {
      throw new AppError(403, 'You must be enrolled in the course to view progress');
    }

    return await this.progressRepository.getCourseProgress(userId, courseId);
  }

  async getLessonProgress(userId: string, lessonId: string): Promise<any> {
    const lesson = await this.lessonRepository.findById(lessonId);
    if (!lesson) {
      throw new AppError(404, 'Lesson not found');
    }

    const progress = await this.progressRepository.findByUserAndLesson(userId, lessonId);
    return progress;
  }
}

