import mongoose from 'mongoose';
import { UserAccountType } from '../infrastructure';
import { FoodMenuRepository } from '../repository';
import { Helper, NotFoundError } from '../utils';
import logger from '../utils/logger';
import { FetchFoodMenuByIdDTO, FetchFoodMenuDTO } from './dtos/request.dto';
import { getRecommendedMealsQuery } from './queries/getRecommendedMeals.query';
import { RedisService } from './redis.service';

export class FoodMenuReadService {
  constructor(
    private readonly _foodMenuRepo: FoodMenuRepository,
    private readonly _redisService: RedisService,
    private readonly _logger: typeof logger,
  ) {}

  async getAllMenu(params: FetchFoodMenuDTO) {
    try {
      Helper.checkUserType(
        params.user.account_type,
        [UserAccountType.INDIVIDUAL, UserAccountType.ADMIN],
        'fetch food menus',
      );

      const { query, category, risk_health, ...filters } = params;

      // Ensure risk_health is treated as a boolean
      const isRiskHealth = typeof risk_health === 'boolean' ? risk_health : false;

      // Get the aggregation pipeline with the adjusted risk_health parameter
      const fetchPipeline = await getRecommendedMealsQuery({
        query,
        category,
        userId: params.user.sub as mongoose.Types.ObjectId,
        risk_health: isRiskHealth,
      });

      const result = await this._foodMenuRepo.paginateAndAggregateCursor(fetchPipeline, filters);

      this._logger.info('Fetching food menu from database');
      return result;
    } catch (error) {
      this._logger.error('Error fetching food list menu:', error);
      throw error;
    }
  }

  async getOneMenu(params: FetchFoodMenuByIdDTO) {
    try {
      Helper.checkUserType(
        params.user.account_type,
        [UserAccountType.INDIVIDUAL, UserAccountType.ADMIN],
        'fetch food menu by id',
      );

      const result = await this._foodMenuRepo.getOne(params.menuId);
      if (!result) {
        throw new NotFoundError('Food menu not found');
      }
      return result;
    } catch (error) {
      throw error;
    }
  }
}
