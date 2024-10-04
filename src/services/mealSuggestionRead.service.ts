import mongoose from 'mongoose';
import { MealSuggestionRepository } from '../repository';
import { Helper } from '../utils';
import { UserAccountType } from '../infrastructure';
import { AuthUserClaim } from '../typings/user';
import logger from '../utils/logger';
import { FetchMealSuggestionsDTO } from './dtos';
import { getMealSuggestionsQuery } from './queries/getMealSuggestions.query';

export class MealSuggestionReadService {
  constructor(
    private readonly _mealSuggestionRepo: MealSuggestionRepository,
    private readonly _logger: typeof logger,
  ) {}

  async getAll(params: FetchMealSuggestionsDTO, session?: mongoose.ClientSession | null) {
    try {
      const { user, ...filters } = params;

      Helper.checkUserType(
        (params.user as AuthUserClaim).account_type,
        [UserAccountType.ADMIN],
        'fetch meal suggestions',
      );

      const result = await this._mealSuggestionRepo.paginateAndAggregateCursor(
        getMealSuggestionsQuery(),
        filters,
      );
      return result;
    } catch (error) {
      this._logger.error('Error storing user health info', { error });
      throw error;
    }
  }
}
