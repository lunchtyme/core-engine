"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBillingHistoryQuery = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const getBillingHistoryQuery = (filter) => {
    const { companyUserId } = filter;
    const aggregationPipeline = [];
    // Lookup to fetch company details based on the user field
    aggregationPipeline.push({
        $lookup: {
            from: 'companies',
            localField: 'user', // Field from Billing model
            foreignField: 'user', // Field from Company model
            as: 'company_details', // Result field name
        },
    });
    // Unwind company details (preserve empty arrays for bills without a company match)
    aggregationPipeline.push({
        $unwind: {
            path: '$company_details',
            preserveNullAndEmptyArrays: false,
        },
    });
    if (companyUserId) {
        aggregationPipeline.push({
            $match: {
                user: new mongoose_1.default.Types.ObjectId(companyUserId), // Match the user field directly in Billing model
            },
        });
    }
    aggregationPipeline.push({
        $project: {
            _id: 1,
            email: 1,
            amount: { $toString: '$amount' },
            status: 1,
            reference_code: 1,
            type: 1,
            created_at: 1,
            'company_details.name': 1,
            'company_details.spend_balance': { $toString: '$company_details.spend_balance' },
        },
    });
    return aggregationPipeline;
};
exports.getBillingHistoryQuery = getBillingHistoryQuery;
