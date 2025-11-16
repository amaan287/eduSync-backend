import { Context } from 'hono';
import { AuthService } from '@/services/AuthService';
import { UserRepository } from '@/repositories/UserRepository';
import { asyncHandler } from '@/utils/helpers';

export class AuthController {
  private authService: AuthService;

  constructor() {
    const userRepository = new UserRepository();
    this.authService = new AuthService(userRepository);
  }

  register = asyncHandler(async (c: Context) => {
    const data = c.get('validatedData');
    const result = await this.authService.register(data);
    
    return c.json({
      success: true,
      message: 'User registered successfully',
      data: result,
    }, 201);
  });

  login = asyncHandler(async (c: Context) => {
    const { email, password } = c.get('validatedData');
    const result = await this.authService.login(email, password);
    
    return c.json({
      success: true,
      message: 'Login successful',
      data: result,
    });
  });

  getMe = asyncHandler(async (c: Context) => {
    const user = c.get('user');
    const userData = await this.authService.getMe(user.id);
    
    return c.json({
      success: true,
      data: userData,
    });
  });
}

