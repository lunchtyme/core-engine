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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BillingCreateService = void 0;
const utils_1 = require("../utils");
const infrastructure_1 = require("../infrastructure");
const dtos_1 = require("./dtos");
const node_crypto_1 = __importDefault(require("node:crypto"));
const mongoose_1 = __importDefault(require("mongoose"));
const dayjs_1 = __importDefault(require("dayjs"));
const calendar_1 = __importDefault(require("dayjs/plugin/calendar"));
dayjs_1.default.extend(calendar_1.default);
(0, utils_1.loadEnv)(process.env.NODE_ENV);
class BillingCreateService {
    constructor(_companyRepo, _billingRepo, _sharedService, _emailQueue, _logger) {
        this._companyRepo = _companyRepo;
        this._billingRepo = _billingRepo;
        this._sharedService = _sharedService;
        this._emailQueue = _emailQueue;
        this._logger = _logger;
    }
    // Company
    topupWalletBalance(params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { amount, user } = params;
                const { sub, account_type } = user;
                utils_1.Helper.checkUserType(account_type, [infrastructure_1.UserAccountType.COMPANY], 'topup their wallet balance');
                const { error } = dtos_1.CreateBillingDTOValidator.validate(params);
                if (error) {
                    this._logger.error('Validation error', error);
                    throw new utils_1.BadRequestError(error.message);
                }
                const userData = yield this._sharedService.getUserWithDetails({
                    identifier: 'id',
                    value: sub,
                });
                const email = userData.email;
                const reference = yield this._billingRepo.generateUniqueRefCode(13); // Ensures each reference code is unique
                const chargeAmount = amount * 100;
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
                const { data } = yield infrastructure_1.PaystackRequest.post('/transaction/initialize', chargeRequestParams);
                // Create billing record
                const billingRecordParams = {
                    email,
                    user: sub,
                    reference_code: reference,
                    amount: parseFloat(amount.toString()).toFixed(2),
                    type: infrastructure_1.BillingType.WALLET_TOPUP,
                };
                yield this._billingRepo.create(billingRecordParams);
                return data.data.authorization_url;
            }
            catch (error) {
                this._logger.error('Error fetching users lists', error);
                throw error;
            }
        });
    }
    // System
    chargeCompanyWallet(params, session) {
        return __awaiter(this, void 0, void 0, function* () {
            const { companyUserId, email } = params;
            try {
                // Get balance and check  if it's sufficient for order charge
                const companyWalletBalance = yield this._companyRepo.getSpendBalance(companyUserId);
                const companyInfo = yield this._companyRepo.getCompanyByUserId(companyUserId);
                const isSufficientForCharge = parseFloat(companyWalletBalance) >= parseFloat(params.amount);
                if (!isSufficientForCharge) {
                    // Send mail to company
                    const emailPayload = {
                        receiver: companyInfo === null || companyInfo === void 0 ? void 0 : companyInfo.email,
                        subject: utils_1.EMAIL_DATA.subject.chargeFail,
                        template: utils_1.EMAIL_DATA.template.chargeFail,
                        context: {
                            email: companyInfo === null || companyInfo === void 0 ? void 0 : companyInfo.email,
                            amount: params.amount,
                            name: companyInfo === null || companyInfo === void 0 ? void 0 : companyInfo.name,
                        },
                    };
                    yield this._emailQueue.add('mailer', emailPayload, {
                        delay: 2000,
                        attempts: 5,
                        removeOnComplete: true,
                    });
                    throw new utils_1.BadRequestError('Insufficient wallet balance: the remaining balance could not cover your order request');
                }
                const amountInDecimal128 = new mongoose_1.default.Types.Decimal128(params.amount);
                // Dedut from wallet
                yield this._companyRepo.decreaseSpendBalance({
                    companyUserId,
                    spend_balance: amountInDecimal128,
                }, session);
                // Create billing record
                const reference = yield this._billingRepo.generateUniqueRefCode(13); // Ensures each reference code is unique
                const billingRecordParams = {
                    email,
                    user: companyUserId,
                    reference_code: reference,
                    amount: params.amount,
                    type: infrastructure_1.BillingType.ORDER_CHARGE,
                    status: infrastructure_1.BillingStatus.PAID,
                };
                return yield this._billingRepo.create(billingRecordParams, session);
            }
            catch (error) {
                this._logger.error('Error charging company wallet', { error, params });
                throw error;
            }
        });
    }
    // System
    processWebhook(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body, signature } = params;
            // Validate event before starting a session
            const hash = node_crypto_1.default
                .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY)
                .update(JSON.stringify(body))
                .digest('hex');
            if (hash !== signature) {
                this._logger.error('Invalid signature');
                return; // Exit if signature is invalid
            }
            // Start transaction after validation
            const session = yield mongoose_1.default.startSession();
            yield session.startTransaction();
            try {
                if (body.event === 'charge.success') {
                    const { userId, email, reference, companyName } = body.data.metadata;
                    // Ensure billing hasn't already been processed
                    const existingBilling = yield this._billingRepo.getOne({
                        user: userId,
                        reference,
                        status: infrastructure_1.BillingStatus.PAID,
                    });
                    if (existingBilling) {
                        this._logger.warn('Billing already processed.');
                        return;
                    }
                    // Update billing topup status
                    yield this._billingRepo.updateBillingStatus({ user: userId, reference, status: infrastructure_1.BillingStatus.PAID }, session);
                    // Divide amount by 100 to convert from kobo to naira
                    let amount = (body.data.amount / 100).toString();
                    amount = parseFloat(amount).toFixed(2);
                    // Update company spend balance
                    yield this._companyRepo.topupSpendBalance({ companyUserId: userId, spend_balance: new mongoose_1.default.Types.Decimal128(amount) }, session);
                    // Commit transaction before external operations
                    yield session.commitTransaction();
                    // Format the time using calendar
                    const formattedDate = (0, dayjs_1.default)(body.data.paid_at).calendar(null, {
                        sameDay: '[today at] h:mm A',
                        nextDay: '[tomorrow at] h:mm A',
                        nextWeek: 'dddd [at] h:mm A',
                        lastDay: '[yesterday at] h:mm A',
                        lastWeek: '[last] dddd [at] h:mm A',
                        sameElse: 'MMMM D, YYYY [at] h:mm A',
                    });
                    const emailPayload = {
                        receiver: email,
                        subject: utils_1.EMAIL_DATA.subject.balanceTopup,
                        template: utils_1.EMAIL_DATA.template.balanceTopup,
                        context: {
                            email,
                            amount,
                            name: companyName,
                            when: formattedDate,
                        },
                    };
                    // Send email to billing receipt to company outside transaction
                    yield this._emailQueue.add('mailer', emailPayload, {
                        delay: 2000,
                        attempts: 5,
                        removeOnComplete: true,
                    });
                }
                this._logger.info('Webhook process completed');
            }
            catch (error) {
                yield session.abortTransaction();
                this._logger.error('Error processing Paystack webhook', error);
                throw error;
            }
            finally {
                yield session.endSession();
            }
        });
    }
}
exports.BillingCreateService = BillingCreateService;
