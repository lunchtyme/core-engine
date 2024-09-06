"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_CACHE_EXPIRY_IN_SECS = exports.EMAIL_DATA = exports.APP_NAME = void 0;
exports.APP_NAME = 'Lunchtyme';
exports.EMAIL_DATA = {
    subject: {
        welcome: `Welcome to ${exports.APP_NAME}`,
        verifyEmail: `Verify your email address`,
    },
    template: {
        welcome: 'welcome',
        verifyEmail: 'verifyEmail',
    },
};
exports.DEFAULT_CACHE_EXPIRY_IN_SECS = 180;
