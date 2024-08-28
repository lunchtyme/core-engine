import mongoose from 'mongoose';
import { CreateCompanyAccountDTO } from '../services/dtos/request.dto';
import { CompanyModel } from '../infrastructure';

export class CompanyRepository {
  async create(params: CreateCompanyAccountDTO, session?: mongoose.ClientSession | null) {
    try {
      const result = new CompanyModel(params);
      return await result.save({ session });
    } catch (error) {
      throw error;
    }
  }
}
