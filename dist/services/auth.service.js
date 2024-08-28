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
exports.Authservice = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const user_1 = require("../typings/user");
const argon2_1 = require("argon2");
const jwt = __importStar(require("jsonwebtoken"));
const utils_1 = require("../utils");
class Authservice {
    constructor(userRepo, companyRepo, adminRepo, individualRepo, sharedService) {
        this._userRepo = userRepo;
        this._companyRepo = companyRepo;
        this._adminRepo = adminRepo;
        this._individualRepo = individualRepo;
        this._sharedService = sharedService;
    }
    register(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const session = yield mongoose_1.default.startSession();
            try {
                const { email } = params;
                const userExist = yield this._sharedService.checkUserExist({
                    identifier: 'email',
                    value: email,
                });
                if (userExist) {
                    throw new Error('User already exist');
                }
                // User specific validation
                // Password hashing
                const hashedPassword = yield (0, argon2_1.hash)(params.password);
                const user = yield this._userRepo.create(Object.assign(Object.assign({}, params), { password: hashedPassword }), session);
                let accountCreateResult;
                switch (params.account_type) {
                    case user_1.UserAccountType.COMPANY:
                        accountCreateResult = yield this.registerCompany(Object.assign(Object.assign({}, params), { user: user._id }));
                        break;
                    case user_1.UserAccountType.INDIVIDUAL:
                        accountCreateResult = yield this.registerIndividual(Object.assign(Object.assign({}, params), { user: user._id }));
                        break;
                    case user_1.UserAccountType.ADMIN:
                        accountCreateResult = yield this.registerAdmin(Object.assign(Object.assign({}, params), { user: user._id }));
                        break;
                    default:
                        throw new Error('Invalid account type provided');
                }
                const OTP = utils_1.Helper.generateOTPCode();
                //  put verify email on queue
                // Set the account reference
                user.account_ref = accountCreateResult._id;
                yield user.save({ session });
                const _a = user.toObject(), { password } = _a, result = __rest(_a, ["password"]);
                return result;
            }
            catch (error) {
                throw error;
            }
            finally {
                yield session.endSession();
            }
        });
    }
    registerCompany(params, session) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Perform company-specific validation and logic
                return yield this._companyRepo.create(Object.assign({}, params), session);
            }
            catch (error) {
                throw error;
            }
        });
    }
    registerAdmin(params, session) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Perform admin-specific validation and logic
                return yield this._adminRepo.create(Object.assign({}, params), session);
            }
            catch (error) {
                throw error;
            }
        });
    }
    registerIndividual(params, session) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Perform individual-specific validation and logic
                return yield this._individualRepo.create(Object.assign({}, params), session);
            }
            catch (error) {
                throw error;
            }
        });
    }
    authenticate(params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { identifier, password } = params;
                // Validate user input
                const userCheckParam = identifier === 'email'
                    ? { identifier: 'email', value: identifier }
                    : { identifier: 'phone_number', value: identifier };
                const user = yield this._sharedService.getUser(userCheckParam);
                if (!user) {
                    throw new Error('Invalid credentials, user not found');
                }
                // Compare password
                const isPasswordMatch = yield (0, argon2_1.verify)(user.password, password);
                if (!isPasswordMatch) {
                    throw new Error('Invalid credentials');
                }
                // TODO: Probably check if user has verified their email and provide follow up flow
                // ...any other required business logic
                const jwtClaim = { sub: user._id };
                const accessTokenHash = jwt.sign(jwtClaim, process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_EXPIRES_IN,
                });
                return accessTokenHash;
            }
            catch (error) {
                throw error;
            }
        });
    }
    confirmEmail(params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, otp } = params;
                // Validate user inputs
                const user = yield this._sharedService.getUser({ identifier: 'email', value: email });
                if (!user) {
                    throw new Error('User not found');
                }
                // Lookup to redis to check otp and validate
                // Update user info
                user.email_verified = true;
                user.verified = true;
                yield user.save();
                // Send success email
                return user._id;
            }
            catch (error) {
                throw error;
            }
        });
    }
    resendEmailVerificationCode(params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = params;
                // Validate user inputs
                const user = yield this._sharedService.getUser({ identifier: 'email', value: email });
                if (!user) {
                    throw new Error('User not found');
                }
                // Generate OTP and send verification email
                const OTP = utils_1.Helper.generateOTPCode();
                return user._id;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.Authservice = Authservice;
