import mongoose from 'mongoose';
import { CreateAdminAccountDTO } from '../services/dtos/request.dto';
import { AdminModel } from '../infrastructure';

export class AdminRepository {
  async create(params: CreateAdminAccountDTO, session?: mongoose.ClientSession | null) {
    try {
      const result = new AdminModel(params);
      return await result.save({ session });
    } catch (error) {
      throw error;
    }
  }
}
