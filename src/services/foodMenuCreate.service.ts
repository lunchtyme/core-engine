import { FoodMenuRepository } from '../repository';
import { AuthUserClaim, UserAccountType } from '../typings/user';
import { BadRequestError, Helper, logger } from '../utils';
import { AddFoodToMenuDTO } from './dtos/request.dto';
import { AddFoodToMenuDTOValidator } from './dtos/validators';

export class FoodMenuCreateService {
  constructor(
    private readonly _foodMenuRepo: FoodMenuRepository,
    private readonly _logger: typeof logger,
  ) {}

  async addFoodToMenu(params: AddFoodToMenuDTO) {
    try {
      const { value, error } = AddFoodToMenuDTOValidator.validate(params);
      if (error) {
        this._logger.error('Validation error', error);
        throw new BadRequestError(error.message);
      }
      const { user, price, description, name, categories } = value;
      Helper.checkUserType(
        (user as AuthUserClaim).account_type,
        [UserAccountType.ADMIN],
        'add food menus',
      );
      const addFoodMenuParams = {
        name,
        description,
        price: parseFloat(price).toFixed(2), // Ensure price has two decimal places
        categories,
        user: (user as AuthUserClaim).sub,
      };
      const result = await this._foodMenuRepo.create(addFoodMenuParams);
      return result.id;
    } catch (error) {
      this._logger.error('Error adding food menu', error);
      throw error;
    }
  }
}
