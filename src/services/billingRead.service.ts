import {
  AdminRepository,
  CompanyRepository,
  IndividualRepository,
  UserRepository,
} from '../repository';
import { SharedServices } from './shared.service';
import { DEFAULT_CACHE_EXPIRY_IN_SECS, logger } from '../utils';
import { RedisService } from './redis.service';

export class BillingReadservice {
  constructor(
    private readonly _userRepo: UserRepository,
    private readonly _companyRepo: CompanyRepository,
    private readonly _adminRepo: AdminRepository,
    private readonly _individualRepo: IndividualRepository,
    private readonly _sharedService: SharedServices,
    private readonly _redisService: RedisService,
    private readonly _logger: typeof logger,
  ) {}

  // Company/Admin
  async getBillingHistory() {
    try {
    } catch (error) {
      this._logger.error('Error fetching employee lists', error);
      throw error;
    }
  }
}
