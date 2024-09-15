import {
  BillingRepository,
  CompanyRepository,
  IndividualRepository,
  OrderRepository,
  UserRepository,
} from '../repository';
import { DEFAULT_CACHE_EXPIRY_IN_SECS, Helper, logger, NotFoundError } from '../utils';
import { RedisService } from './redis.service';
import { FetchUsersDTO } from './dtos/request.dto';
import { getAllUserQuery } from './queries/getAllUsers.query';
import mongoose from 'mongoose';
import { getEmployeeAccountsByCompany } from './queries/getEmployeeByCompany.query';
import { AuthUserClaim, UserAccountType } from '../typings/user';

export class UserReadService {
  constructor(
    private readonly _userRepo: UserRepository,
    private readonly _companyRepo: CompanyRepository,
    private readonly _orderRepo: OrderRepository,
    private readonly _billingRepo: BillingRepository,
    private readonly _individualRepo: IndividualRepository,
    private readonly _redisService: RedisService,
    private readonly _logger: typeof logger,
  ) {}

  // Admin
  async allUsers(params: FetchUsersDTO) {
    try {
      Helper.checkUserType(
        params.user.account_type,
        [UserAccountType.ADMIN],
        'fetch all user datas',
      );
      const cacheKey = `get:All:users`;
      const cachedResult = await this._redisService.get(cacheKey);
      if (cachedResult) {
        this._logger.info('Users fetched from cache');
        return JSON.parse(cachedResult);
      }
      const { query, ...filters } = params;
      const getAllUsersPipeline = getAllUserQuery({ query });
      const result = await this._userRepo.paginateAndAggregateCursor(getAllUsersPipeline, filters);
      await this._redisService.set(
        cacheKey,
        JSON.stringify(result),
        true,
        DEFAULT_CACHE_EXPIRY_IN_SECS,
      );
      return result;
    } catch (error) {
      this._logger.error('Error fetching users lists', error);
      throw error;
    }
  }

  // Company
  async allEmployeesForCompany(params: FetchUsersDTO) {
    try {
      Helper.checkUserType(
        params.user.account_type,
        [UserAccountType.COMPANY],
        'fetch all their employee data',
      );
      const cacheKey = `get:All:employees`;
      const cachedResult = await this._redisService.get(cacheKey);
      if (cachedResult) {
        this._logger.info('Employees fetched from cache');
        return JSON.parse(cachedResult);
      }
      const { query, user, ...filters } = params;
      const company = await this._companyRepo.getCompanyByUserId(
        user.sub as mongoose.Types.ObjectId,
      );
      if (!company) {
        throw new NotFoundError('Failed to fetch employees, company not found');
      }
      const getAllUsersPipeline = getEmployeeAccountsByCompany({
        query,
        companyId: company._id,
      });
      const result = await this._userRepo.paginateAndAggregateCursor(getAllUsersPipeline, filters);
      await this._redisService.set(
        cacheKey,
        JSON.stringify(result),
        true,
        DEFAULT_CACHE_EXPIRY_IN_SECS,
      );
      return result;
    } catch (error) {
      this._logger.error('Error fetching employee lists', error);
      throw error;
    }
  }

  // Employee overview analytics
  async getEmployeeOverviewAnalytics(user: AuthUserClaim) {
    try {
      Helper.checkUserType(user.account_type, [UserAccountType.INDIVIDUAL], 'access this resource');
      const [orders, balance] = await Promise.all([
        this._orderRepo.countEmployeeOrders(user.sub),
        this._individualRepo.getSpendBalance(user.sub),
      ]);
      return {
        orders,
        balance,
      };
    } catch (error) {
      this._logger.error('Error fetching employee overview analytics', { error, user });
      throw error;
    }
  }

  // Company overview analytics
  async getCompanyOverviewAnalytics(user: AuthUserClaim) {
    try {
      Helper.checkUserType(user.account_type, [UserAccountType.COMPANY], 'access this resource');
      const companyInfo = await this._companyRepo.getCompanyByUserId(user.sub);
      const [orders, balance, amountSpent, employees] = await Promise.all([
        this._orderRepo.countCompanyEmployeeOrders(companyInfo?._id as mongoose.Types.ObjectId),
        this._companyRepo.getSpendBalance(user.sub),
        this._billingRepo.getTotalAmountSpentByMe(user.sub),
        this._individualRepo.countCompanyEmployees(companyInfo?._id as mongoose.Types.ObjectId),
      ]);
      return {
        orders,
        balance,
        employees,
        amount_spent: amountSpent,
      };
    } catch (error) {
      this._logger.error('Error fetching employee overview analytics', { error, user });
      throw error;
    }
  }
}
