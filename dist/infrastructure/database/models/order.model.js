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
exports.OrderModel = exports.OrderStatus = void 0;
const mongoose_1 = __importStar(require("mongoose"));
var OrderStatus;
(function (OrderStatus) {
    OrderStatus["PENDING"] = "PENDING";
    OrderStatus["CONFIRMED"] = "CONFIRMED";
    OrderStatus["DELIVERED"] = "DELIVERED";
    OrderStatus["CANCELLED"] = "CANCELLED";
})(OrderStatus || (exports.OrderStatus = OrderStatus = {}));
const orderSchema = new mongoose_1.Schema({
    customer_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    food_items: [
        {
            food_menu: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: 'FoodMenu', // Reference to the FoodMenu model
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
        },
    ],
    total_amount: {
        type: mongoose_1.Schema.Types.Decimal128,
        required: true,
        default: 0.0,
    },
    status: {
        type: String,
        enum: [
            OrderStatus.PENDING,
            OrderStatus.DELIVERED,
            OrderStatus.CONFIRMED,
            OrderStatus.CANCELLED,
        ],
        default: OrderStatus.PENDING,
    },
    order_date: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
orderSchema.index({ status: 1, order_date: 1 }, { background: true });
exports.OrderModel = mongoose_1.default.model('Order', orderSchema);
