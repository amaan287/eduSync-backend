import { BaseRepository } from './BaseRepository';
import { User } from '@/models/User';
import { IUser } from '@/types';

export class UserRepository extends BaseRepository<IUser> {
  constructor() {
    super(User);
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return await this.findOne({ email: email.toLowerCase() });
  }

  async findByRole(role: 'student' | 'instructor'): Promise<IUser[]> {
    return await this.findMany({ role });
  }
}

