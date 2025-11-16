import { Context } from 'hono';
import { AppError } from '@/types';

export const errorHandler = (error: Error, c: Context) => {
  console.error('Error:', error);

  if (error instanceof AppError) {
    return c.json(
      {
        success: false,
        message: error.message,
      },
      error.statusCode
    );
  }

  // Handle Mongoose validation errors
  if (error.name === 'ValidationError') {
    return c.json(
      {
        success: false,
        message: 'Validation error',
        errors: error,
      },
      400
    );
  }

  // Handle Mongoose cast errors
  if (error.name === 'CastError') {
    return c.json(
      {
        success: false,
        message: 'Invalid ID format',
      },
      400
    );
  }

  return c.json(
    {
      success: false,
      message: 'Internal server error',
    },
    500
  );
};

