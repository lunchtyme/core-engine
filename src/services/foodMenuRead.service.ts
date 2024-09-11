import { FoodMenuRepository } from '../repository';
import { DEFAULT_CACHE_EXPIRY_IN_SECS, Helper, logger } from '../utils';
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
     const cacheKey = Helper.generateCacheKey(params);
     const cachedResult = await this._redisService.get(cacheKey);
     if (cachedResult) {
       this._logger.info('Returned cached food menu');
       return JSON.parse(cachedResult);
     }
     const { query, category, ...filters } = params;
     const excludeFields = ['__v', 'updated_at'];
     const options = { ...filters, excludeFields };
     const fetchPipeline = getFoodMenuQuery({ query, category });
     this._logger.info('Fetching food menu from database');
     const result = await this._foodMenuRepo.paginateAndAggregateCursor(fetchPipeline, options);
     await this._redisService.set(cacheKey, JSON.stringify(result), true, DEFAULT_CACHE_EXPIRY_IN_SECS);
     return result;
    } catch (error) {
      logger.error('Error fetching food list menu:', error);
      throw error;
    }
  }
}
