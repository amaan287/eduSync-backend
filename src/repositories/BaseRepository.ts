import { Model, Document, FilterQuery, UpdateQuery, Types } from 'mongoose';
import { AppError } from '@/types';

export abstract class BaseRepository<T extends Document> {
  constructor(protected model: Model<T>) {}

  async create(data: Partial<T>): Promise<T> {
    try {
      const document = await this.model.create(data);
      return document;
    } catch (error: any) {
      if (error.code === 11000) {
        throw new AppError(409, 'Resource already exists');
      }
      throw new AppError(500, `Failed to create: ${error.message}`);
    }
  }

  async findById(id: string | Types.ObjectId): Promise<T | null> {
    try {
      return await this.model.findById(id);
    } catch (error: any) {
      throw new AppError(500, `Failed to find by ID: ${error.message}`);
    }
  }

  async findOne(filter: FilterQuery<T>): Promise<T | null> {
    try {
      return await this.model.findOne(filter);
    } catch (error: any) {
      throw new AppError(500, `Failed to find: ${error.message}`);
    }
  }

  async findMany(filter: FilterQuery<T> = {}): Promise<T[]> {
    try {
      return await this.model.find(filter);
    } catch (error: any) {
      throw new AppError(500, `Failed to find many: ${error.message}`);
    }
  }

  async updateById(id: string | Types.ObjectId, update: UpdateQuery<T>): Promise<T | null> {
    try {
      return await this.model.findByIdAndUpdate(id, update, { new: true });
    } catch (error: any) {
      throw new AppError(500, `Failed to update: ${error.message}`);
    }
  }

  async deleteById(id: string | Types.ObjectId): Promise<T | null> {
    try {
      return await this.model.findByIdAndDelete(id);
    } catch (error: any) {
      throw new AppError(500, `Failed to delete: ${error.message}`);
    }
  }

  async count(filter: FilterQuery<T> = {}): Promise<number> {
    try {
      return await this.model.countDocuments(filter);
    } catch (error: any) {
      throw new AppError(500, `Failed to count: ${error.message}`);
    }
  }

  async exists(filter: FilterQuery<T>): Promise<boolean> {
    try {
      const count = await this.model.countDocuments(filter).limit(1);
      return count > 0;
    } catch (error: any) {
      throw new AppError(500, `Failed to check existence: ${error.message}`);
    }
  }
}

