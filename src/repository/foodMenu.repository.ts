import mongoose from 'mongoose';
import { FoodMenuDocument, FoodMenuModel } from '../infrastructure';
import { logger } from '../utils';
import { AddFoodToMenuDTO } from '../services/dtos/request.dto';
import { BaseRepository } from './base.repository';

export class FoodMenuRepository extends BaseRepository<FoodMenuDocument> {
  constructor() {
    super(FoodMenuModel);
  }
  async create(params: AddFoodToMenuDTO, session?: mongoose.ClientSession | null) {
    try {
      const { name, price, categories, user, description } = params;
      const result = new FoodMenuModel({
        name,
        price: new mongoose.Types.Decimal128(price),
        categories,
        description,
        added_by: user,
      });

      return await result.save({ session });
    } catch (error) {
      logger.error('Error saving food menu:', error);
      throw error;
    }
  }
}
