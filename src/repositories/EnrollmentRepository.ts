import { BaseRepository } from './BaseRepository';
import { Enrollment } from '@/models/Enrollment';
import { IEnrollment } from '@/types';
import { Types } from 'mongoose';

export class EnrollmentRepository extends BaseRepository<IEnrollment> {
  constructor() {
    super(Enrollment);
  }

  async findByUser(userId: string | Types.ObjectId): Promise<IEnrollment[]> {
    return await this.model
      .find({ userId })
      .populate({
        path: 'courseId',
        populate: {
          path: 'instructorId',
          select: 'profile.name profile.avatar',
        },
      })
      .sort({ enrolledAt: -1 });
  }

  async findByCourse(courseId: string | Types.ObjectId): Promise<IEnrollment[]> {
    return await this.findMany({ courseId });
  }

  async isEnrolled(
    userId: string | Types.ObjectId,
    courseId: string | Types.ObjectId
  ): Promise<boolean> {
    return await this.exists({ userId, courseId });
  }

  async enroll(
    userId: string | Types.ObjectId,
    courseId: string | Types.ObjectId
  ): Promise<IEnrollment> {
    return await this.create({
      userId,
      courseId,
      enrolledAt: new Date(),
    } as any);
  }
}

