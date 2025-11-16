import mongoose, { Schema, Model } from 'mongoose';
import { IUser } from '@/types';

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['student', 'instructor'],
      default: 'student',
    },
    profile: {
      name: {
        type: String,
        required: true,
      },
      avatar: {
        type: String,
      },
      bio: {
        type: String,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries (email index is automatic due to unique: true)
userSchema.index({ role: 1 });

export const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);

