"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CLIENT_BASE_URL = exports.DEFAULT_CACHE_EXPIRY_IN_SECS = exports.EMAIL_DATA = exports.APP_NAME = void 0;
const infrastructure_1 = require("../infrastructure");
exports.APP_NAME = 'Lunchtyme';
exports.EMAIL_DATA = {
    subject: {
        welcome: `Welcome to ${exports.APP_NAME}`,
        verifyEmail: `Verify your email address`,
        employeeInvitation(companyName) {
            return `${companyName} is inviting you to join ${exports.APP_NAME}`;
        },
        balanceTopup: 'Wallet topup successful',
        orderReciept(orderId) {
            return `Order [${orderId}] confirmation receipt`;
        },
        orderUpdated(orderId, status) {
            // Use switch to choose right subject
            let msg = `has been updated`;
            switch (status) {
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
            return `Order [${orderId}] ${msg}`;
        },
        walletCharge: 'Your wallet was charged',
        chargeFail: 'Insufficient wallet balance',
        dailyNotification: "Check out today's menu for your lunch",
        initPasswordReset: `Request to reset ${exports.APP_NAME} password`,
        passwordReset: 'Password reset successful',
    },
    template: {
        welcome: 'welcome',
        verifyEmail: 'verifyEmail',
        employeeInvitation: 'employeeInvitation',
        balanceTopup: 'balanceTopup',
        orderReceipt: 'orderReceipt',
        walletCharge: 'walletCharge',
        chargeFail: 'chargeFail',
        dailyNotification: 'dailyNotification',
        orderUpdated: 'orderUpdated',
        initPasswordReset: 'initPasswordReset',
        passwordReset: 'passwordReset',
    },
};
exports.DEFAULT_CACHE_EXPIRY_IN_SECS = 180;
exports.CLIENT_BASE_URL = 'https://order.lunchtyme.store';
