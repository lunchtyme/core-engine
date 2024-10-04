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
exports.HealthInfoModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const healthInfoSchema = new mongoose_1.Schema({
    allergies: {
        type: [String],
        required: true,
    },
    medical_conditions: {
        type: [String],
        required: true,
    },
    dietary_preferences: {
        type: [String],
        required: true,
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
// Pre-save hook to transform health-related fields
healthInfoSchema.pre('save', function (next) {
    // Transform allergies to lowercase and snake_case
    this.allergies = this.allergies.map((allergen) => allergen.toLowerCase().replace(/\s+/g, '_'));
    // Transform medical_conditions to lowercase and snake_case
    this.medical_conditions = this.medical_conditions.map((condition) => condition.toLowerCase().replace(/\s+/g, '_'));
    // Transform dietary_preferences to lowercase and snake_case
    this.dietary_preferences = this.dietary_preferences.map((preference) => preference.toLowerCase().replace(/\s+/g, '_'));
    // Proceed to the next middleware or save
    next();
});
// Create indexes for the fields
healthInfoSchema.index({ allergies: 1 }, { background: true });
healthInfoSchema.index({ medical_conditions: 1 }, { background: true });
healthInfoSchema.index({ dietary_preferences: 1 }, { background: true });
exports.HealthInfoModel = mongoose_1.default.model('HealthInfo', healthInfoSchema);
