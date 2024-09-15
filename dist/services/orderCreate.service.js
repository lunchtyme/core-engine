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
exports.OrderCreateService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const user_1 = require("../typings/user");
const utils_1 = require("../utils");
class OrderCreateService {
    constructor(_orderRepo, _foodMenuRepo, _individualRepo, _companyRepo, _logger) {
        this._orderRepo = _orderRepo;
        this._foodMenuRepo = _foodMenuRepo;
        this._individualRepo = _individualRepo;
        this._companyRepo = _companyRepo;
        this._logger = _logger;
    }
    createOrder(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const session = yield mongoose_1.default.startSession();
            try {
                const { foodItems, user } = params;
                utils_1.Helper.checkUserType(user.account_type, [user_1.UserAccountType.INDIVIDUAL], 'create an order');
                if (!user.sub || !mongoose_1.default.Types.ObjectId.isValid(user.sub)) {
                    throw new utils_1.BadRequestError('Invalid customer ID');
                }
                if (!foodItems || !Array.isArray(foodItems) || foodItems.length === 0) {
                    throw new utils_1.BadRequestError('At least one food item must be provided');
                }
                // Step 2: Calculate the total amount
                let totalAmount = 0;
                yield session.startTransaction();
                for (const item of foodItems) {
                    if (!item.food_menu || !mongoose_1.default.Types.ObjectId.isValid(item.food_menu)) {
                        throw new utils_1.BadRequestError('Invalid food menu ID');
                    }
                    // Find the food menu item from the database
                    const foodMenu = yield this._foodMenuRepo.getOne(item.food_menu);
                    if (!foodMenu) {
                        throw new utils_1.BadRequestError(`Food menu item not found for ID: ${item.food_menu}`);
                    }
                    // Calculate the price for the item
                    const itemTotal = parseFloat(foodMenu.price.toString()) * item.quantity;
                    totalAmount += itemTotal;
                }
                totalAmount = new mongoose_1.default.Types.Decimal128(totalAmount.toString());
                const result = yield this._orderRepo.create(user.sub, foodItems, totalAmount, session);
                const data = yield this._individualRepo.getCompanyId(user.sub);
                const companyInfo = yield this._companyRepo.getCompanyById(data === null || data === void 0 ? void 0 : data.company);
                // Update by deducting the spend balances for both company alone for now
                yield this._companyRepo.decreaseSpendBalance({
                    companyUserId: companyInfo === null || companyInfo === void 0 ? void 0 : companyInfo.user,
                    spend_balance: totalAmount,
                }, session);
                yield session.commitTransaction();
                return result._id;
            }
            catch (error) {
                this._logger.error('Error creating order', { error });
                yield session.abortTransaction();
                throw error;
            }
            finally {
                yield session.endSession();
            }
        });
    }
    updateOrderStatus(params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this._orderRepo.updateOrderStatus(params.orderId, params.newStatus);
                // Send emails for order status
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.OrderCreateService = OrderCreateService;
