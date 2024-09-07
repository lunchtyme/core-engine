"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvitationCreateService = void 0;
const user_1 = require("../typings/user");
const utils_1 = require("../utils");
const validators_1 = require("./dtos/validators");
class InvitationCreateService {
    constructor(_invitationRepo, _sharedService, _emailQueue, _logger) {
        this._invitationRepo = _invitationRepo;
        this._sharedService = _sharedService;
        this._emailQueue = _emailQueue;
        this._logger = _logger;
    }
    createOrResendInvitation(params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { value, error } = validators_1.CreateInvitationDTOValidator.validate(params);
                if (error) {
                    this._logger.error('Validation error', error);
                    throw new utils_1.BadRequestError(error.message);
                }
                const { employee_work_email, user } = value;
                const [company, validInvitationExists] = yield Promise.all([
                    this._sharedService.getUserWithDetails({ identifier: 'id', value: user }),
                    this._invitationRepo.validInvitationExists({ employee_work_email, user }),
                ]);
                if (company.account_type !== user_1.UserAccountType.COMPANY) {
                    throw new utils_1.ForbiddenError('Only companies can send employee invitations.');
                }
                if (validInvitationExists) {
                    throw new utils_1.BadRequestError("You've have a pending invitation for this employee set already");
                }
                const invitatationCode = yield this._invitationRepo.generateUniqueInvitationToken();
                const result = yield this._invitationRepo.upsert(Object.assign(Object.assign({}, value), { invitation_token: invitatationCode, expires_at: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) }));
                const companyName = company.account_details.name;
                const emailPayload = {
                    receiver: employee_work_email,
                    subject: utils_1.EMAIL_DATA.subject.employeeInvitation(companyName),
                    template: utils_1.EMAIL_DATA.template.employeeInvitation,
                    context: {
                        companyName,
                        invitatationCode,
                        signupURL: `${utils_1.CLIENT_BASE_URL}/auth/signup`,
                        email: employee_work_email,
                    },
                };
                this._emailQueue.add('mailer', emailPayload, {
                    delay: 2000,
                    attempts: 5,
                    removeOnComplete: true,
                });
                return result;
            }
            catch (error) {
                this._logger.error('Failed to create invitations', error);
                throw error;
            }
        });
    }
    deleteInvitation() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    updateInvitationStatus() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
}
exports.InvitationCreateService = InvitationCreateService;
