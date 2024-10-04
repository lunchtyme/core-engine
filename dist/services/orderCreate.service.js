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
const utils_1 = require("../utils");
const infrastructure_1 = require("../infrastructure");
const dayjs_1 = __importDefault(require("dayjs"));
const calendar_1 = __importDefault(require("dayjs/plugin/calendar"));
dayjs_1.default.extend(calendar_1.default);
class OrderCreateService {
    constructor(_orderRepo, _foodMenuRepo, _individualRepo, _companyRepo, _billingCreateService, _emailQueue, _sharedService, _logger) {
        this._orderRepo = _orderRepo;
        this._foodMenuRepo = _foodMenuRepo;
        this._individualRepo = _individualRepo;
        this._companyRepo = _companyRepo;
        this._billingCreateService = _billingCreateService;
        this._emailQueue = _emailQueue;
        this._sharedService = _sharedService;
        this._logger = _logger;
    }
    createOrder(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const session = yield mongoose_1.default.startSession();
            try {
                const { foodItems, user } = params;
                utils_1.Helper.checkUserType(user.account_type, [infrastructure_1.UserAccountType.INDIVIDUAL], 'create an order');
                if (!user.sub || !mongoose_1.default.Types.ObjectId.isValid(user.sub)) {
                    throw new utils_1.BadRequestError('Invalid customer ID');
                }
                if (!foodItems || !Array.isArray(foodItems) || foodItems.length === 0) {
                    throw new utils_1.BadRequestError('At least one food item must be provided');
                }
                // Step 2: Calculate the total amount
                let totalAmount = 0;
                let items = [];
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
                    items.push({
                        name: foodMenu.name,
                        quantity: item.quantity,
                        price: foodMenu.price.toString(),
                    });
                    // Calculate the price for the item
                    const itemTotal = parseFloat(foodMenu.price.toString()) * item.quantity;
                    totalAmount += itemTotal;
                }
                totalAmount = parseFloat(totalAmount).toFixed(2);
                const [employeeInfo, employeeData] = yield Promise.all([
                    this._individualRepo.getOneByUserId(user.sub),
                    this._sharedService.getUser({ identifier: 'id', value: user.sub }),
                ]);
                const companyInfo = yield this._companyRepo.getCompanyById(employeeInfo === null || employeeInfo === void 0 ? void 0 : employeeInfo.company);
                // Charge company wallet
                yield this._billingCreateService.chargeCompanyWallet({
                    amount: totalAmount,
                    companyUserId: companyInfo === null || companyInfo === void 0 ? void 0 : companyInfo.user,
                    email: employeeData.email,
                }, session);
                // Store order deets
                const orderId = `lunch:${utils_1.Helper.generateRandomToken(7)}`;
                const result = yield this._orderRepo.create(user.sub, foodItems, new mongoose_1.default.Types.Decimal128(totalAmount), orderId, session);
                yield session.commitTransaction();
                // Format the time using calendar
                const formattedDate = (0, dayjs_1.default)(new Date()).calendar(null, {
                    sameDay: '[today at] h:mm A',
                    nextDay: '[tomorrow at] h:mm A',
                    nextWeek: 'dddd [at] h:mm A',
                    lastDay: '[yesterday at] h:mm A',
                    lastWeek: '[last] dddd [at] h:mm A',
                    sameElse: 'MMMM D, YYYY [at] h:mm A',
                });
                // Send charge email to company
                const companyEmailPayload = {
                    receiver: companyInfo === null || companyInfo === void 0 ? void 0 : companyInfo.email,
                    subject: utils_1.EMAIL_DATA.subject.walletCharge,
                    template: utils_1.EMAIL_DATA.template.walletCharge,
                    context: {
                        items,
                        email: companyInfo === null || companyInfo === void 0 ? void 0 : companyInfo.email,
                        amount: totalAmount,
                        name: companyInfo === null || companyInfo === void 0 ? void 0 : companyInfo.name,
                        when: formattedDate,
                    },
                };
                // Send order comfirmation email to employee
                const orderConfirmationEmailPayload = {
                    receiver: employeeData === null || employeeData === void 0 ? void 0 : employeeData.email,
                    subject: utils_1.EMAIL_DATA.subject.orderReciept(orderId),
                    template: utils_1.EMAIL_DATA.template.orderReceipt,
                    context: {
                        items,
                        orderId,
                        email: employeeData === null || employeeData === void 0 ? void 0 : employeeData.email,
                        amount: totalAmount,
                        name: `${employeeInfo === null || employeeInfo === void 0 ? void 0 : employeeInfo.first_name} ${employeeInfo === null || employeeInfo === void 0 ? void 0 : employeeInfo.last_name}`,
                        when: formattedDate,
                    },
                };
                yield this._emailQueue.add('mailer', companyEmailPayload, {
                    delay: 2000,
                    attempts: 5,
                    removeOnComplete: true,
                });
                yield this._emailQueue.add('mailer', orderConfirmationEmailPayload, {
                    delay: 2000,
                    attempts: 5,
                    removeOnComplete: true,
                });
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
                utils_1.Helper.checkUserType(params.user.account_type, [infrastructure_1.UserAccountType.ADMIN]);
                const order = yield this._orderRepo.updateOrderStatus(params.orderId, params.newStatus);
                const [employeeData, employeeInfo] = yield Promise.all([
                    this._sharedService.getUser({
                        identifier: 'id',
                        value: order.customer_id,
                    }),
                    this._individualRepo.getOneByUserId(order.customer_id),
                ]);
                // Use switch to choose right subject
                let msg = `has been updated`;
                switch (order.status) {
                    case infrastructure_1.OrderStatus.CONFIRMED:
                        msg = ' has been confirmed for delivery';
                        break;
                    case infrastructure_1.OrderStatus.CANCELLED:
                        msg = 'has been cancelled';
                        break;
                    case infrastructure_1.OrderStatus.DELIVERED:
                        msg = 'is on it way to you';
                        break;
                    default:
                        msg = msg;
                        break;
                }
                // Send emails for order status
                const emailPayload = {
                    receiver: employeeData === null || employeeData === void 0 ? void 0 : employeeData.email,
                    subject: utils_1.EMAIL_DATA.subject.orderUpdated(order.order_id, order.status),
                    template: utils_1.EMAIL_DATA.template.orderUpdated,
                    context: {
                        msg,
                        orderId: order.order_id,
                        email: employeeData === null || employeeData === void 0 ? void 0 : employeeData.email,
                        name: `${employeeInfo === null || employeeInfo === void 0 ? void 0 : employeeInfo.first_name} ${employeeInfo === null || employeeInfo === void 0 ? void 0 : employeeInfo.last_name}`,
                        orderStatus: order.status,
                    },
                };
                yield this._emailQueue.add('mailer', emailPayload, {
                    delay: 2000,
                    attempts: 5,
                    removeOnComplete: true,
                });
                return order._id;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.OrderCreateService = OrderCreateService;
