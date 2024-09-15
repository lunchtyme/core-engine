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
exports.IndividualRepository = void 0;
const infrastructure_1 = require("../infrastructure");
const utils_1 = require("../utils");
class IndividualRepository {
    create(params, session) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = new infrastructure_1.IndividualModel(params);
                return yield result.save({ session });
            }
            catch (error) {
                utils_1.logger.error('Error storing individual user to db:', error);
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
                const result = yield infrastructure_1.IndividualModel.updateOne({ user: params.user }, updateQuery, options);
                return result.acknowledged;
            }
            catch (error) {
                utils_1.logger.error('Error updating individual user in db:', error);
                throw error;
            }
        });
    }
    getSpendBalance(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield infrastructure_1.IndividualModel.findOne({ user: userId }, 'spend_balance').lean().exec();
                return (result === null || result === void 0 ? void 0 : result.spend_balance) ? result.spend_balance.toString() : '0.00';
            }
            catch (error) {
                utils_1.logger.error('Error fetching employee spend balance from db:', { error, userId });
                throw error;
            }
        });
    }
    countCompanyEmployees(companyId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Get all employees belonging to this company
                return yield infrastructure_1.IndividualModel.countDocuments({ company: { $in: companyId } }).exec();
            }
            catch (error) {
                throw error;
            }
        });
    }
    topupSpendBalance(params, session) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId, amount } = params;
            const updateQuery = { $inc: { spend_balance: amount } };
            const options = {};
            if (session) {
                options.session = session;
            }
            try {
                const result = yield infrastructure_1.IndividualModel.updateOne({ user: userId }, updateQuery, options);
                return result.acknowledged;
            }
            catch (error) {
                utils_1.logger.error('Error incrementing employee spend balance in db:', { error, params });
                throw error;
            }
        });
    }
    decreaseSpendBalance(params, session) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId, amount } = params;
            const updateQuery = { $inc: { spend_balance: `-${amount}` } };
            const options = {};
            if (session) {
                options.session = session;
            }
            try {
                const result = yield infrastructure_1.IndividualModel.updateOne({ user: userId }, updateQuery, options);
                return result.acknowledged;
            }
            catch (error) {
                utils_1.logger.error('Error decreasing employee spend balance in db:', { error, params });
                throw error;
            }
        });
    }
    getCompanyId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield infrastructure_1.IndividualModel.findById(userId).exec();
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.IndividualRepository = IndividualRepository;
