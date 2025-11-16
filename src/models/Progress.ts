import mongoose, { Schema, Model } from 'mongoose';
import { IProgress } from '@/types';

const progressSchema = new Schema<IProgress>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    lessonId: {
      type: Schema.Types.ObjectId,
      ref: 'Lesson',
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    watchTime: {
      type: Number,
      default: 0,
      min: 0,
    },
    lastWatched: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes - compound index for unique progress per user/lesson
progressSchema.index({ userId: 1, lessonId: 1 }, { unique: true });
progressSchema.index({ userId: 1, courseId: 1 });

export const Progress: Model<IProgress> = mongoose.model<IProgress>('Progress', progressSchema);

