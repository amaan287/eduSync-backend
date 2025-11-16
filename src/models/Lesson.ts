import mongoose, { Schema, Model } from 'mongoose';
import { ILesson } from '@/types';

const lessonSchema = new Schema<ILesson>(
  {
    sectionId: {
      type: Schema.Types.ObjectId,
      ref: 'Section',
      required: true,
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    videoUrl: {
      type: String,
      required: true,
    },
    videoPublicId: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
      min: 0,
    },
    order: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
lessonSchema.index({ sectionId: 1, order: 1 });
lessonSchema.index({ courseId: 1 });

export const Lesson: Model<ILesson> = mongoose.model<ILesson>('Lesson', lessonSchema);

