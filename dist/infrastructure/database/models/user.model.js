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
exports.UserModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const user_1 = require("../../../typings/user");
const userSchema = new mongoose_1.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    account_type: {
        type: String,
        enum: [user_1.UserAccountType.ADMIN, user_1.UserAccountType.COMPANY, user_1.UserAccountType.INDIVIDUAL],
        required: true,
    },
    account_ref: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: false,
        refPath: 'account_type', // Dynamically reference based on the account type
    },
    email_verified: {
        type: Boolean,
        default: false,
    },
    verified: {
        type: Boolean,
        default: false,
    },
    account_state: {
        type: String,
        enum: [
            user_1.UserAccountState.ACTIVE,
            user_1.UserAccountState.LOCKED,
            user_1.UserAccountState.INACTIVE,
            user_1.UserAccountState.SUSPENDED,
        ],
        default: user_1.UserAccountState.ACTIVE,
        required: true,
    },
    dial_code: {
        type: String,
    },
    phone_number: {
        type: String,
    },
    time_zone: {
        type: String,
        required: true,
    },
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
userSchema.index({ email: 1, account_ref: 1, account_state: 1, account_type: 1 }, { background: true });
userSchema.virtual('account_details', {
    ref: (doc) => doc.account_type,
    localField: 'account_ref',
    foreignField: '_id',
    justOne: true,
});
exports.UserModel = mongoose_1.default.model('User', userSchema);
