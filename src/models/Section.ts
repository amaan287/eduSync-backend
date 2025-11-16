import mongoose, { Schema, Model } from 'mongoose';
import { ISection } from '@/types';

const sectionSchema = new Schema<ISection>(
  {
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
    order: {
      type: Number,
      required: true,
      min: 0,
    },
    lessons: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Lesson',
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Indexes
sectionSchema.index({ courseId: 1, order: 1 });

export const Section: Model<ISection> = mongoose.model<ISection>('Section', sectionSchema);

