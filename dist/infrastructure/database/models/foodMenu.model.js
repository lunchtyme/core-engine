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
exports.FoodMenuModel = exports.FoodCategory = void 0;
const mongoose_1 = __importStar(require("mongoose"));
var FoodCategory;
(function (FoodCategory) {
    FoodCategory["APPETIZER"] = "Appetizer";
    FoodCategory["MAIN_COURSE"] = "Main Course";
    FoodCategory["DESSERT"] = "Dessert";
    FoodCategory["BEVERAGE"] = "Beverage";
    FoodCategory["SALAD"] = "Salad";
    FoodCategory["SOUP"] = "Soup";
    FoodCategory["PASTA"] = "Pasta";
    FoodCategory["PIZZA"] = "Pizza";
    FoodCategory["SEAFOOD"] = "Seafood";
    FoodCategory["VEGETARIAN"] = "Vegetarian";
    FoodCategory["VEGAN"] = "Vegan";
    FoodCategory["GLUTEN_FREE"] = "Gluten-Free";
    FoodCategory["SANDWICH"] = "Sandwich";
    FoodCategory["GRILL"] = "Grill";
    FoodCategory["STEAK"] = "Steak";
    FoodCategory["BURGER"] = "Burger";
    FoodCategory["SIDES"] = "Sides";
    FoodCategory["BREAKFAST"] = "Breakfast";
    FoodCategory["BRUNCH"] = "Brunch";
    FoodCategory["SMOOTHIE"] = "Smoothie";
    FoodCategory["COFFEE"] = "Coffee";
    FoodCategory["TEA"] = "Tea";
    FoodCategory["JUICE"] = "Juice";
    FoodCategory["SNACK"] = "Snack";
    FoodCategory["SPECIALS"] = "Specials";
})(FoodCategory || (exports.FoodCategory = FoodCategory = {}));
const foodMenuSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    food_image: {
        type: String,
    },
    price: {
        type: mongoose_1.Schema.Types.Decimal128,
        required: true,
        default: 0.0,
    },
    categories: {
        type: [String],
        enum: Object.values(FoodCategory),
        required: true,
    },
    available: {
        type: Boolean,
        default: true,
    },
    added_by: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
foodMenuSchema.index({ name: 'text', description: 'text' }, { background: true });
exports.FoodMenuModel = mongoose_1.default.model('FoodMenu', foodMenuSchema);
