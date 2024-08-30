import mongoose from 'mongoose';
import { CreateIndividualAccountDTO } from '../services/dtos/request.dto';
import { IndividualModel } from '../infrastructure';
import { logger } from '../utils';

export class IndividualRepository {
  async create(params: CreateIndividualAccountDTO, session?: mongoose.ClientSession | null) {
    try {
      const result = new IndividualModel(params);
      return await result.save({ session });
    } catch (error) {
      logger.error('Error storing individual user to db:', error);
      throw error;
    }
  }
}
