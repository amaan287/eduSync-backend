import { BaseRepository } from './BaseRepository';
import { Course } from '@/models/Course';
import { ICourse } from '@/types';
import { Types } from 'mongoose';

export class CourseRepository extends BaseRepository<ICourse> {
  constructor() {
    super(Course);
  }

  async findByInstructor(instructorId: string | Types.ObjectId): Promise<ICourse[]> {
    return await this.findMany({ instructorId });
  }

  async findPublished(): Promise<ICourse[]> {
    return await this.model
      .find({ published: true })
      .populate('instructorId', 'profile.name profile.avatar')
      .sort({ createdAt: -1 });
  }

  async searchCourses(query: string): Promise<ICourse[]> {
    return await this.model
      .find({
        published: true,
        $text: { $search: query },
      })
      .populate('instructorId', 'profile.name profile.avatar');
  }

  async findWithDetails(id: string | Types.ObjectId): Promise<ICourse | null> {
    return await this.model
      .findById(id)
      .populate('instructorId', 'profile.name profile.avatar profile.bio')
      .populate({
        path: 'sections',
        populate: {
          path: 'lessons',
          options: { sort: { order: 1 } },
        },
        options: { sort: { order: 1 } },
      })
      .populate('resources');
  }
}

