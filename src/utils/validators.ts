import { z } from 'zod';

// Auth Schemas
export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  role: z.enum(['student', 'instructor']).default('student'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

// Course Schemas
export const createCourseSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
});

export const updateCourseSchema = z.object({
  title: z.string().min(3).optional(),
  description: z.string().min(10).optional(),
  published: z.boolean().optional(),
});

export const createSectionSchema = z.object({
  title: z.string().min(3, 'Section title must be at least 3 characters'),
  order: z.number().int().min(0),
});

export const createLessonSchema = z.object({
  sectionId: z.string().min(1, 'Section ID is required'),
  title: z.string().min(3, 'Lesson title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  duration: z.number().int().min(1, 'Duration must be positive'),
  order: z.number().int().min(0),
});

export const createResourceSchema = z.object({
  title: z.string().min(3, 'Resource title must be at least 3 characters'),
  fileType: z.string().min(1, 'File type is required'),
  size: z.number().int().min(1),
});

export const updateProgressSchema = z.object({
  lessonId: z.string().min(1, 'Lesson ID is required'),
  watchTime: z.number().min(0),
  completed: z.boolean(),
});

