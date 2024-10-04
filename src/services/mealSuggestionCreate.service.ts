import mongoose from 'mongoose';
import { MealSuggestionRepository } from '../repository';
import { BadRequestError, Helper } from '../utils';
import { AddMealSuggestionDTO } from './dtos/request.dto';
import { AddMealSuggestionDTOValidator } from './dtos/validators';
import { UserAccountType } from '../infrastructure';
import { AuthUserClaim } from '../typings/user';
import logger from '../utils/logger';

export class MealSuggestionCreateService {
  constructor(
    private readonly _mealSuggestionRepo: MealSuggestionRepository,
    private readonly _logger: typeof logger,
  ) {}

  async addMealSuggestion(params: AddMealSuggestionDTO, session?: mongoose.ClientSession | null) {
    try {
      Helper.checkUserType(
        (params.user as AuthUserClaim).account_type,
        [UserAccountType.INDIVIDUAL, UserAccountType.COMPANY],
        'suggest meals',
      );
      const { value, error } = AddMealSuggestionDTOValidator.validate(params);
      if (error) {
        this._logger.error('Validation error', error);
        throw new BadRequestError(error.message);
      }
      const { user, name, description, reason_for_suggestion } = value;

      const mealSuggestionParams = {
        user: user as AuthUserClaim,
        name,
        description,
        reason_for_suggestion,
      };

      const result = await this._mealSuggestionRepo.create(mealSuggestionParams, session);
      return result.id;
    } catch (error) {
      this._logger.error('Error storing user health info', { error });
      throw error;
    }
  }
}
