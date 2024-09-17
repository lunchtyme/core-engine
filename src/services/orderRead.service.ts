import mongoose from 'mongoose';
import { OrderRepository } from '../repository';

import { Helper } from '../utils';
import { FetchOrderssDTO } from './dtos/request.dto';
import { getOrderHistoryQuery } from './queries/getOrderHistory.query';
import { UserAccountType } from '../infrastructure/database/models/enums';
import logger from '../utils/logger';

export class OrderReadService {
  constructor(
    private readonly _orderRepo: OrderRepository,
    private readonly _logger: typeof logger,
  ) {}

  async getOrderHistory(params: FetchOrderssDTO) {
    try {
      const { user, ...filters } = params;
      Helper.checkUserType(
        user.account_type,
        [UserAccountType.INDIVIDUAL, UserAccountType.ADMIN],
        'fetch order history',
      );
      let getBillingQuery =
        user.account_type === UserAccountType.INDIVIDUAL
          ? getOrderHistoryQuery({
              employeeId: user.sub as mongoose.Types.ObjectId,
            })
          : getOrderHistoryQuery({});
      const result = await this._orderRepo.paginateAndAggregateCursor(getBillingQuery, filters);
      return result;
    } catch (error) {
      this._logger.error('Error billings data', error);
      throw error;
    }
  }
}
