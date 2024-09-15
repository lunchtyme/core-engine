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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BillingModel = exports.BillingStatus = exports.BillingType = void 0;
const mongoose_1 = __importStar(require("mongoose"));
// Define an enum for billing types
var BillingType;
(function (BillingType) {
    BillingType["WALLET_TOPUP"] = "wallet_topup";
    BillingType["ORDER_CHARGE"] = "order_charge";
})(BillingType || (exports.BillingType = BillingType = {}));
// Define an enum for billing status
var BillingStatus;
(function (BillingStatus) {
    BillingStatus["PENDING"] = "pending";
    BillingStatus["PAID"] = "paid";
    BillingStatus["FAILED"] = "failed";
    BillingStatus["CANCELED"] = "canceled";
})(BillingStatus || (exports.BillingStatus = BillingStatus = {}));
// Define the Billing schema
const BillingSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    email: { type: String, required: true },
    amount: { type: mongoose_1.Schema.Types.Decimal128, required: true },
    status: {
        type: String,
        enum: Object.values(BillingStatus),
        default: BillingStatus.PENDING,
    },
    reference_code: { type: String, required: true, unique: true },
    type: {
        type: String,
        enum: Object.values(BillingType),
        required: true,
    },
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
// Add a compound index for efficient filtering and sorting
BillingSchema.index({ status: 1, amount: -1, type: 1, createdAt: -1, updatedAt: -1 });
// Create the Billing model
exports.BillingModel = mongoose_1.default.model('Billing', BillingSchema);
