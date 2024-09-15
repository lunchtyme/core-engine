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
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrderStatusController = exports.fetchOrders = exports.createOrderController = void 0;
const utils_1 = require("../utils");
const services_1 = require("../services");
const createOrderController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const params = {
            foodItems: req.body.foodItems,
            user: req.user,
        };
        const result = yield services_1.orderCreateService.createOrder(params);
        utils_1.Helper.formatAPIResponse(res, 'Order enqueue for processing', result);
    }
    catch (error) {
        next(error);
    }
});
exports.createOrderController = createOrderController;
const fetchOrders = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { limit, lastId } = req.query;
        const getOrderHistoryDTO = {
            user: req.user,
            limit: limit ? parseInt(limit, 10) : 10,
            lastId: lastId || undefined,
        };
        const result = yield services_1.orderReadService.getOrderHistory(getOrderHistoryDTO);
        utils_1.Helper.formatAPIResponse(res, 'Order data fetched', result);
    }
    catch (error) {
        next(error);
    }
});
exports.fetchOrders = fetchOrders;
const updateOrderStatusController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield services_1.orderCreateService.updateOrderStatus({
            newStatus: req.body.newStatus,
            orderId: req.body.orderId,
        });
        utils_1.Helper.formatAPIResponse(res, 'Order status updated', result);
    }
    catch (error) {
        next(error);
    }
});
exports.updateOrderStatusController = updateOrderStatusController;
