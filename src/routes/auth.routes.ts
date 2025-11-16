import { Hono } from 'hono';
import { AuthController } from '@/controllers/AuthController';
import { validateBody } from '@/middlewares/validator';
import { authMiddleware } from '@/middlewares/auth';
import { registerSchema, loginSchema } from '@/utils/validators';

const authRoutes = new Hono();
const authController = new AuthController();

authRoutes.post('/register', validateBody(registerSchema), authController.register);
authRoutes.post('/login', validateBody(loginSchema), authController.login);
authRoutes.get('/me', authMiddleware, authController.getMe);

export default authRoutes;

