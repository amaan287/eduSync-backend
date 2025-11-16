import { Context } from 'hono';
import { Types } from 'mongoose';

export interface IUser {
  _id: Types.ObjectId;
  email: string;
  password: string;
  role: 'student' | 'instructor';
  profile: {
    name: string;
    avatar?: string;
    bio?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface ICourse {
  _id: Types.ObjectId;
  title: string;
  description: string;
  thumbnail: string;
  thumbnailPublicId?: string;
  instructorId: Types.ObjectId;
  published: boolean;
  sections: Types.ObjectId[];
  resources: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ISection {
  _id: Types.ObjectId;
  courseId: Types.ObjectId;
  title: string;
  order: number;
  lessons: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ILesson {
  _id: Types.ObjectId;
  sectionId: Types.ObjectId;
  courseId: Types.ObjectId;
  title: string;
  description: string;
  videoUrl: string;
  videoPublicId: string;
  duration: number;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IResource {
  _id: Types.ObjectId;
  courseId: Types.ObjectId;
  title: string;
  fileUrl: string;
  filePublicId: string;
  fileType: string;
  size: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IProgress {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  courseId: Types.ObjectId;
  lessonId: Types.ObjectId;
  completed: boolean;
  watchTime: number;
  lastWatched: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IEnrollment {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  courseId: Types.ObjectId;
  enrolledAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthContext extends Context {
  user?: {
    id: string;
    email: string;
    role: 'student' | 'instructor';
  };
}

export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public isOperational = true
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

