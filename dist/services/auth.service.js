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
                // Password hashing
                const hashedPassword = yield (0, argon2_1.hash)(params.password);
                const user = yield this._userRepo.create(Object.assign(Object.assign({}, params), { password: hashedPassword }), session);
                let accountCreateResult;
                switch (params.account_type) {
                    case user_1.UserAccountType.COMPANY:
                        accountCreateResult = yield this.registerCompany(params);
                        break;
                    case user_1.UserAccountType.INDIVIDUAL:
                        accountCreateResult = yield this.registerIndividual(params);
                        break;
                    case user_1.UserAccountType.ADMIN:
                        accountCreateResult = yield this.registerAdmin(params);
                        break;
                    default:
                        throw new Error('Invalid account type provided');
                }
                // OTP and email queues
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
    authenticate() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
}
exports.Authservice = Authservice;
