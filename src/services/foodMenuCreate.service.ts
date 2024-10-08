import mongoose from 'mongoose';
import { FoodMenuRepository } from '../repository';

import { BadRequestError, Helper } from '../utils';
import { AddFoodToMenuDTO } from './dtos/request.dto';
import { AddFoodToMenuDTOValidator } from './dtos/validators';
import { UserAccountType } from '../infrastructure';
import { AuthUserClaim } from '../typings/user';
import logger from '../utils/logger';

export class FoodMenuCreateService {
  constructor(
    private readonly _foodMenuRepo: FoodMenuRepository,
    private readonly _logger: typeof logger,
  ) {}

  async addFoodToMenu(params: AddFoodToMenuDTO) {
    try {
      Helper.checkUserType(
        (params.user as AuthUserClaim).account_type,
        [UserAccountType.ADMIN],
        'add food menus',
      );
      const { value, error } = AddFoodToMenuDTOValidator.validate(params);
      if (error) {
        this._logger.error('Validation error', error);
        throw new BadRequestError(error.message);
      }

      const {
        user,
        price,
        description,
        name,
        categories,
        allergens,
        suitable_for_conditions,
        suitable_for_diet,
        health_benefits,
      } = value;
      // Only accept certain text file e.g (jpeg, webp, png e.t.c)
      const allowedMimeTypes = ['image/jpeg', 'image/webp', 'image/png'];

      const file: any = params.food_image as Express.Multer.File;

      if (!file) {
        throw new BadRequestError('Please select a file to upload');
      }

      if (!allowedMimeTypes.includes(file.mimetype)) {
        // Handle case where file has incorrect mime type
        throw new BadRequestError('Only JPEG, PNG, and WebP images are allowed');
      }

      // Upload image and store the url
      const filePath = file.path;
      const photo = await Helper.uploadImageToCloudinary(filePath);
      const addFoodMenuParams = {
        name,
        description,
        price: parseFloat(price).toFixed(2), // Ensure price has two decimal places
        categories,
        user: (user as AuthUserClaim).sub as mongoose.Types.ObjectId,
        food_image: photo,
        health_benefits,
        allergens,
        suitable_for_conditions,
        suitable_for_diet,
      };

      const result = await this._foodMenuRepo.create(addFoodMenuParams);
      return result.id;
    } catch (error) {
      this._logger.error('Error adding food menu', error);
      throw error;
    }
  }

  async updateFoodAvalibility(params: {
    foodMenuId: mongoose.Types.ObjectId;
    available: boolean;
    user: AuthUserClaim;
  }) {
    try {
      Helper.checkUserType(
        params.user.account_type,
        [UserAccountType.ADMIN],
        'update food menu availability',
      );
      return await this._foodMenuRepo.updateFoodAvailability(params.foodMenuId, params.available);
    } catch (error) {
      throw error;
    }
  }
}
