import mongoose, { Schema, Model } from 'mongoose';
import { ICourse } from '@/types';

const courseSchema = new Schema<ICourse>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    thumbnailPublicId: {
      type: String,
    },
    instructorId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    published: {
      type: Boolean,
      default: false,
    },
    sections: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Section',
      },
    ],
    resources: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Resource',
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Indexes
courseSchema.index({ instructorId: 1 });
courseSchema.index({ published: 1 });
courseSchema.index({ title: 'text', description: 'text' });

export const Course: Model<ICourse> = mongoose.model<ICourse>('Course', courseSchema);

