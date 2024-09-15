"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CLIENT_BASE_URL = exports.DEFAULT_CACHE_EXPIRY_IN_SECS = exports.EMAIL_DATA = exports.APP_NAME = void 0;
exports.APP_NAME = 'Lunchtyme';
exports.EMAIL_DATA = {
    subject: {
        welcome: `Welcome to ${exports.APP_NAME}`,
        verifyEmail: `Verify your email address`,
        employeeInvitation(companyName) {
            return `${companyName} is inviting you to join ${exports.APP_NAME}`;
        },
        balanceTopup: 'Wallet topup successful',
    },
    template: {
        welcome: 'welcome',
        verifyEmail: 'verifyEmail',
        employeeInvitation: 'employeeInvitation',
        balanceTopup: 'balanceTopup',
    },
};
exports.DEFAULT_CACHE_EXPIRY_IN_SECS = 180;
exports.CLIENT_BASE_URL = 'https://order.lunchtyme.store';
