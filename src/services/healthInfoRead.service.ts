import mongoose from 'mongoose';
import { HealthInfoRepository } from '../repository';
import { Helper } from '../utils';
import { UserAccountType } from '../infrastructure';
import { AuthUserClaim } from '../typings/user';
import logger from '../utils/logger';

export class HealthInfoReadService {
  constructor(
    private readonly _healthInfoRepo: HealthInfoRepository,
    private readonly _logger: typeof logger,
  ) {}

  async getUserHealthInfo(params: { user: AuthUserClaim | mongoose.Types.ObjectId }) {
    try {
      Helper.checkUserType(
        (params.user as AuthUserClaim).account_type,
        [UserAccountType.INDIVIDUAL, UserAccountType.ADMIN],
        'can view health information',
      );

      return await this._healthInfoRepo.getOne({
        user_id: (params.user as AuthUserClaim).sub as mongoose.Types.ObjectId,
      });
    } catch (error) {
      this._logger.error('Error getting user health info', { error });
      throw error;
    }
  }
}
