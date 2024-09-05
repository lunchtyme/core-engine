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
import {
  BadRequestError,
  EMAIL_DATA,
  Helper,
  logger,
  NotFoundError,
  SendEmailParams,
} from '../utils';
import { RedisService } from './redis.service';
import {
  confirmEmailDTOValidator,
  createAccountDTOValidator,
  createAdminAccountDTOValidator,
  createCompanyAccountDTOValidator,
  createIndividualAccountDTOValidator,
  loginDTOValidator,
  resendEmailVerificationCodeDTOValidator,
} from './dtos/validators';
import { emailQueue } from '../infrastructure';

export class Authservice {
  private readonly _userRepo: UserRepository;
  private readonly _companyRepo: CompanyRepository;
  private readonly _sharedService: SharedServices;
  private readonly _redisService: RedisService;
  private readonly _adminRepo: AdminRepository;
  private readonly _individualRepo: IndividualRepository;
  private readonly _emailQueue: typeof emailQueue;

  constructor(
    userRepo: UserRepository,
    companyRepo: CompanyRepository,
    adminRepo: AdminRepository,
    individualRepo: IndividualRepository,
    sharedService: SharedServices,
    redisService: RedisService,
    emailQueu: typeof emailQueue,
  ) {
    this._userRepo = userRepo;
    this._companyRepo = companyRepo;
    this._adminRepo = adminRepo;
    this._individualRepo = individualRepo;
    this._sharedService = sharedService;
    this._redisService = redisService;
    this._emailQueue = emailQueu;
  }

  async register(params: RegisterAccountDTO) {
    const session = await mongoose.startSession();
    try {
      const user = await session.withTransaction(async () => {
        // User specific validation
        const { error, value } = createAccountDTOValidator.validate(params);
        if (error) {
          logger.error('Validation error', error);
          throw new BadRequestError(error.message);
        }

        const { email } = value;
        const userExist = await this._sharedService.checkUserExist({
          identifier: 'email',
          value: email,
        });
        if (userExist) {
          throw new BadRequestError('User already exists');
        }

        // Password hashing
        const hashedPassword = await hash(value.password);
        const user = await this._userRepo.create({ ...value, password: hashedPassword }, session);

        let accountCreateResult;
        switch (params.account_type) {
          case UserAccountType.COMPANY:
            accountCreateResult = await this.registerCompany(
              {
                ...params,
                user: user._id,
              } as CreateCompanyAccountDTO,
              session,
            );
            break;
          case UserAccountType.INDIVIDUAL:
            accountCreateResult = await this.registerIndividual(
              {
                ...params,
                user: user._id,
              } as CreateIndividualAccountDTO,
              session,
            );
            break;
          case UserAccountType.ADMIN:
            accountCreateResult = await this.registerAdmin(
              {
                ...params,
                user: user._id,
              } as CreateAdminAccountDTO,
              session,
            );
            break;
          default:
            throw new Error('Invalid account type provided');
        }

        // Set the account reference
        user.account_ref = accountCreateResult._id;
        await user.save({ session });

        const { password, ...result } = user.toObject();
        logger.info('Create user transaction complete', user._id);
        return result;
      });

      const userDetails: any = await this._sharedService.getUser({
        identifier: 'id',
        value: user._id,
      });

      // Generate OTP and send verification email
      const OTP = Helper.generateOTPCode();
      const cacheKey = `${user._id}:verify:mail`;
      await this._redisService.set(cacheKey, OTP, true, 600);

      const emailPayload: SendEmailParams = {
        receiver: user.email,
        subject: EMAIL_DATA.subject.verifyEmail,
        template: EMAIL_DATA.template.verifyEmail,
        context: {
          OTP,
          email: user.email,
          name:
            user.account_type === UserAccountType.COMPANY
              ? userDetails.account_details.name
              : userDetails.account_details.first_name,
        },
      };

      emailQueue.add('mailer', emailPayload, {
        delay: 2000,
        attempts: 5,
        removeOnComplete: true,
      });

      logger.info('User created successfully', user._id);
      return user._id;
    } catch (error) {
      logger.error('Error creating user account:', error);
      throw error;
    } finally {
      session.endSession();
    }
  }

  private async registerCompany(
    params: CreateCompanyAccountDTO,
    session?: mongoose.ClientSession | null,
  ) {
    try {
      // Perform company-specific validation and logic
      const { error, value } = createCompanyAccountDTOValidator.validate(params);
      if (error) {
        logger.error('Validation error', error);
        throw new BadRequestError(error.message);
      }

      // Validate email matches company domain
      const isDomainMatch = await Helper.verifyCompanyDomain(value.website, value.email);
      if (!isDomainMatch) {
        logger.error('Company domain does not match email domain', {
          website: value.website,
          email: value.email,
        });
        throw new BadRequestError('The email domain does not match the company domain.');
      }

      return await this._companyRepo.create({ ...value }, session);
    } catch (error) {
      logger.error('Error creating company account', error);
      throw error;
    }
  }

  private async registerAdmin(
    params: CreateAdminAccountDTO,
    session?: mongoose.ClientSession | null,
  ) {
    try {
      // Perform admin-specific validation and logic
      const { error, value } = createAdminAccountDTOValidator.validate(params);
      if (error) {
        logger.error('Validation error', error);
        throw new BadRequestError(error.message);
      }

      return await this._adminRepo.create({ ...value }, session);
    } catch (error) {
      logger.error('Error creating admin account', error);
      throw error;
    }
  }

  private async registerIndividual(
    params: CreateIndividualAccountDTO,
    session?: mongoose.ClientSession | null,
  ) {
    try {
      // Perform individual-specific validation and logic
      const { error, value } = createIndividualAccountDTOValidator.validate(params);
      if (error) {
        logger.error('Validation error', error);
        throw new BadRequestError(error.message);
      }

      // Validate invitation code

      // Find the company they belong to
      value.company = new mongoose.Types.ObjectId('66d11be3c1a9d88a0bc56f2d');

      // Verify that the email they signup with matches the company own

      // Update invitation data state, share session

      return await this._individualRepo.create({ ...value }, session);
    } catch (error) {
      logger.error('Error creating individual account', error);
      throw error;
    }
  }

  async authenticate(params: LoginDTO) {
    try {
      // Validate user input
      const { error, value } = loginDTOValidator.validate(params);
      if (error) {
        logger.error('Validation error', error);
        throw new BadRequestError(error.message);
      }

      const { identifier, password } = value;
      const isEmail = (identifier as string).includes('@');

      const userCheckParam = isEmail
        ? { identifier: 'email', value: identifier }
        : { identifier: 'phone_number', value: identifier };
      const user = await this._sharedService.getUser(userCheckParam as GetUserParams);
      if (!user) {
        throw new NotFoundError('Invalid credentials, user not found');
      }

      // Compare password
      const isPasswordMatch = await verify(user.password, password);
      if (!isPasswordMatch) {
        throw new BadRequestError('Invalid credentials');
      }

      // TODO: Probably check if user has verified their email and provide follow up flow
      // ...any other required business logic
      const jwtClaim = { sub: user._id, account_type: user.account_type };
      const accessTokenHash = jwt.sign(jwtClaim, process.env.JWT_SECRET!, {
        expiresIn: process.env.JWT_EXPIRES_IN!,
      });
      logger.info('User login successful', user._id);
      return { accessTokenHash, onboarded: user.has_completed_onboarding };
    } catch (error) {
      logger.error('Error logging user in', error);
      throw error;
    }
  }

  async confirmEmail(params: ConfirmEmailDTO) {
    try {
      // Validate user inputs
      const { error, value } = confirmEmailDTOValidator.validate(params);
      if (error) {
        logger.error('Validation error', error);
        throw new BadRequestError(error.message);
      }

      const { email, otp } = value;
      const user = await this._sharedService.getUser({ identifier: 'email', value: email });
      if (!user) {
        throw new NotFoundError('User not found');
      }

      // Lookup to redis to check otp and validate
      const cacheKey = `${user._id}:verify:mail`;
      const cacheValue = await this._redisService.get(cacheKey);
      if (!cacheValue || parseInt(cacheValue) !== parseInt(otp)) {
        throw new BadRequestError('Invalid or expired otp provided');
      }

      // delete from cache and update user data
      await this._redisService.del(cacheKey);
      user.email_verified = true;
      user.verified = true;
      await user.save();
      // Send success email if needed
      logger.info('Email verification successfully', user.email);
      return user._id;
    } catch (error) {
      logger.error('Error verifying user email', error);
      throw error;
    }
  }

  async resendEmailVerificationCode(params: ResendEmailVerificationCodeDTO) {
    try {
      // Validate user inputs
      const { error, value } = resendEmailVerificationCodeDTOValidator.validate(params);
      if (error) {
        logger.error('Validation error', error);
        throw new BadRequestError(error.message);
      }

      const { email } = value;
      const user: any = await this._sharedService.getUser({ identifier: 'email', value: email });
      if (!user) {
        throw new NotFoundError('User not found');
      }

      // Generate OTP and send verification email
      const OTP = Helper.generateOTPCode();
      const cacheKey = `${user._id}:verify:mail`;
      await this._redisService.set(cacheKey, OTP, true, 600);
      const emailPayload: SendEmailParams = {
        receiver: user.email,
        subject: EMAIL_DATA.subject.welcome,
        template: EMAIL_DATA.template.welcome,
        context: {
          email: user.email,
          name:
            user.account_type === UserAccountType.COMPANY
              ? user.account_details.name
              : user.account_details.first_name,
        },
      };

      emailQueue.add('mailer', emailPayload, {
        delay: 2000,
        attempts: 5,
        removeOnComplete: true,
      });

      logger.info('Email verification code resent', user.email);
      return user._id;
    } catch (error) {
      logger.error('Error resending email verification code', error);
      throw error;
    }
  }

  // Onboarding for company/Employee

  // /me
  async me(user_id: string) {
    try {
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

      return hydratedUser;
    } catch (error) {
      logger.error('Error fetching user profile data', error);
      throw error;
    }
  }
}
