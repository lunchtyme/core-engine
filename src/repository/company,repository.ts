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

  async update(params: Partial<CreateCompanyAccountDTO>, session?: mongoose.ClientSession | null) {
    try {
      const updateQuery = { ...params };
      const options: any = {};
      if (session) {
        options.session = session;
      }
      const result = await CompanyModel.updateOne({ user: params.user }, updateQuery, options);
      return result.acknowledged;
    } catch (error) {
      logger.error('Error updating company user in db:', error);
      throw error;
    }
  }

  async getCompanyByUserId(userId: mongoose.Types.ObjectId) {
    try {
      return await CompanyModel.findOne({ user: userId }).exec();
    } catch (error) {
      throw error;
    }
  }
}
