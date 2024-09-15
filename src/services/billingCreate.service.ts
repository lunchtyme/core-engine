import {
  AdminRepository,
  BillingRepository,
  CompanyRepository,
  IndividualRepository,
  UserRepository,
} from '../repository';
import { SharedServices } from './shared.service';
import {
  BadRequestError,
  DEFAULT_CACHE_EXPIRY_IN_SECS,
  EMAIL_DATA,
  Helper,
  loadEnv,
  logger,
  SendEmailParams,
} from '../utils';
import { RedisService } from './redis.service';
import { CreateBillingDTO, SaveBillingDTO } from './dtos/request.dto';
import { BillingStatus, BillingType, emailQueue, PaystackRequest } from '../infrastructure';
import { AuthUserClaim, UserAccountType } from '../typings/user';
import { CreateBillingDTOValidator } from './dtos';
import crypto from 'node:crypto';
import mongoose from 'mongoose';
import dayjs from 'dayjs';
import calendar from 'dayjs/plugin/calendar';

dayjs.extend(calendar);

loadEnv(process.env.NODE_ENV!);

export class BillingCreateService {
  constructor(
    private readonly _companyRepo: CompanyRepository,
    private readonly _individualRepo: IndividualRepository,
    private readonly _billingRepo: BillingRepository,
    private readonly _sharedService: SharedServices,
    private readonly _redisService: RedisService,
    private readonly _emailQueue: typeof emailQueue,
    private readonly _logger: typeof logger,
  ) {}

  // Company
  async topupWalletBalance(params: CreateBillingDTO) {
    try {
      const { error } = CreateBillingDTOValidator.validate(params);
      if (error) {
        this._logger.error('Validation error', error);
        throw new BadRequestError(error.message);
      }
      const { amount, user } = params;
      const { sub, account_type } = user as AuthUserClaim;
      Helper.checkUserType(account_type, [UserAccountType.COMPANY], 'topup their wallet balance');
      const userData: any = await this._sharedService.getUserWithDetails({
        identifier: 'id',
        value: sub,
      });
      const email = userData.email;
      const reference = await this._billingRepo.generateUniqueRefCode(13); // Ensures each reference code is unique
      const chargeAmount = (amount as number) * 100;
      const chargeRequestParams = {
        email,
        reference,
        amount: chargeAmount,
        currency: 'NGN',
        channels: ['card'],
        metadata: {
          email,
          reference,
          userId: sub,
          companyName: userData.account_details.name,
        },
      };
      const { data } = await PaystackRequest.post('/transaction/initialize', chargeRequestParams);

      // Create billing record
      const billingRecordParams: SaveBillingDTO = {
        email,
        user: sub,
        reference_code: reference,
        amount: parseFloat(amount.toString()).toFixed(2),
        type: BillingType.WALLET_TOPUP,
      };

      await this._billingRepo.create(billingRecordParams);
      return data.data.authorization_url;
    } catch (error) {
      this._logger.error('Error fetching users lists', error);
      throw error;
    }
  }

  // System
  async chargeWallet() {
    try {
    } catch (error) {
      this._logger.error('Error fetching employee lists', error);
      throw error;
    }
  }

  // System
  async processWebhook(params: { body: any; signature: string }) {
    const { body, signature } = params;

    // Validate event before starting a session
    const hash = crypto
      .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY!)
      .update(JSON.stringify(body))
      .digest('hex');
    if (hash !== signature) {
      this._logger.error('Invalid signature');
      return; // Exit if signature is invalid
    }

    // Start transaction after validation
    const session = await mongoose.startSession();
    await session.startTransaction();

    try {
      if (body.event === 'charge.success') {
        const { userId, email, reference, companyName } = body.data.metadata;

        // Ensure billing hasn't already been processed
        const existingBilling = await this._billingRepo.getOne({
          user: userId,
          reference,
          status: BillingStatus.PAID,
        });
        if (existingBilling) {
          this._logger.warn('Billing already processed.');
          return;
        }

        // Update billing topup status
        await this._billingRepo.updateBillingStatus(
          { user: userId, reference, status: BillingStatus.PAID },
          session,
        );

        // Divide amount by 100 to convert from kobo to naira
        let amount = ((body.data.amount as number) / 100).toString();
        amount = parseFloat(amount).toFixed(2);

        // Update company spend balance
        await this._companyRepo.topupSpendBalance(
          { companyUserId: userId, spend_balance: new mongoose.Types.Decimal128(amount) },
          session,
        );

        // Commit transaction before external operations
        await session.commitTransaction();

        // Format the time using calendar
        const formattedDate = dayjs(body.data.paid_at).calendar(null, {
          sameDay: '[today at] h:mm A',
          nextDay: '[tomorrow at] h:mm A',
          nextWeek: 'dddd [at] h:mm A',
          lastDay: '[yesterday at] h:mm A',
          lastWeek: '[last] dddd [at] h:mm A',
          sameElse: 'MMMM D, YYYY [at] h:mm A',
        });

        const emailPayload: SendEmailParams = {
          receiver: email,
          subject: EMAIL_DATA.subject.balanceTopup,
          template: EMAIL_DATA.template.balanceTopup,
          context: {
            email,
            amount,
            name: companyName,
            when: formattedDate,
          },
        };

        // Send email to billing receipt to company outside transaction
        this._emailQueue.add('mailer', emailPayload, {
          delay: 2000,
          attempts: 5,
          removeOnComplete: true,
        });
      }
      this._logger.info('Webhook process completed');
    } catch (error) {
      await session.abortTransaction();
      this._logger.error('Error processing Paystack webhook', error);
      throw error;
    } finally {
      await session.endSession();
    }
  }
}
