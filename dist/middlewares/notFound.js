"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundMiddleware = void 0;
const notFoundMiddleware = (req, res, next) => {
    return res.status(404).json({
        message: 'Not Found',
        status: 404,
    });
};
exports.notFoundMiddleware = notFoundMiddleware;
