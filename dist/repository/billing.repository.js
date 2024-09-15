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
exports.BillingRepository = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const infrastructure_1 = require("../infrastructure");
const utils_1 = require("../utils");
const base_repository_1 = require("./base.repository");
class BillingRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(infrastructure_1.BillingModel);
    }
    create(params, session) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { user, amount, reference_code, type, email } = params;
                const result = new infrastructure_1.BillingModel({
                    user,
                    reference_code,
                    email,
                    type,
                    amount: new mongoose_1.default.Types.Decimal128(amount),
                });
                return yield result.save({ session });
            }
            catch (error) {
                utils_1.logger.error('Error saving billing info:', { error, params });
                throw error;
            }
        });
    }
    generateUniqueRefCode() {
        return __awaiter(this, arguments, void 0, function* (length = 8) {
            let code;
            let isUnique = false;
            while (!isUnique) {
                code = utils_1.Helper.generateRandomToken(length);
                const existingRefCode = yield infrastructure_1.BillingModel.findOne({ reference_code: code }).exec();
                if (!existingRefCode) {
                    isUnique = true;
                }
            }
            return code;
        });
    }
    updateBillingStatus(params, session) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { user, status, reference } = params;
                const updateQuery = { status };
                const options = {};
                if (session) {
                    options.session = session;
                }
                const result = yield infrastructure_1.BillingModel.updateOne({ user, reference_code: reference }, updateQuery, options);
                return result.acknowledged;
            }
            catch (error) {
                utils_1.logger.error('Error updating billing status:', { error, params });
                throw error;
            }
        });
    }
    getOne(params, session) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { user, status, reference } = params;
                const sess = session !== null && session !== void 0 ? session : null;
                return yield infrastructure_1.BillingModel.findOne({ user, status, reference_code: reference })
                    .session(sess)
                    .exec();
            }
            catch (error) {
                throw error;
            }
        });
    }
    getTotalAmountSpentByMe(companyUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const totalSpent = yield infrastructure_1.BillingModel.aggregate([
                    { $match: { user: companyUserId, status: infrastructure_1.BillingStatus.PAID } },
                    { $group: { _id: null, totalAmount: { $sum: { $toDecimal: '$amount' } } } },
                    { $project: { _id: 0, totalAmount: { $toString: '$totalAmount' } } },
                ]);
                return totalSpent.length > 0 ? totalSpent[0].totalAmount : '0'; // Return the total spent as a string
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.BillingRepository = BillingRepository;
