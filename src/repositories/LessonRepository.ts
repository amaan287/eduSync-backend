import { BaseRepository } from './BaseRepository';
import { Lesson } from '@/models/Lesson';
import { ILesson } from '@/types';
import { Types } from 'mongoose';

export class LessonRepository extends BaseRepository<ILesson> {
  constructor() {
    super(Lesson);
  }

  async findBySection(sectionId: string | Types.ObjectId): Promise<ILesson[]> {
    return await this.findMany({ sectionId });
  }

  async findByCourse(courseId: string | Types.ObjectId): Promise<ILesson[]> {
    return await this.findMany({ courseId });
  }

  async getMaxOrder(sectionId: string | Types.ObjectId): Promise<number> {
    const lesson = await this.model
      .findOne({ sectionId })
      .sort({ order: -1 })
      .select('order');
    return lesson?.order ?? -1;
  }
}

