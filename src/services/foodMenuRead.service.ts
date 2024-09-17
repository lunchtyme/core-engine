import { UserAccountType } from '../infrastructure';
import { FoodMenuRepository } from '../repository';
import { DEFAULT_CACHE_EXPIRY_IN_SECS, Helper } from '../utils';
import logger from '../utils/logger';
import { FetchFoodMenuDTO } from './dtos/request.dto';
import { getFoodMenuQuery } from './queries/getAllMenu.query';
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
        [UserAccountType.COMPANY, UserAccountType.INDIVIDUAL, UserAccountType.ADMIN],
        'fetch food menus',
      );

      const { query, category, ...filters } = params;
      const fetchPipeline = getFoodMenuQuery({ query, category });
      const result = await this._foodMenuRepo.paginateAndAggregateCursor(fetchPipeline, filters);
      // );
      this._logger.info('Fetching food menu from database');
      return result;
    } catch (error) {
      logger.error('Error fetching food list menu:', error);
      throw error;
    }
  }
}
