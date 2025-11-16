import { Context } from 'hono';
import { ProgressService } from '@/services/ProgressService';
import { ProgressRepository } from '@/repositories/ProgressRepository';
import { LessonRepository } from '@/repositories/LessonRepository';
import { EnrollmentRepository } from '@/repositories/EnrollmentRepository';
import { asyncHandler } from '@/utils/helpers';

export class ProgressController {
  private progressService: ProgressService;

  constructor() {
    const progressRepository = new ProgressRepository();
    const lessonRepository = new LessonRepository();
    const enrollmentRepository = new EnrollmentRepository();
    this.progressService = new ProgressService(
      progressRepository,
      lessonRepository,
      enrollmentRepository
    );
  }

  updateProgress = asyncHandler(async (c: Context) => {
    const user = c.get('user');
    const data = c.get('validatedData');

    const progress = await this.progressService.updateProgress(
      user.id,
      data.lessonId,
      {
        watchTime: data.watchTime,
        completed: data.completed,
      }
    );

    return c.json({
      success: true,
      message: 'Progress updated successfully',
      data: progress,
    });
  });

  getCourseProgress = asyncHandler(async (c: Context) => {
    const user = c.get('user');
    const { courseId } = c.req.param();

    const progress = await this.progressService.getCourseProgress(user.id, courseId);

    return c.json({
      success: true,
      data: progress,
    });
  });

  getLessonProgress = asyncHandler(async (c: Context) => {
    const user = c.get('user');
    const { lessonId } = c.req.param();

    const progress = await this.progressService.getLessonProgress(user.id, lessonId);

    return c.json({
      success: true,
      data: progress,
    });
  });
}

