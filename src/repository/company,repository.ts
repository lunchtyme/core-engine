import mongoose from 'mongoose';
import { CreateCompanyAccountDTO } from '../services/dtos/request.dto';
import { CompanyModel } from '../infrastructure';
import { logger } from '../utils';

export class CompanyRepository {
  async create(params: CreateCompanyAccountDTO, session?: mongoose.ClientSession | null) {
    try {
      const result = new CompanyModel(params);
      return await result.save({ session });
    } catch (error) {
      logger.error('Error storing company to db:', error);
      throw error;
    }
  }
}
