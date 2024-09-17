import mongoose from 'mongoose';
import { CreateAdminAccountDTO } from '../services/dtos/request.dto';
import { AdminModel } from '../infrastructure';
import logger from '../utils/logger';

export class AdminRepository {
  async create(params: CreateAdminAccountDTO, session?: mongoose.ClientSession | null) {
    try {
      const result = new AdminModel(params);
      return await result.save({ session });
    } catch (error) {
      logger.error('Error storing admin user to db:', error);
      throw error;
    }
  }
}
