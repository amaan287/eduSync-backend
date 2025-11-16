import { Context, Next } from 'hono';
import { ZodSchema } from 'zod';
import { AppError } from '@/types';

export const validateBody = (schema: ZodSchema) => {
  return async (c: Context, next: Next) => {
    try {
      const body = await c.req.json();
      const validated = schema.parse(body);
      c.set('validatedData', validated);
      await next();
    } catch (error: any) {
      if (error.errors) {
        const messages = error.errors.map((e: any) => e.message).join(', ');
        return c.json(
          {
            success: false,
            message: 'Validation failed',
            errors: error.errors,
          },
          400
        );
      }
      throw new AppError(400, 'Invalid request body');
    }
  };
};

export const validateParams = (schema: ZodSchema) => {
  return async (c: Context, next: Next) => {
    try {
      const params = c.req.param();
      const validated = schema.parse(params);
      c.set('validatedParams', validated);
      await next();
    } catch (error: any) {
      if (error.errors) {
        const messages = error.errors.map((e: any) => e.message).join(', ');
        return c.json(
          {
            success: false,
            message: 'Validation failed',
            errors: error.errors,
          },
          400
        );
      }
      throw new AppError(400, 'Invalid parameters');
    }
  };
};

