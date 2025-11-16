import { BaseRepository } from './BaseRepository';
import { Progress } from '@/models/Progress';
import { IProgress } from '@/types';
import { Types } from 'mongoose';

export class ProgressRepository extends BaseRepository<IProgress> {
  constructor() {
    super(Progress);
  }

  async findByUserAndCourse(
    userId: string | Types.ObjectId,
    courseId: string | Types.ObjectId
  ): Promise<IProgress[]> {
    return await this.findMany({ userId, courseId });
  }

  async findByUserAndLesson(
    userId: string | Types.ObjectId,
    lessonId: string | Types.ObjectId
  ): Promise<IProgress | null> {
    return await this.findOne({ userId, lessonId });
  }

  async upsertProgress(
    userId: string | Types.ObjectId,
    lessonId: string | Types.ObjectId,
    courseId: string | Types.ObjectId,
    data: { watchTime: number; completed: boolean }
  ): Promise<IProgress> {
    const progress = await this.model.findOneAndUpdate(
      { userId, lessonId },
      {
        ...data,
        courseId,
        lastWatched: new Date(),
      },
      { upsert: true, new: true }
    );
    return progress;
  }

  async getCourseProgress(
    userId: string | Types.ObjectId,
    courseId: string | Types.ObjectId
  ): Promise<{ completed: number; total: number; percentage: number }> {
    const progressRecords = await this.findByUserAndCourse(userId, courseId);
    const completed = progressRecords.filter((p) => p.completed).length;
    const total = progressRecords.length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { completed, total, percentage };
  }
}

