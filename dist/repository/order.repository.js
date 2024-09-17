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
exports.OrderRepository = void 0;
const infrastructure_1 = require("../infrastructure");
const base_repository_1 = require("./base.repository");
const logger_1 = __importDefault(require("../utils/logger"));
class OrderRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(infrastructure_1.OrderModel);
    }
    create(customerId, foodItems, totalAmount, orderId, session) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = new infrastructure_1.OrderModel({
                    customer_id: customerId,
                    food_items: foodItems,
                    order_id: orderId,
                    total_amount: totalAmount,
                });
                return yield result.save({ session });
            }
            catch (error) {
                throw error;
            }
        });
    }
    // get all orders
    getAllOrderCount() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield infrastructure_1.OrderModel.countDocuments().exec();
            }
            catch (error) {
                throw error;
            }
        });
    }
    // Get all employee order count
    countEmployeeOrders(employeeId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield infrastructure_1.OrderModel.countDocuments({ customer_id: employeeId }).exec();
            }
            catch (error) {
                throw error;
            }
        });
    }
    // Get company employees orders count
    countCompanyEmployeeOrders(companyId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Get all employees belonging to this company
                const employeeIds = yield infrastructure_1.IndividualModel.distinct('_id', { company: companyId });
                return yield infrastructure_1.OrderModel.countDocuments({ user: { $in: employeeIds } }).exec(); // Company: Orders where user is one of the employees
            }
            catch (error) {
                throw error;
            }
        });
    }
    updateOrderStatus(orderId, newStatus) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const order = yield infrastructure_1.OrderModel.findByIdAndUpdate(orderId, { status: newStatus }, { new: true });
                if (!order) {
                    throw new Error('Order not found');
                }
                logger_1.default.info('Order status updated successfully');
                return order;
            }
            catch (error) {
                logger_1.default.error('Error updating order status availability', { error, orderId });
                throw error;
            }
        });
    }
}
exports.OrderRepository = OrderRepository;
