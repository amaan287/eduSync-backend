import { AppError } from '@/types';

export const asyncHandler = (fn: Function) => {
  return async (c: any) => {
    try {
      return await fn(c);
    } catch (error: any) {
      if (error instanceof AppError) {
        return c.json(
          { 
            success: false, 
            message: error.message 
          }, 
          error.statusCode
        );
      }
      
      console.error('Unhandled error:', error);
      return c.json(
        { 
          success: false, 
          message: 'Internal server error' 
        }, 
        500
      );
    }
  };
};

export const isValidObjectId = (id: string): boolean => {
  return /^[a-f\d]{24}$/i.test(id);
};

export const sanitizeUser = (user: any) => {
  const { password, ...sanitized } = user.toObject ? user.toObject() : user;
  return sanitized;
};

