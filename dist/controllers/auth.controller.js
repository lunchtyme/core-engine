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
exports.meController = exports.resendVerificationCodeController = exports.verifyEmailController = exports.loginController = exports.registerController = void 0;
const utils_1 = require("../utils");
const services_1 = require("../services");
const registerController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield services_1.authService.register(req.body);
        utils_1.Helper.formatAPIResponse(res, 'Account created successfully', result, 201);
    }
    catch (error) {
        next(error);
    }
});
exports.registerController = registerController;
const loginController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield services_1.authService.authenticate(req.body);
        utils_1.Helper.formatAPIResponse(res, 'User logged in successfully', result);
    }
    catch (error) {
        next(error);
    }
});
exports.loginController = loginController;
const verifyEmailController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield services_1.authService.confirmEmail(req.body);
        utils_1.Helper.formatAPIResponse(res, 'Email confirmed successfully', result);
    }
    catch (error) {
        next(error);
    }
});
exports.verifyEmailController = verifyEmailController;
const resendVerificationCodeController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield services_1.authService.resendEmailVerificationCode(req.body);
        utils_1.Helper.formatAPIResponse(res, 'Email verification code resent', result);
    }
    catch (error) {
        next(error);
    }
});
exports.resendVerificationCodeController = resendVerificationCodeController;
const meController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // Extract userId from session claim
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.sub;
        const result = yield services_1.authService.me(userId);
        utils_1.Helper.formatAPIResponse(res, 'Profile fetched', result);
    }
    catch (error) {
        next(error);
    }
});
exports.meController = meController;
