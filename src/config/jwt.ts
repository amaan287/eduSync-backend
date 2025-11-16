import jwt, { SignOptions } from 'jsonwebtoken';

export class JWTConfig {
  private static instance: JWTConfig;
  private secret: string;
  private expiresIn: string;

  private constructor() {
    this.secret = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
    this.expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  }

  static getInstance(): JWTConfig {
    if (!JWTConfig.instance) {
      JWTConfig.instance = new JWTConfig();
    }
    return JWTConfig.instance;
  }

  sign(payload: object): string {
    return jwt.sign(payload, this.secret, { expiresIn: this.expiresIn } as any);
  }

  verify(token: string): any {
    try {
      return jwt.verify(token, this.secret);
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  getSecret(): string {
    return this.secret;
  }
}

