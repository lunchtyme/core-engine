import mongoose from 'mongoose';
import { loadEnv } from '../../utils';

loadEnv(process.env.NODE_ENV!);

// Singleton design pattern
class Database {
  private static instance: Database;
  private constructor() {}

  static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  async connect(): Promise<void> {
    if (mongoose.connection.readyState === 0) {
      // Not connected
      try {
        await mongoose.connect(process.env.MONGO_URI!, {});
        console.log('Database connected');
      } catch (error: any) {
        console.error('Database failed to connect', error.message);
        process.exit(0);
      }
    }
  }

  async disconnect(): Promise<void> {
    if (mongoose.connection.readyState !== 0) {
      // Connected
      try {
        await mongoose.disconnect();
        console.log('Database disconnected');
      } catch (error: any) {
        console.error('Database failed to disconnect', error.message);
        // Decide whether to exit or handle differently
      }
    }
  }
}

export const DB = Database.getInstance();
