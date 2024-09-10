import { FoodMenuRepository } from '../repository';
import { AuthUserClaim, UserAccountType } from '../typings/user';
import { BadRequestError, Helper, logger } from '../utils';

export class FoodMenuReadService {
  constructor(
    private readonly _foodMenuRepo: FoodMenuRepository,
    private readonly _logger: typeof logger,
  ) {}
}
