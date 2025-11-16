import mongoose, { Schema, Model } from 'mongoose';
import { IResource } from '@/types';

const resourceSchema = new Schema<IResource>(
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
    fileUrl: {
      type: String,
      required: true,
    },
    filePublicId: {
      type: String,
      required: true,
    },
    fileType: {
      type: String,
      required: true,
    },
    size: {
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
resourceSchema.index({ courseId: 1 });

export const Resource: Model<IResource> = mongoose.model<IResource>('Resource', resourceSchema);

