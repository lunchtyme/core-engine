import {
  AdminRepository,
  CompanyRepository,
  IndividualRepository,
  UserRepository,
} from '../repository';
import { SharedServices } from './shared.service';
import { DEFAULT_CACHE_EXPIRY_IN_SECS, logger } from '../utils';
import { RedisService } from './redis.service';

export class AuthReadservice {
  constructor(
    private readonly _userRepo: UserRepository,
    private readonly _companyRepo: CompanyRepository,
    private readonly _adminRepo: AdminRepository,
    private readonly _individualRepo: IndividualRepository,
    private readonly _sharedService: SharedServices,
    private readonly _redisService: RedisService,
    private readonly _logger: typeof logger,
  ) {}

  async me(user_id: string) {
    try {
      //check cache for data
      const meCacheKey = `me:${user_id}`;
      const cacheLookupResult = await this._redisService.get(meCacheKey);
      if (cacheLookupResult) {
        return JSON.parse(cacheLookupResult);
      }
      const user = await this._userRepo.getUser({ identifier: 'id', value: user_id });
      const hydratedUser = {
        id: user?._id,
        account_type: user?.account_type,
        account_state: user?.account_state,
        email: user?.email,
        email_verified: user?.email_verified,
        verified: user?.verified,
        dial_code: user?.dial_code,
        phone_number: user?.phone_number,
        time_zone: user?.time_zone,
        created_at: user?.created_at,
        onboarded: user?.has_completed_onboarding,
      };
      // cache for 3 minutes
      await this._redisService.set(
        meCacheKey,
        JSON.stringify(hydratedUser),
        true,
        DEFAULT_CACHE_EXPIRY_IN_SECS,
      );
      return hydratedUser;
    } catch (error) {
      this._logger.error('Error fetching user profile data', error);
      throw error;
    }
  }
}
