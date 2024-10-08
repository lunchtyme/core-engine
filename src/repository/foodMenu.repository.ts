import mongoose from 'mongoose';
import { FoodMenuDocument, FoodMenuModel } from '../infrastructure';
import { NotFoundError } from '../utils';
import { AddFoodToMenuDTO } from '../services/dtos/request.dto';
import { BaseRepository } from './base.repository';
import logger from '../utils/logger';

export class FoodMenuRepository extends BaseRepository<FoodMenuDocument> {
  constructor() {
    super(FoodMenuModel);
  }
  async create(params: AddFoodToMenuDTO, session?: mongoose.ClientSession | null) {
    try {
      const {
        name,
        price,
        categories,
        user,
        description,
        food_image,
        health_benefits,
        allergens,
        suitable_for_conditions,
        suitable_for_diet,
      } = params;

      const result = new FoodMenuModel({
        name,
        price: new mongoose.Types.Decimal128(price),
        categories,
        description,
        added_by: user,
        food_image: food_image as string,
        health_benefits,
        suitable_for_conditions,
        suitable_for_diet,
        allergens,
      });

      return await result.save({ session });
    } catch (error) {
      logger.error('Error saving food menu:', error);
      throw error;
    }
  }

  async updateFoodAvailability(foodMenuId: mongoose.Types.ObjectId, available: boolean) {
    try {
      const foodItem = await FoodMenuModel.findByIdAndUpdate(
        foodMenuId,
        { available },
        { new: true },
      );

      if (!foodItem) {
        throw new NotFoundError('Food item not found');
      }

      logger.info('Food availability updated successfully');
      return foodItem;
    } catch (error) {
      logger.error('Error updating food menu availability', { error, foodMenuId });
      throw error;
    }
  }

  async getOne(id: mongoose.Types.ObjectId) {
    try {
      return await FoodMenuModel.findById(id).exec();
    } catch (error) {
      throw error;
    }
  }
}
