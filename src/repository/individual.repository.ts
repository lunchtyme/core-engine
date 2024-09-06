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

  async update(
    params: Partial<CreateIndividualAccountDTO>,
    session?: mongoose.ClientSession | null,
  ) {
    try {
      const updateQuery = { ...params };
      const options: any = {};
      if (session) {
        options.session = session;
      }
      const result = await IndividualModel.updateOne({ user: params.user }, updateQuery, options);
      return result.acknowledged;
    } catch (error) {
      logger.error('Error updating individual user in db:', error);
      throw error;
    }
  }
}
