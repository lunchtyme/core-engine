"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorMiddleware = void 0;
const globalErrorMiddleware = (err, req, res, next) => {
    var _a;
    const errStatusCode = (_a = err.errStatusCode) !== null && _a !== void 0 ? _a : 500;
    const errMessage = err instanceof Error
        ? err.message
        : 'An internal server error occurred. Please try again later.';
    res.status(errStatusCode).json({
        success: false,
        message: errMessage,
        data: null,
    });
};
exports.globalErrorMiddleware = globalErrorMiddleware;
