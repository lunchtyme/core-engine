import mongoose from 'mongoose';
import {
  AddressRepository,
  AdminRepository,
  CompanyRepository,
  GetUserParams,
  IndividualRepository,
  InvitationRepository,
  UserRepository,
} from '../repository';
import {
  CompanyOnboardingDTO,
  ConfirmEmailDTO,
  CreateAddressDTO,
  CreateAdminAccountDTO,
  CreateCompanyAccountDTO,
  CreateIndividualAccountDTO,
  EmployeeOnboardingDTO,
  InitiatePasswordResetDTO,
  LoginDTO,
  OnboardingUserDTO,
  RegisterAccountDTO,
  ResendEmailVerificationCodeDTO,
  ResetPasswordDTO,
} from './dtos/request.dto';
import { SharedServices } from './shared.service';
import { hash, verify } from 'argon2';
import * as jwt from 'jsonwebtoken';
import { BadRequestError, EMAIL_DATA, Helper, NotFoundError, SendEmailParams } from '../utils';
import { RedisService } from './redis.service';
import {
  companyOnboardingDTOValidator,
  confirmEmailDTOValidator,
  createAccountDTOValidator,
  createAddressDTOValidator,
  createAdminAccountDTOValidator,
  createCompanyAccountDTOValidator,
  createIndividualAccountDTOValidator,
  employeeOnboardingDTOValidator,
  initiatePasswordResetDTOValidator,
  loginDTOValidator,
  resendEmailVerificationCodeDTOValidator,
  resetPasswordDTOValidator,
} from './dtos/validators';
import { InvitationStatus } from '../infrastructure';
import { UserAccountType } from '../infrastructure/database/models/enums';
import logger from '../utils/logger';
import { emailQueue } from '../infrastructure/queue/emailQueue';
import { HealthInfoCreateService } from './healthInfoCreate.service';
import { AuthUserClaim } from '../typings/user';

export class AuthCreateservice {
  constructor(
    private readonly _userRepo: UserRepository,
    private readonly _companyRepo: CompanyRepository,
    private readonly _adminRepo: AdminRepository,
    private readonly _individualRepo: IndividualRepository,
    private readonly _invitationRepo: InvitationRepository,
    private readonly _addressRepo: AddressRepository,
    private readonly _sharedService: SharedServices,
    private readonly _redisService: RedisService,
    private readonly _healthInfoCreateService: HealthInfoCreateService,
    private readonly _emailQueue: typeof emailQueue,
    private readonly _logger: typeof logger,
  ) {}

  async register(params: RegisterAccountDTO) {
    const session = await mongoose.startSession();
    try {
      // User specific validation
      const { error, value } = createAccountDTOValidator.validate(params);
      if (error) {
        this._logger.error('Validation error', error);
        throw new BadRequestError(error.message);
      }
      const { email } = value;
      const user = await session.withTransaction(async () => {
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
        this._logger.info('Create user transaction complete', user._id);
        return result;
      });

      const userDetails: any = await this._sharedService.getUserWithDetails({
        identifier: 'id',
        value: user._id as mongoose.Types.ObjectId,
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

      await this._emailQueue.add('mailer', emailPayload, {
        delay: 2000,
        attempts: 5,
        removeOnComplete: true,
      });

      this._logger.info('User created successfully', user._id);
      return user._id;
    } catch (error) {
      this._logger.error('Error creating user account:', error);
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
        this._logger.error('Validation error', error);
        throw new BadRequestError(error.message);
      }

      // Validate email matches company domain
      const isDomainMatch = await Helper.verifyCompanyDomain(value.website, value.email);
      if (!isDomainMatch) {
        this._logger.error('Company domain does not match email domain', {
          website: value.website,
          email: value.email,
        });
        throw new BadRequestError('The email domain does not match the company domain.');
      }

      return await this._companyRepo.create({ ...value }, session);
    } catch (error) {
      this._logger.error('Error creating company account', error);
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
        this._logger.error('Validation error', error);
        throw new BadRequestError(error.message);
      }

      return await this._adminRepo.create({ ...value }, session);
    } catch (error) {
      this._logger.error('Error creating admin account', error);
      throw error;
    }
  }

  private async registerIndividual(
    params: CreateIndividualAccountDTO,
    session?: mongoose.ClientSession | null,
  ) {
    try {
      const { error, value } = createIndividualAccountDTOValidator.validate(params);
      if (error) {
        this._logger.error('Validation error', error);
        throw new BadRequestError(error.message);
      }
      const invitation: any = await this._invitationRepo.getInvitationDetails({
        employee_work_email: value.email,
        invitation_code: value.invitation_code,
      });
      const company = await this._companyRepo.getCompanyByUserId(
        invitation.user as mongoose.Types.ObjectId,
      );
      if (!invitation) {
        throw new BadRequestError('Invalid or expired invitation code');
      }
      if (!company) {
        throw new NotFoundError('Company not found');
      }
      value.company = company._id;
      const workMailMatched = await Helper.verifyCompanyDomain(company.email, value.email);
      if (!workMailMatched) {
        throw new BadRequestError("The provided email doesn't match your company email");
      }
      await this._invitationRepo.updateInvitationStatus(
        {
          invitationId: invitation._id,
          status: InvitationStatus.ACCEPTED,
        },
        session,
      );
      return await this._individualRepo.create({ ...value }, session);
    } catch (error) {
      this._logger.error('Error creating individual account', error);
      throw error;
    }
  }

  async authenticate(params: LoginDTO) {
    try {
      // Validate user input
      const { error, value } = loginDTOValidator.validate(params);
      if (error) {
        this._logger.error('Validation error', error);
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
      const jwtClaim = {
        sub: user._id,
        account_type: user.account_type,
        onboarded: user.has_completed_onboarding,
      };
      const accessTokenHash = jwt.sign(jwtClaim, process.env.JWT_SECRET!, {
        expiresIn: process.env.JWT_EXPIRES_IN!,
      });
      this._logger.info('User login successful', user._id);
      return {
        accessTokenHash,
        onboarded: user.has_completed_onboarding,
        account_type: user.account_type,
      };
    } catch (error) {
      this._logger.error('Error logging user in', { error });
      throw error;
    }
  }

  async confirmEmail(params: ConfirmEmailDTO) {
    try {
      // Validate user inputs
      const { error, value } = confirmEmailDTOValidator.validate(params);
      if (error) {
        this._logger.error('Validation error', error);
        throw new BadRequestError(error.message);
      }
      const { email, otp } = value;
      const user: any = await this._sharedService.getUserWithDetails({
        identifier: 'email',
        value: email,
      });
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
      this._logger.info('Email verification successfully', user.email);
      return user._id;
    } catch (error) {
      this._logger.error('Error verifying user email', error);
      throw error;
    }
  }

  async resendEmailVerificationCode(params: ResendEmailVerificationCodeDTO) {
    try {
      // Validate user inputs
      const { error, value } = resendEmailVerificationCodeDTOValidator.validate(params);
      if (error) {
        this._logger.error('Validation error', error);
        throw new BadRequestError(error.message);
      }
      const { email } = value;
      const user: any = await this._sharedService.getUserWithDetails({
        identifier: 'email',
        value: email,
      });
      if (!user) {
        throw new NotFoundError('User not found');
      }
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
              ? user.account_details.name
              : user.account_details.first_name,
        },
      };
      emailQueue.add('mailer', emailPayload, {
        delay: 2000,
        attempts: 5,
        removeOnComplete: true,
      });
      this._logger.info('Email verification code resent', user.email);
      return user._id;
    } catch (error) {
      this._logger.error('Error resending email verification code', error);
      throw error;
    }
  }

  async processUserOnboarding(params: OnboardingUserDTO) {
    const session = await mongoose.startSession();
    try {
      const user = await this._sharedService.getUser({
        identifier: 'id',
        value: (params.user as AuthUserClaim).sub as mongoose.Types.ObjectId,
      });
      // Process address creation:
      await session.withTransaction(async () => {
        await this.createAddress(params, session);
        switch (user.account_type) {
          case UserAccountType.COMPANY:
            await this.processCompanyOnboardingData(
              {
                ...params,
                user: user._id,
              } as CompanyOnboardingDTO,
              session,
            );
            break;
          case UserAccountType.INDIVIDUAL:
            await this.processEmployeeOnboardingData(
              {
                ...params,
                user: params.user as AuthUserClaim,
              } as EmployeeOnboardingDTO,
              session,
            );
            break;
          default:
            throw new Error('Account type not recognized');
        }
      });

      // Update user: set onboarded to true
      user.has_completed_onboarding = true;
      user.save({ session });
      this._logger.info('User onboarded', user._id);
      return user._id;
    } catch (error) {
      this._logger.error('Error processing user onboarding', error);
      throw error;
    } finally {
      await session.endSession();
    }
  }

  private async createAddress(params: CreateAddressDTO, session?: mongoose.ClientSession | null) {
    try {
      const { error, value } = createAddressDTOValidator.validate(params);
      if (error) {
        this._logger.error('Validation error', error);
        throw new BadRequestError(error.message);
      }
      // check if user has already create an address
      const isDuplicateAddress = await this._addressRepo.checkIfExist(
        (params.user as AuthUserClaim).sub as mongoose.Types.ObjectId,
      );
      if (isDuplicateAddress) {
        throw new BadRequestError('Address already created, update instead');
      }
      const result = await this._addressRepo.create(
        { ...value, user: (params.user as AuthUserClaim).sub as mongoose.Types.ObjectId },
        session,
      );
      this._logger.info('Address created', result._id);
      return result._id;
    } catch (error) {
      this._logger.error('Error creating address', error);
      throw error;
    }
  }

  private async processEmployeeOnboardingData(
    params: EmployeeOnboardingDTO,
    session?: mongoose.ClientSession | null,
  ) {
    try {
      const { error, value } = employeeOnboardingDTOValidator.validate(params);
      if (error) {
        this._logger.error('Validation error', error);
        throw new BadRequestError(error.message);
      }
      const healthInfoParams = {
        allergies: value.allergies,
        medical_conditions: value.medical_conditions,
        dietary_preferences: value.dietary_preferences,
        user: value.user as AuthUserClaim,
      };
      const userId = (value.user as AuthUserClaim).sub as mongoose.Types.ObjectId;
      await this._individualRepo.update({ ...value, user: userId }, session);
      // Store user health information
      await this._healthInfoCreateService.addUserHealthInfo(healthInfoParams, session);
    } catch (error) {
      this._logger.error('Error processing employee onboarding data', error);
      throw error;
    }
  }

  private async processCompanyOnboardingData(
    params: CompanyOnboardingDTO,
    session?: mongoose.ClientSession | null,
  ) {
    try {
      const { error, value } = companyOnboardingDTOValidator.validate(params);
      if (error) {
        this._logger.error('Validation error', error);
        throw new BadRequestError(error.message);
      }
      return await this._companyRepo.update(value, session);
    } catch (error) {
      this._logger.error('Error processing company onboarding data', error);
      throw error;
    }
  }

  async initatePasswordReset(params: InitiatePasswordResetDTO) {
    try {
      const { error, value } = initiatePasswordResetDTOValidator.validate(params);
      if (error) {
        this._logger.error('Validation error', error);
        throw new BadRequestError(error.message);
      }
      const { email } = value;
      const user: any = await this._sharedService.getUserWithDetails({
        identifier: 'email',
        value: email,
      });
      const cacheKey = `${user._id}:verify:mail`;
      const OTP = Helper.generateOTPCode();
      await this._redisService.set(cacheKey, OTP, true, 600);

      const emailPayload: SendEmailParams = {
        receiver: user.email,
        subject: EMAIL_DATA.subject.initPasswordReset,
        template: EMAIL_DATA.template.initPasswordReset,
        context: {
          OTP,
          email: user.email,
          name:
            user.account_type === UserAccountType.COMPANY
              ? user.account_details.name
              : user.account_details.first_name,
        },
      };

      await this._emailQueue.add('mailer', emailPayload, {
        delay: 2000,
        attempts: 5,
        removeOnComplete: true,
      });

      this._logger.info('Password reset flow initiated', user._id);
      return email;
    } catch (error) {
      this._logger.error('Error initiating password reset flow', { error });
      throw error;
    }
  }

  async resetPassword(params: ResetPasswordDTO) {
    try {
      const { error, value } = resetPasswordDTOValidator.validate(params);
      if (error) {
        this._logger.error('Validation error', error);
        throw new BadRequestError(error.message);
      }

      const { otp, email, password } = value;
      const user: any = await this._sharedService.getUserWithDetails({
        identifier: 'email',
        value: email,
      });
      const cacheKey = `${user._id}:verify:mail`;
      const cacheValue = await this._redisService.get(cacheKey);
      if (!cacheValue || parseInt(cacheValue) !== parseInt(otp)) {
        throw new BadRequestError('Invalid or expired otp provided');
      }
      await this._redisService.del(cacheKey);
      user.password = await hash(password);
      await user.save();
      const emailPayload: SendEmailParams = {
        receiver: user.email,
        subject: EMAIL_DATA.subject.passwordReset,
        template: EMAIL_DATA.template.passwordReset,
        context: {
          email: user.email,
          name:
            user.account_type === UserAccountType.COMPANY
              ? user.account_details.name
              : user.account_details.first_name,
        },
      };

      await this._emailQueue.add('mailer', emailPayload, {
        delay: 2000,
        attempts: 5,
        removeOnComplete: true,
      });
      this._logger.info('Password reset successful', user.email);
      return email;
    } catch (error) {
      this._logger.error('Error resetting password', { error });
      throw error;
    }
  }
}
