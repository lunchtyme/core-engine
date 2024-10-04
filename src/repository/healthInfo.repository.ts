import mongoose from 'mongoose';
import { HealthInfoDocument, HealthInfoModel } from '../infrastructure';
import { AddUserHealthInfoDTO } from '../services/dtos/request.dto';
import { BaseRepository } from './base.repository';
import logger from '../utils/logger';

export class HealthInfoRepository extends BaseRepository<HealthInfoDocument> {
  constructor() {
    super(HealthInfoModel);
  }
  async create(params: AddUserHealthInfoDTO, session?: mongoose.ClientSession | null) {
    try {
      const { allergies, dietary_preferences, medical_conditions, user } = params;
      const result = new HealthInfoModel({
        user,
        allergies,
        dietary_preferences,
        medical_conditions,
      });

      return await result.save({ session });
    } catch (error) {
      logger.error('Error saving user health info', { error });
      throw error;
    }
  }

  async getOne(params: { user_id: mongoose.Types.ObjectId }) {
    try {
      return await this.getModel().findOne({ user: params.user_id });
    } catch (error) {
      throw error;
    }
  }
}
