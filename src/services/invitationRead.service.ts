import mongoose from 'mongoose';
import { InvitationRepository } from '../repository';
import { Helper } from '../utils';
import { RedisService } from './redis.service';
import { SharedServices } from './shared.service';
import { UserAccountType } from '../infrastructure';
import logger from '../utils/logger';

export class InvitationReadService {
  constructor(
    private readonly _invitationRepo: InvitationRepository,
    private readonly _sharedService: SharedServices,
    private readonly _redisService: RedisService,
    private readonly _logger: typeof logger,
  ) {}

  //Todo: Fetch invitations for companys, allow them to filter and paginate efficiently
  async fetchMyInvitations(params: { user: mongoose.Types.ObjectId }) {
    try {
      const { user } = params;
      const userDetails = await this._sharedService.getUserWithDetails({
        identifier: 'id',
        value: user,
      });
      // RBAC check
      Helper.checkUserType(
        userDetails.account_type,
        [UserAccountType.COMPANY],
        'view their sent invitations',
      );
      // const cacheKey = `my:${user}:invitations`;
      // const cacheResults = await this._redisService.get(cacheKey);
      // if (cacheResults) {
      //   return JSON.parse(cacheResults);
      // }
      const results = await this._invitationRepo.fetchMyInvitations(user);
      // await this._redisService.set(cacheKey, JSON.stringify(results), true, 600);
      return results;
    } catch (error) {
      this._logger.error('Failed to fetch invitations', error);
      throw error;
    }
  }

  async fetchAllInvitations(params: { user: mongoose.Types.ObjectId }) {
    try {
      const { user } = params;
      const userDetails = await this._sharedService.getUserWithDetails({
        identifier: 'id',
        value: user,
      });
      // RBAC check
      Helper.checkUserType(
        userDetails.account_type,
        [UserAccountType.ADMIN],
        'view all sent invitations',
      );
      const cacheKey = `all:invitations`;
      const cacheResults = await this._redisService.get(cacheKey);
      if (cacheResults) {
        return JSON.parse(cacheResults);
      }
      const results = await this._invitationRepo.fetchInvitations();
      await this._redisService.set(cacheKey, JSON.stringify(results), true, 600);
      return results;
    } catch (error) {
      this._logger.error('Failed to fetch invitations', error);
      throw error;
    }
  }
}
