import { BaseRepository } from './BaseRepository';
import { Section } from '@/models/Section';
import { ISection } from '@/types';
import { Types } from 'mongoose';

export class SectionRepository extends BaseRepository<ISection> {
  constructor() {
    super(Section);
  }

  async findByCourse(courseId: string | Types.ObjectId): Promise<ISection[]> {
    return await this.model
      .find({ courseId })
      .populate('lessons')
      .sort({ order: 1 });
  }

  async getMaxOrder(courseId: string | Types.ObjectId): Promise<number> {
    const section = await this.model
      .findOne({ courseId })
      .sort({ order: -1 })
      .select('order');
    return section?.order ?? -1;
  }
}

