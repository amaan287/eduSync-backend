import mongoose from 'mongoose';

export class DatabaseConfig {
  private static instance: DatabaseConfig;
  private isConnected: boolean = false;

  private constructor() {}

  static getInstance(): DatabaseConfig {
    if (!DatabaseConfig.instance) {
      DatabaseConfig.instance = new DatabaseConfig();
    }
    return DatabaseConfig.instance;
  }

  async connect(): Promise<void> {
    if (this.isConnected) {
      console.log('Already connected to MongoDB');
      return;
    }

    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/edusync';

    try {
      await mongoose.connect(mongoUri);
      this.isConnected = true;
      console.log('✓ Connected to MongoDB successfully');
    } catch (error) {
      console.error('✗ MongoDB connection error:', error);
      throw error;
    }

    mongoose.connection.on('disconnected', () => {
      this.isConnected = false;
      console.log('MongoDB disconnected');
    });

    mongoose.connection.on('error', (error) => {
      console.error('MongoDB error:', error);
    });
  }

  async disconnect(): Promise<void> {
    if (!this.isConnected) {
      return;
    }

    await mongoose.disconnect();
    this.isConnected = false;
    console.log('MongoDB disconnected');
  }

  getConnection() {
    return mongoose.connection;
  }
}

