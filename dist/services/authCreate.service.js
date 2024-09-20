"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthCreateservice = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const argon2_1 = require("argon2");
const jwt = __importStar(require("jsonwebtoken"));
const utils_1 = require("../utils");
const validators_1 = require("./dtos/validators");
const infrastructure_1 = require("../infrastructure");
const enums_1 = require("../infrastructure/database/models/enums");
class AuthCreateservice {
    constructor(_userRepo, _companyRepo, _adminRepo, _individualRepo, _invitationRepo, _addressRepo, _sharedService, _redisService, _emailQueue, _logger) {
        this._userRepo = _userRepo;
        this._companyRepo = _companyRepo;
        this._adminRepo = _adminRepo;
        this._individualRepo = _individualRepo;
        this._invitationRepo = _invitationRepo;
        this._addressRepo = _addressRepo;
        this._sharedService = _sharedService;
        this._redisService = _redisService;
        this._emailQueue = _emailQueue;
        this._logger = _logger;
    }
    register(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const session = yield mongoose_1.default.startSession();
            try {
                // User specific validation
                const { error, value } = validators_1.createAccountDTOValidator.validate(params);
                if (error) {
                    this._logger.error('Validation error', error);
                    throw new utils_1.BadRequestError(error.message);
                }
                const { email } = value;
                const user = yield session.withTransaction(() => __awaiter(this, void 0, void 0, function* () {
                    const userExist = yield this._sharedService.checkUserExist({
                        identifier: 'email',
                        value: email,
                    });
                    if (userExist) {
                        throw new utils_1.BadRequestError('User already exists');
                    }
                    // Password hashing
                    const hashedPassword = yield (0, argon2_1.hash)(value.password);
                    const user = yield this._userRepo.create(Object.assign(Object.assign({}, value), { password: hashedPassword }), session);
                    let accountCreateResult;
                    switch (params.account_type) {
                        case enums_1.UserAccountType.COMPANY:
                            accountCreateResult = yield this.registerCompany(Object.assign(Object.assign({}, params), { user: user._id }), session);
                            break;
                        case enums_1.UserAccountType.INDIVIDUAL:
                            accountCreateResult = yield this.registerIndividual(Object.assign(Object.assign({}, params), { user: user._id }), session);
                            break;
                        case enums_1.UserAccountType.ADMIN:
                            accountCreateResult = yield this.registerAdmin(Object.assign(Object.assign({}, params), { user: user._id }), session);
                            break;
                        default:
                            throw new Error('Invalid account type provided');
                    }
                    // Set the account reference
                    user.account_ref = accountCreateResult._id;
                    yield user.save({ session });
                    const _a = user.toObject(), { password } = _a, result = __rest(_a, ["password"]);
                    this._logger.info('Create user transaction complete', user._id);
                    return result;
                }));
                const userDetails = yield this._sharedService.getUserWithDetails({
                    identifier: 'id',
                    value: user._id,
                });
                // Generate OTP and send verification email
                const OTP = utils_1.Helper.generateOTPCode();
                const cacheKey = `${user._id}:verify:mail`;
                yield this._redisService.set(cacheKey, OTP, true, 600);
                const emailPayload = {
                    receiver: user.email,
                    subject: utils_1.EMAIL_DATA.subject.verifyEmail,
                    template: utils_1.EMAIL_DATA.template.verifyEmail,
                    context: {
                        OTP,
                        email: user.email,
                        name: user.account_type === enums_1.UserAccountType.COMPANY
                            ? userDetails.account_details.name
                            : userDetails.account_details.first_name,
                    },
                };
                this._emailQueue.add('mailer', emailPayload, {
                    delay: 2000,
                    attempts: 5,
                    removeOnComplete: true,
                });
                this._logger.info('User created successfully', user._id);
                return user._id;
            }
            catch (error) {
                this._logger.error('Error creating user account:', error);
                throw error;
            }
            finally {
                session.endSession();
            }
        });
    }
    registerCompany(params, session) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Perform company-specific validation and logic
                const { error, value } = validators_1.createCompanyAccountDTOValidator.validate(params);
                if (error) {
                    this._logger.error('Validation error', error);
                    throw new utils_1.BadRequestError(error.message);
                }
                // Validate email matches company domain
                const isDomainMatch = yield utils_1.Helper.verifyCompanyDomain(value.website, value.email);
                if (!isDomainMatch) {
                    this._logger.error('Company domain does not match email domain', {
                        website: value.website,
                        email: value.email,
                    });
                    throw new utils_1.BadRequestError('The email domain does not match the company domain.');
                }
                return yield this._companyRepo.create(Object.assign({}, value), session);
            }
            catch (error) {
                this._logger.error('Error creating company account', error);
                throw error;
            }
        });
    }
    registerAdmin(params, session) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Perform admin-specific validation and logic
                const { error, value } = validators_1.createAdminAccountDTOValidator.validate(params);
                if (error) {
                    this._logger.error('Validation error', error);
                    throw new utils_1.BadRequestError(error.message);
                }
                return yield this._adminRepo.create(Object.assign({}, value), session);
            }
            catch (error) {
                this._logger.error('Error creating admin account', error);
                throw error;
            }
        });
    }
    registerIndividual(params, session) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { error, value } = validators_1.createIndividualAccountDTOValidator.validate(params);
                if (error) {
                    this._logger.error('Validation error', error);
                    throw new utils_1.BadRequestError(error.message);
                }
                const invitation = yield this._invitationRepo.getInvitationDetails({
                    employee_work_email: value.email,
                    invitation_code: value.invitation_code,
                });
                const company = yield this._companyRepo.getCompanyByUserId(invitation.user);
                if (!invitation) {
                    throw new utils_1.BadRequestError('Invalid or expired invitation code');
                }
                if (!company) {
                    throw new utils_1.NotFoundError('Company not found');
                }
                value.company = company._id;
                const workMailMatched = yield utils_1.Helper.verifyCompanyDomain(company.email, value.email);
                if (!workMailMatched) {
                    throw new utils_1.BadRequestError("The provided email doesn't match your company email");
                }
                yield this._invitationRepo.updateInvitationStatus({
                    invitationId: invitation._id,
                    status: infrastructure_1.InvitationStatus.ACCEPTED,
                }, session);
                return yield this._individualRepo.create(Object.assign({}, value), session);
            }
            catch (error) {
                this._logger.error('Error creating individual account', error);
                throw error;
            }
        });
    }
    authenticate(params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Validate user input
                const { error, value } = validators_1.loginDTOValidator.validate(params);
                if (error) {
                    this._logger.error('Validation error', error);
                    throw new utils_1.BadRequestError(error.message);
                }
                const { identifier, password } = value;
                const isEmail = identifier.includes('@');
                const userCheckParam = isEmail
                    ? { identifier: 'email', value: identifier }
                    : { identifier: 'phone_number', value: identifier };
                const user = yield this._sharedService.getUser(userCheckParam);
                if (!user) {
                    throw new utils_1.NotFoundError('Invalid credentials, user not found');
                }
                // Compare password
                const isPasswordMatch = yield (0, argon2_1.verify)(user.password, password);
                if (!isPasswordMatch) {
                    throw new utils_1.BadRequestError('Invalid credentials');
                }
                // TODO: Probably check if user has verified their email and provide follow up flow
                // ...any other required business logic
                const jwtClaim = {
                    sub: user._id,
                    account_type: user.account_type,
                    onboarded: user.has_completed_onboarding,
                };
                const accessTokenHash = jwt.sign(jwtClaim, process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_EXPIRES_IN,
                });
                this._logger.info('User login successful', user._id);
                return {
                    accessTokenHash,
                    onboarded: user.has_completed_onboarding,
                    account_type: user.account_type,
                };
            }
            catch (error) {
                this._logger.error('Error logging user in', { error });
                throw error;
            }
        });
    }
    confirmEmail(params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Validate user inputs
                const { error, value } = validators_1.confirmEmailDTOValidator.validate(params);
                if (error) {
                    this._logger.error('Validation error', error);
                    throw new utils_1.BadRequestError(error.message);
                }
                const { email, otp } = value;
                const user = yield this._sharedService.getUserWithDetails({
                    identifier: 'email',
                    value: email,
                });
                if (!user) {
                    throw new utils_1.NotFoundError('User not found');
                }
                // Lookup to redis to check otp and validate
                const cacheKey = `${user._id}:verify:mail`;
                const cacheValue = yield this._redisService.get(cacheKey);
                if (!cacheValue || parseInt(cacheValue) !== parseInt(otp)) {
                    throw new utils_1.BadRequestError('Invalid or expired otp provided');
                }
                // delete from cache and update user data
                yield this._redisService.del(cacheKey);
                user.email_verified = true;
                user.verified = true;
                yield user.save();
                // Send success email if needed
                const emailPayload = {
                    receiver: user.email,
                    subject: utils_1.EMAIL_DATA.subject.welcome,
                    template: utils_1.EMAIL_DATA.template.welcome,
                    context: {
                        email: user.email,
                        name: user.account_type === enums_1.UserAccountType.COMPANY
                            ? user.account_details.name
                            : user.account_details.first_name,
                    },
                };
                this._logger.info('Email verification successfully', user.email);
                return user._id;
            }
            catch (error) {
                this._logger.error('Error verifying user email', error);
                throw error;
            }
        });
    }
    resendEmailVerificationCode(params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Validate user inputs
                const { error, value } = validators_1.resendEmailVerificationCodeDTOValidator.validate(params);
                if (error) {
                    this._logger.error('Validation error', error);
                    throw new utils_1.BadRequestError(error.message);
                }
                const { email } = value;
                const user = yield this._sharedService.getUserWithDetails({
                    identifier: 'email',
                    value: email,
                });
                if (!user) {
                    throw new utils_1.NotFoundError('User not found');
                }
                // Generate OTP and send verification email
                const OTP = utils_1.Helper.generateOTPCode();
                const cacheKey = `${user._id}:verify:mail`;
                yield this._redisService.set(cacheKey, OTP, true, 600);
                const emailPayload = {
                    receiver: user.email,
                    subject: utils_1.EMAIL_DATA.subject.verifyEmail,
                    template: utils_1.EMAIL_DATA.template.verifyEmail,
                    context: {
                        OTP,
                        email: user.email,
                        name: user.account_type === enums_1.UserAccountType.COMPANY
                            ? user.account_details.name
                            : user.account_details.first_name,
                    },
                };
                infrastructure_1.emailQueue.add('mailer', emailPayload, {
                    delay: 2000,
                    attempts: 5,
                    removeOnComplete: true,
                });
                this._logger.info('Email verification code resent', user.email);
                return user._id;
            }
            catch (error) {
                this._logger.error('Error resending email verification code', error);
                throw error;
            }
        });
    }
    processUserOnboarding(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const session = yield mongoose_1.default.startSession();
            try {
                const user = yield this._sharedService.getUser({
                    identifier: 'id',
                    value: params.user,
                });
                // Process address creation:
                yield session.withTransaction(() => __awaiter(this, void 0, void 0, function* () {
                    yield this.createAddress(params, session);
                    switch (user.account_type) {
                        case enums_1.UserAccountType.COMPANY:
                            yield this.processCompanyOnboardingData(Object.assign(Object.assign({}, params), { user: user._id }), session);
                            break;
                        case enums_1.UserAccountType.INDIVIDUAL:
                            yield this.processEmployeeOnboardingData(Object.assign(Object.assign({}, params), { user: user._id }), session);
                            break;
                        default:
                            throw new Error('Account type not recognized');
                    }
                }));
                // Update user: set onboarded to true
                user.has_completed_onboarding = true;
                user.save({ session });
                this._logger.info('User onboarded', user._id);
                return user._id;
            }
            catch (error) {
                this._logger.error('Error processing user onboarding', error);
                throw error;
            }
            finally {
                yield session.endSession();
            }
        });
    }
    createAddress(params, session) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { error, value } = validators_1.createAddressDTOValidator.validate(params);
                if (error) {
                    this._logger.error('Validation error', error);
                    throw new utils_1.BadRequestError(error.message);
                }
                // check if user has already create an address
                const isDuplicateAddress = yield this._addressRepo.checkIfExist(params.user);
                if (isDuplicateAddress) {
                    throw new utils_1.BadRequestError('Address already created, update instead');
                }
                const result = yield this._addressRepo.create(value, session);
                this._logger.info('Address created', result._id);
                return result._id;
            }
            catch (error) {
                this._logger.error('Error creating address', error);
                throw error;
            }
        });
    }
    processEmployeeOnboardingData(params, session) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { error, value } = validators_1.employeeOnboardingDTOValidator.validate(params);
                if (error) {
                    this._logger.error('Validation error', error);
                    throw new utils_1.BadRequestError(error.message);
                }
                return yield this._individualRepo.update(value, session);
            }
            catch (error) {
                this._logger.error('Error processing employee onboarding data', error);
                throw error;
            }
        });
    }
    processCompanyOnboardingData(params, session) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { error, value } = validators_1.companyOnboardingDTOValidator.validate(params);
                if (error) {
                    this._logger.error('Validation error', error);
                    throw new utils_1.BadRequestError(error.message);
                }
                return yield this._companyRepo.update(value, session);
            }
            catch (error) {
                this._logger.error('Error processing company onboarding data', error);
                throw error;
            }
        });
    }
}
exports.AuthCreateservice = AuthCreateservice;
