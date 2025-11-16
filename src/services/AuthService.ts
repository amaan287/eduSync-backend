import bcrypt from 'bcryptjs';
import { UserRepository } from '@/repositories/UserRepository';
import { JWTConfig } from '@/config/jwt';
import { AppError, IUser } from '@/types';
import { sanitizeUser } from '@/utils/helpers';

export class AuthService {
  private userRepository: UserRepository;
  private jwtConfig: JWTConfig;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
    this.jwtConfig = JWTConfig.getInstance();
  }

  async register(data: {
    email: string;
    password: string;
    name: string;
    role: 'student' | 'instructor';
  }): Promise<{ user: any; token: string }> {
    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new AppError(409, 'User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Create user
    const user = await this.userRepository.create({
      email: data.email,
      password: hashedPassword,
      role: data.role,
      profile: {
        name: data.name,
      },
    } as any);

    // Generate token
    const token = this.generateToken(user);

    return {
      user: sanitizeUser(user),
      token,
    };
  }

  async login(email: string, password: string): Promise<{ user: any; token: string }> {
    // Find user
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new AppError(401, 'Invalid email or password');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new AppError(401, 'Invalid email or password');
    }

    // Generate token
    const token = this.generateToken(user);

    return {
      user: sanitizeUser(user),
      token,
    };
  }

  async getMe(userId: string): Promise<any> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new AppError(404, 'User not found');
    }
    return sanitizeUser(user);
  }

  private generateToken(user: IUser): string {
    return this.jwtConfig.sign({
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    });
  }
}

