import mongoose from 'mongoose';
import { HealthInfoRepository } from '../repository';
import { BadRequestError, Helper } from '../utils';
import { AddUserHealthInfoDTO } from './dtos/request.dto';
import { AddUserHealthInfoDTOValidator } from './dtos/validators';
import { UserAccountType } from '../infrastructure';
import { AuthUserClaim } from '../typings/user';
import logger from '../utils/logger';

export class HealthInfoCreateService {
  constructor(
    private readonly _healthInfoRepo: HealthInfoRepository,
    private readonly _logger: typeof logger,
  ) {}

  async addUserHealthInfo(params: AddUserHealthInfoDTO, session?: mongoose.ClientSession | null) {
    try {
      Helper.checkUserType(
        (params.user as AuthUserClaim).account_type,
        [UserAccountType.INDIVIDUAL],
        'can provide their health information',
      );
      const { value, error } = AddUserHealthInfoDTOValidator.validate(params);
      if (error) {
        this._logger.error('Validation error', error);
        throw new BadRequestError(error.message);
      }
      const { user, allergies, medical_conditions, dietary_preferences } = value;

      const healthInfoParams = {
        user: (user as AuthUserClaim).sub as mongoose.Types.ObjectId,
        allergies,
        medical_conditions,
        dietary_preferences,
      };

      const result = await this._healthInfoRepo.create(healthInfoParams, session);
      return result.id;
    } catch (error) {
      this._logger.error('Error storing user health info', { error });
      throw error;
    }
  }
}
