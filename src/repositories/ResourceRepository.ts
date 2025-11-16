import { BaseRepository } from './BaseRepository';
import { Resource } from '@/models/Resource';
import { IResource } from '@/types';
import { Types } from 'mongoose';

export class ResourceRepository extends BaseRepository<IResource> {
  constructor() {
    super(Resource);
  }

  async findByCourse(courseId: string | Types.ObjectId): Promise<IResource[]> {
    return await this.findMany({ courseId });
  }
}

