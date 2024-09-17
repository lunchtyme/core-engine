import { UserAccountType } from '../infrastructure/database/models/enums';
import { OrderRepository, UserRepository } from '../repository';
import { AuthUserClaim } from '../typings/user';
import { Helper } from '../utils';
import logger from '../utils/logger';

export class AdminReadService {
  constructor(
    private readonly _userRepo: UserRepository,
    private readonly _orderRepo: OrderRepository,
    private readonly _logger: typeof logger,
  ) {}

  async getOverviewAnalytics(user: AuthUserClaim) {
    try {
      Helper.checkUserType(user.account_type, [UserAccountType.ADMIN], 'access this resource');
      const [users, orders, employees, companies] = await Promise.all([
        this._userRepo.getAllUserCount(),
        this._orderRepo.getAllOrderCount(),
        this._userRepo.getAllEmployeeCount(),
        this._userRepo.getAllCompanyCount(),
      ]);
      return {
        users,
        orders,
        employees,
        companies,
      };
    } catch (error) {
      console.log(error);
      this._logger.error('Error fetching admin overview analytics', { error, user });
      throw error;
    }
  }
}
