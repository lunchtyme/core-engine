import mongoose from 'mongoose';
import {
  AdminRepository,
  CompanyRepository,
  IndividualRepository,
  UserRepository,
} from '../repository';
import { UserAccountType } from '../typings/user';
import {
  CreateAdminAccountDTO,
  CreateCompanyAccountDTO,
  CreateIndividualAccountDTO,
  RegisterAccountDTO,
} from './dtos/request.dto';
import { SharedServices } from './shared.service';
import { hash } from 'argon2';

export class Authservice {
  private readonly _userRepo: UserRepository;
  private readonly _companyRepo: CompanyRepository;
  private readonly _sharedService: SharedServices;
  private readonly _adminRepo: AdminRepository;
  private readonly _individualRepo: IndividualRepository;

  constructor(
    userRepo: UserRepository,
    companyRepo: CompanyRepository,
    adminRepo: AdminRepository,
    individualRepo: IndividualRepository,
    sharedService: SharedServices,
  ) {
    this._userRepo = userRepo;
    this._companyRepo = companyRepo;
    this._adminRepo = adminRepo;
    this._individualRepo = individualRepo;
    this._sharedService = sharedService;
  }

  async register(params: RegisterAccountDTO) {
    const session = await mongoose.startSession();
    try {
      const { email } = params;
      const userExist = await this._sharedService.checkUserExist({
        identifier: 'email',
        value: email,
      });

      if (userExist) {
        throw new Error('User already exist');
      }

      // Password hashing
      const hashedPassword = await hash(params.password);

      const user = await this._userRepo.create({ ...params, password: hashedPassword }, session);

      let accountCreateResult;

      switch (params.account_type) {
        case UserAccountType.COMPANY:
          accountCreateResult = await this.registerCompany(params as CreateCompanyAccountDTO);
          break;
        case UserAccountType.INDIVIDUAL:
          accountCreateResult = await this.registerIndividual(params as CreateIndividualAccountDTO);
          break;
        case UserAccountType.ADMIN:
          accountCreateResult = await this.registerAdmin(params as CreateAdminAccountDTO);
          break;
        default:
          throw new Error('Invalid account type provided');
      }

      // OTP and email queues

      // Set the account reference
      user.account_ref = accountCreateResult._id;
      await user.save({ session });

      const { password, ...result } = user.toObject();
      return result;
    } catch (error) {
      throw error;
    } finally {
      await session.endSession();
    }
  }

  async registerCompany(params: CreateCompanyAccountDTO, session?: mongoose.ClientSession | null) {
    try {
      // Perform company-specific validation and logic

      return await this._companyRepo.create({ ...params }, session);
    } catch (error) {
      throw error;
    }
  }

  async registerAdmin(params: CreateAdminAccountDTO, session?: mongoose.ClientSession | null) {
    try {
      // Perform admin-specific validation and logic

      return await this._adminRepo.create({ ...params }, session);
    } catch (error) {
      throw error;
    }
  }

  async registerIndividual(
    params: CreateIndividualAccountDTO,
    session?: mongoose.ClientSession | null,
  ) {
    try {
      // Perform individual-specific validation and logic

      return await this._individualRepo.create({ ...params }, session);
    } catch (error) {
      throw error;
    }
  }

  async authenticate() {}
}
