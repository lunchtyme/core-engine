import {
  AdminRepository,
  BillingRepository,
  CompanyRepository,
  IndividualRepository,
  UserRepository,
} from '../repository';
import { SharedServices } from './shared.service';
import { RedisService } from './redis.service';

import { FetchBillingsDTO } from './dtos';
import { getBillingHistoryQuery } from './queries/getBillings.query';
import { UserAccountType } from '../infrastructure/database/models/enums';
import { AuthUserClaim } from '../typings/user';
import { Helper } from '../utils';
import logger from '../utils/logger';

export class BillingReadService {
  constructor(
    private readonly _userRepo: UserRepository,
    private readonly _companyRepo: CompanyRepository,
    private readonly _adminRepo: AdminRepository,
    private readonly _individualRepo: IndividualRepository,
    private readonly _billingRepo: BillingRepository,
    private readonly _sharedService: SharedServices,
    private readonly _redisService: RedisService,
    private readonly _logger: typeof logger,
  ) {}

  // Company&Admin
  async getBillingHistory(params: FetchBillingsDTO) {
    try {
      const { user, ...filters } = params;
      Helper.checkUserType(
        user.account_type,
        [UserAccountType.COMPANY, UserAccountType.ADMIN],
        'fetch billings data',
      );
      let getBillingQuery =
        user.account_type === UserAccountType.COMPANY
          ? getBillingHistoryQuery({
              companyUserId: user.sub,
            })
          : getBillingHistoryQuery({});
      const result = await this._billingRepo.paginateAndAggregateCursor(getBillingQuery, filters);
      return result;
    } catch (error) {
      console.log(this._logger);
      console.log(error);
      // this._logger.error('Error billings data', error);
      throw error;
    }
  }

  async getCompanySpendBalance(user: AuthUserClaim) {
    try {
      return await this._companyRepo.getSpendBalance(user.sub);
    } catch (error) {
      throw error;
    }
  }

  async getIndividualSpendBalance(user: AuthUserClaim) {
    try {
      return await this._individualRepo.getSpendBalance(user.sub);
    } catch (error) {
      throw error;
    }
  }
}
