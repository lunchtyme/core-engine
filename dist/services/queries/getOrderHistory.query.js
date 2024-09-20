"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrderHistoryQuery = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
// @ts-ignore
const getOrderHistoryQuery = (filter) => {
    const { employeeId } = filter;
    const aggregationPipeline = [];
    // Lookup to fetch employee details based on the user field
    aggregationPipeline.push({
        $lookup: {
            from: 'individuals',
            localField: 'customer_id',
            foreignField: 'user',
            as: 'employee_details',
        },
    });
    aggregationPipeline.push({
        $unwind: {
            path: '$employee_details',
            preserveNullAndEmptyArrays: false,
        },
    });
    if (employeeId) {
        aggregationPipeline.push({
            $match: {
                customer_id: new mongoose_1.default.Types.ObjectId(employeeId),
            },
        });
    }
    aggregationPipeline.push({
        $project: {
            _id: 1,
            total_amount: { $toString: '$total_amount' },
            status: 1,
            created_at: 1,
            order_date: 1,
            'employee_details.first_name': 1,
            'employee_details.last_name': 1,
        },
    });
    return aggregationPipeline;
};
exports.getOrderHistoryQuery = getOrderHistoryQuery;
