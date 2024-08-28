import mongoose from 'mongoose';
import {
  AdminRepository,
  CompanyRepository,
  GetUserParams,
  IndividualRepository,
  UserRepository,
} from '../repository';
import { UserAccountType } from '../typings/user';
import {
  ConfirmEmailDTO,
  CreateAdminAccountDTO,
  CreateCompanyAccountDTO,
  CreateIndividualAccountDTO,
  LoginDTO,
  RegisterAccountDTO,
  ResendEmailVerificationCodeDTO,
} from './dtos/request.dto';
import { SharedServices } from './shared.service';
import { hash, verify } from 'argon2';
import * as jwt from 'jsonwebtoken';
import { Helper } from '../utils';

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

      // User specific validation

      // Password hashing
      const hashedPassword = await hash(params.password);

      const user = await this._userRepo.create({ ...params, password: hashedPassword }, session);

      let accountCreateResult;

      switch (params.account_type) {
        case UserAccountType.COMPANY:
          accountCreateResult = await this.registerCompany({
            ...params,
            user: user._id,
          } as CreateCompanyAccountDTO);
          break;
        case UserAccountType.INDIVIDUAL:
          accountCreateResult = await this.registerIndividual({
            ...params,
            user: user._id,
          } as CreateIndividualAccountDTO);
          break;
        case UserAccountType.ADMIN:
          accountCreateResult = await this.registerAdmin({
            ...params,
            user: user._id,
          } as CreateAdminAccountDTO);
          break;
        default:
          throw new Error('Invalid account type provided');
      }

      const OTP = Helper.generateOTPCode();

      //  put verify email on queue

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

  async authenticate(params: LoginDTO) {
    try {
      const { identifier, password } = params;

      // Validate user input

      const userCheckParam =
        identifier === 'email'
          ? { identifier: 'email', value: identifier }
          : { identifier: 'phone_number', value: identifier };

      const user = await this._sharedService.getUser(userCheckParam as GetUserParams);

      if (!user) {
        throw new Error('Invalid credentials, user not found');
      }

      // Compare password
      const isPasswordMatch = await verify(user.password, password);

      if (!isPasswordMatch) {
        throw new Error('Invalid credentials');
      }

      // TODO: Probably check if user has verified their email and provide follow up flow
      // ...any other required business logic

      const jwtClaim = { sub: user._id };
      const accessTokenHash = jwt.sign(jwtClaim, process.env.JWT_SECRET!, {
        expiresIn: process.env.JWT_EXPIRES_IN!,
      });

      return accessTokenHash;
    } catch (error) {
      throw error;
    }
  }

  async confirmEmail(params: ConfirmEmailDTO) {
    try {
      const { email, otp } = params;

      // Validate user inputs

      const user = await this._sharedService.getUser({ identifier: 'email', value: email });

      if (!user) {
        throw new Error('User not found');
      }

      // Lookup to redis to check otp and validate

      // Update user info
      user.email_verified = true;
      user.verified = true;

      await user.save();
      // Send success email

      return user._id;
    } catch (error) {
      throw error;
    }
  }

  async resendEmailVerificationCode(params: ResendEmailVerificationCodeDTO) {
    try {
      const { email } = params;

      // Validate user inputs

      const user = await this._sharedService.getUser({ identifier: 'email', value: email });

      if (!user) {
        throw new Error('User not found');
      }

      // Generate OTP and send verification email
      const OTP = Helper.generateOTPCode();

      return user._id;
    } catch (error) {
      throw error;
    }
  }
}
