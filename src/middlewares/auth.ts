import { Context, Next } from 'hono';
import { JWTConfig } from '@/config/jwt';
import { AppError } from '@/types';

const jwtConfig = JWTConfig.getInstance();

export const authMiddleware = async (c: Context, next: Next) => {
  try {
    const authHeader = c.req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError(401, 'Authentication required');
    }

    const token = authHeader.substring(7);
    const decoded = jwtConfig.verify(token);

    c.set('user', {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    });

    await next();
  } catch (error: any) {
    if (error instanceof AppError) {
      return c.json({ success: false, message: error.message }, error.statusCode);
    }
    return c.json({ success: false, message: 'Invalid or expired token' }, 401);
  }
};

export const requireRole = (...roles: string[]) => {
  return async (c: Context, next: Next) => {
    const user = c.get('user');

    if (!user) {
      return c.json({ success: false, message: 'Authentication required' }, 401);
    }

    if (!roles.includes(user.role)) {
      return c.json(
        { success: false, message: 'Insufficient permissions' },
        403
      );
    }

    await next();
  };
};

