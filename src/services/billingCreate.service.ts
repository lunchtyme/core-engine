import {
  AdminRepository,
  CompanyRepository,
  IndividualRepository,
  UserRepository,
} from '../repository';
import { SharedServices } from './shared.service';
import { DEFAULT_CACHE_EXPIRY_IN_SECS, logger } from '../utils';
import { RedisService } from './redis.service';

export class BillingCreateservice {
  constructor(
    private readonly _userRepo: UserRepository,
    private readonly _companyRepo: CompanyRepository,
    private readonly _adminRepo: AdminRepository,
    private readonly _individualRepo: IndividualRepository,
    private readonly _sharedService: SharedServices,
    private readonly _redisService: RedisService,
    private readonly _logger: typeof logger,
  ) {}

  // Company
  async topupWalletBalance() {
    try {
    } catch (error) {
      this._logger.error('Error fetching users lists', error);
      throw error;
    }
  }

  // System
  async chargeWallet() {
    try {
    } catch (error) {
      this._logger.error('Error fetching employee lists', error);
      throw error;
    }
  }
}
