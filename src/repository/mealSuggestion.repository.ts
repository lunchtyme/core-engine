import mongoose from 'mongoose';
import { MealSuggestionDocument, MealSuggestionModel } from '../infrastructure';
import { AddMealSuggestionDTO } from '../services/dtos/request.dto';
import { BaseRepository } from './base.repository';
import logger from '../utils/logger';
import { AuthUserClaim } from '../typings/user';

export class MealSuggestionRepository extends BaseRepository<MealSuggestionDocument> {
  constructor() {
    super(MealSuggestionModel);
  }
  async create(params: AddMealSuggestionDTO, session?: mongoose.ClientSession | null) {
    try {
      const { name, description, reason_for_suggestion, user } = params;
      const result = new MealSuggestionModel({
        user: (user as AuthUserClaim).sub as mongoose.Types.ObjectId,
        name,
        reason_for_suggestion,
        description,
      });

      return await result.save({ session });
    } catch (error) {
      logger.error('Error storing meal suggestion', { error });
      throw error;
    }
  }

  async getOne(params: { id: mongoose.Types.ObjectId }) {
    try {
      return await this.getModel().findOne({ _id: params.id });
    } catch (error) {
      throw error;
    }
  }

  async getAll() {}
}
