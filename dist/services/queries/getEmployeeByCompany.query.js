"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEmployeeAccountsByCompany = void 0;
const enums_1 = require("../../infrastructure/database/models/enums");
const getEmployeeAccountsByCompany = (filter) => {
    const { query, companyId } = filter;
    const aggregationPipeline = [];
    // Match users with account_type as Individual
    aggregationPipeline.push({
        $match: { account_type: enums_1.UserAccountType.INDIVIDUAL },
    });
    // If there's a text query, match and sort by textScore
    if (query) {
        aggregationPipeline.push({
            $match: { $text: { $search: query } },
        });
        aggregationPipeline.push({
            $addFields: { score: { $meta: 'textScore' } },
        });
        aggregationPipeline.push({
            $sort: { score: { $meta: 'textScore' } },
        });
    }
    // Add a lookup to get individual details based on account_ref
    aggregationPipeline.push({
        $lookup: {
            from: 'individuals',
            localField: 'account_ref',
            foreignField: '_id',
            as: 'account_details',
        },
    });
    // Unwind account_details to work with a single document
    aggregationPipeline.push({
        $unwind: {
            path: '$account_details',
            preserveNullAndEmptyArrays: false, // Exclude documents without individual details
        },
    });
    // Match to ensure the individual is associated with the provided companyId
    aggregationPipeline.push({
        $match: { 'account_details.company': companyId },
    });
    // Optionally, project fields required in the response, without mixing inclusion and exclusion
    aggregationPipeline.push({
        $project: {
            _id: 1,
            // spend_balance: {
            //   $toString: '$account_details.spend_balance',
            // },
            'account_details.first_name': 1,
            'account_details.last_name': 1,
            'account_details.company': 1,
            'account_details.spend_balance': { $toString: '$account_details.spend_balance' },
            email: 1,
            account_type: 1,
            email_verified: 1,
            verified: 1,
            account_state: 1,
            dial_code: 1,
            phone_number: 1,
            time_zone: 1,
            has_completed_onboarding: 1,
            created_at: 1,
        },
    });
    return aggregationPipeline;
};
exports.getEmployeeAccountsByCompany = getEmployeeAccountsByCompany;
