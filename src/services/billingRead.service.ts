import {
  AdminRepository,
  BillingRepository,
  CompanyRepository,
  IndividualRepository,
  UserRepository,
} from '../repository';
import { SharedServices } from './shared.service';
import { DEFAULT_CACHE_EXPIRY_IN_SECS, Helper, logger } from '../utils';
import { RedisService } from './redis.service';
import { AuthUserClaim, UserAccountType } from '../typings/user';
import { FetchBillingsDTO } from './dtos';
import { getBillingHistoryQuery } from './queries/getBillings.query';

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
      this._logger.error('Error billings data', error);
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
