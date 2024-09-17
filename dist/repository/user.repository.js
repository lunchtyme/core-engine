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
exports.UserRepository = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const base_repository_1 = require("./base.repository");
const infrastructure_1 = require("../infrastructure");
const enums_1 = require("../infrastructure/database/models/enums");
const logger_1 = __importDefault(require("../utils/logger"));
class UserRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(infrastructure_1.UserModel);
    }
    create(params, session) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = new infrastructure_1.UserModel(params);
                return yield result.save({ session });
            }
            catch (error) {
                logger_1.default.error('Error storing user to db:', error);
                throw error;
            }
        });
    }
    getUser(params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { identifier, value } = params;
                const getUserFilterOptions = identifier === 'email'
                    ? { email: value }
                    : identifier === 'id'
                        ? {
                            _id: mongoose_1.default.Types.ObjectId.isValid(value)
                                ? new mongoose_1.default.Types.ObjectId(value)
                                : value,
                        }
                        : identifier === 'phone_number'
                            ? { phone_number: value }
                            : {};
                return yield infrastructure_1.UserModel.findOne(getUserFilterOptions).exec();
            }
            catch (error) {
                logger_1.default.error('Error getting user data from db:', error);
                throw error;
            }
        });
    }
    getUserWithDetails(params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { identifier, value } = params;
                const getUserFilterOptions = identifier === 'email'
                    ? { email: value }
                    : identifier === 'id'
                        ? {
                            _id: mongoose_1.default.Types.ObjectId.isValid(value)
                                ? new mongoose_1.default.Types.ObjectId(value)
                                : value,
                        }
                        : identifier === 'phone_number'
                            ? { phone_number: value }
                            : {};
                return yield infrastructure_1.UserModel.findOne(getUserFilterOptions)
                    .select('-password')
                    .populate('account_details')
                    .exec();
            }
            catch (error) {
                logger_1.default.error('Error getting user data from db:', error);
                throw error;
            }
        });
    }
    checkUserExist(params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { identifier, value } = params;
                let getUserFilterOptions = identifier === 'email'
                    ? { email: value }
                    : {
                        _id: mongoose_1.default.Types.ObjectId.isValid(value)
                            ? new mongoose_1.default.Types.ObjectId(value)
                            : value,
                    };
                const user = yield infrastructure_1.UserModel.exists(getUserFilterOptions).exec();
                return !!user;
            }
            catch (error) {
                logger_1.default.error('Error checking user exist from db:', error);
                throw error;
            }
        });
    }
    // Admin: Count all non-admin users
    getAllUserCount() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield infrastructure_1.UserModel.countDocuments({
                    account_type: { $ne: enums_1.UserAccountType.ADMIN },
                }).exec();
            }
            catch (error) {
                throw error;
            }
        });
    }
    // Admin: Count total employees
    getAllEmployeeCount() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield infrastructure_1.UserModel.countDocuments({ account_type: enums_1.UserAccountType.INDIVIDUAL }).exec();
            }
            catch (error) {
                throw error;
            }
        });
    }
    // Admin: Count total companies
    getAllCompanyCount() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield infrastructure_1.UserModel.countDocuments({ account_type: enums_1.UserAccountType.COMPANY }).exec();
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.UserRepository = UserRepository;
