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
exports.InvitationModel = exports.InvitationStatus = void 0;
const mongoose_1 = __importStar(require("mongoose"));
/**
 * Enum for invitation statuses.
 */
var InvitationStatus;
(function (InvitationStatus) {
    /**
     * Invitation is pending and waiting for a response.
     */
    InvitationStatus["PENDING"] = "PENDING";
    /**
     * Invitation has been accepted by the recipient.
     */
    InvitationStatus["ACCEPTED"] = "ACCEPTED";
    /**
     * Invitation has been declined by the recipient.
     */
    InvitationStatus["DECLINED"] = "DECLINED";
    /**
     * Invitation has expired and is no longer valid.
     */
    InvitationStatus["EXPIRED"] = "EXPIRED";
    /**
     * Invitation has been abandoned and is no longer valid.
     */
    InvitationStatus["ABANDONED"] = "ABANDONED";
})(InvitationStatus || (exports.InvitationStatus = InvitationStatus = {}));
const invitationSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    employee_work_email: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: [
            InvitationStatus.PENDING,
            InvitationStatus.ACCEPTED,
            InvitationStatus.DECLINED,
            InvitationStatus.EXPIRED,
            InvitationStatus.ABANDONED,
        ],
        default: InvitationStatus.PENDING,
    },
    invitation_token: {
        type: String,
        required: true,
        unique: true,
    },
    expires_at: {
        type: Date,
        required: true,
    },
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
exports.InvitationModel = mongoose_1.default.model('Invitation', invitationSchema);
