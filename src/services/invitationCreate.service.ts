import { UserAccountType } from '../infrastructure';
import { emailQueue } from '../infrastructure/queue/emailQueue';
import { InvitationRepository } from '../repository';

import {
  APP_NAME,
  BadRequestError,
  CLIENT_BASE_URL,
  EMAIL_DATA,
  Helper,
  SendEmailParams,
} from '../utils';
import logger from '../utils/logger';
import { CreateInvitationDTO } from './dtos/request.dto';
import { CreateInvitationDTOValidator } from './dtos/validators';
import { SharedServices } from './shared.service';

export class InvitationCreateService {
  constructor(
    private readonly _invitationRepo: InvitationRepository,
    private readonly _sharedService: SharedServices,
    private readonly _emailQueue: typeof emailQueue,
    private readonly _logger: typeof logger,
  ) {}

  async createOrResendInvitation(params: CreateInvitationDTO) {
    try {
      const { value, error } = CreateInvitationDTOValidator.validate(params);
      if (error) {
        this._logger.error('Validation error', error);
        throw new BadRequestError(error.message);
      }
      const { employee_work_email, user } = value;
      const [company, validInvitationExists] = await Promise.all([
        this._sharedService.getUserWithDetails({ identifier: 'id', value: user }),
        this._invitationRepo.validInvitationExists({ employee_work_email, user }),
      ]);
      // RBAC check
      Helper.checkUserType(
        company.account_type,
        [UserAccountType.COMPANY],
        'send employee invitations',
      );
      if (validInvitationExists) {
        throw new BadRequestError("You've have a pending invitation for this employee set already");
      }
      const invitationCode = await this._invitationRepo.generateUniqueInvitationToken();
      const result = await this._invitationRepo.upsert({
        employee_work_email,
        user,
        invitation_token: invitationCode,
        expires_at: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // Expires in 3 days
      });
      const companyName = (company as any).account_details.name;
      const emailPayload: SendEmailParams = {
        receiver: employee_work_email,
        subject: EMAIL_DATA.subject.employeeInvitation(companyName),
        template: EMAIL_DATA.template.employeeInvitation,
        from: `"${companyName} \(via ${APP_NAME}\)" <noreply@lunchtyme.store>`,
        context: {
          companyName,
          invitationCode,
          signupURL: `${CLIENT_BASE_URL}/signup`,
          email: employee_work_email,
        },
      };
      await this._emailQueue.add('mailer', emailPayload, {
        delay: 2000,
        attempts: 5,
        removeOnComplete: true,
      });
      return result;
    } catch (error) {
      this._logger.error('Failed to create invitations', error);
      throw error;
    }
  }

  async deleteInvitation() {}

  async updateInvitationStatus() {}
}
