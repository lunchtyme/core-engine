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
exports.CompanyRepository = void 0;
const infrastructure_1 = require("../infrastructure");
const logger_1 = __importDefault(require("../utils/logger"));
class CompanyRepository {
    create(params, session) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = new infrastructure_1.CompanyModel(params);
                return yield result.save({ session });
            }
            catch (error) {
                logger_1.default.error('Error storing company to db:', error);
                throw error;
            }
        });
    }
    update(params, session) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updateQuery = Object.assign({}, params);
                const options = {};
                if (session) {
                    options.session = session;
                }
                const result = yield infrastructure_1.CompanyModel.updateOne({ user: params.user }, updateQuery, options);
                return result.acknowledged;
            }
            catch (error) {
                logger_1.default.error('Error updating company user in db:', error);
                throw error;
            }
        });
    }
    getCompanyByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield infrastructure_1.CompanyModel.findOne({ user: userId }).exec();
            }
            catch (error) {
                throw error;
            }
        });
    }
    getCompanyById(companyId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield infrastructure_1.CompanyModel.findOne({ _id: companyId }).exec();
            }
            catch (error) {
                throw error;
            }
        });
    }
    topupSpendBalance(params, session) {
        return __awaiter(this, void 0, void 0, function* () {
            const { companyUserId, spend_balance } = params;
            const updateQuery = { $inc: { spend_balance: spend_balance } };
            const options = {};
            if (session) {
                options.session = session;
            }
            try {
                const result = yield infrastructure_1.CompanyModel.updateOne({ user: companyUserId }, updateQuery, options);
                return result.acknowledged;
            }
            catch (error) {
                logger_1.default.error('Error incrementing company spend balance in db:', { error, params });
                throw error;
            }
        });
    }
    decreaseSpendBalance(params, session) {
        return __awaiter(this, void 0, void 0, function* () {
            const { companyUserId, spend_balance } = params;
            const updateQuery = { $inc: { spend_balance: `-${spend_balance}` } };
            const options = {};
            if (session) {
                options.session = session;
            }
            try {
                const result = yield infrastructure_1.CompanyModel.updateOne({ user: companyUserId }, updateQuery, options);
                return result.acknowledged;
            }
            catch (error) {
                logger_1.default.error('Error decreasing company spend balance in db:', { error, params });
                throw error;
            }
        });
    }
    getSpendBalance(companyUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield infrastructure_1.CompanyModel.findOne({ user: companyUserId }, 'spend_balance')
                    .lean()
                    .exec();
                return (result === null || result === void 0 ? void 0 : result.spend_balance) ? result.spend_balance.toString() : '0.00';
            }
            catch (error) {
                logger_1.default.error('Error fetching company spend balance from db:', { error, companyUserId });
                throw error;
            }
        });
    }
}
exports.CompanyRepository = CompanyRepository;
