"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternalServerError = exports.BadRequestError = exports.UnAuthenticatedError = exports.ForbiddenError = exports.NotFoundError = exports.InternalError = exports.ServiceError = exports.BaseError = void 0;
class BaseError extends Error {
    constructor(message, statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
        this.name = this.constructor.name;
    }
}
exports.BaseError = BaseError;
class ServiceError extends BaseError {
    constructor(message) {
        super(message, 400); // Use 400 for service errors by default
    }
}
exports.ServiceError = ServiceError;
class InternalError extends BaseError {
    constructor(message) {
        super(message, 500);
    }
}
exports.InternalError = InternalError;
class NotFoundError extends ServiceError {
    constructor(message) {
        super(message);
        this.statusCode = 404;
    }
}
exports.NotFoundError = NotFoundError;
class ForbiddenError extends ServiceError {
    constructor(message) {
        super(message);
        this.statusCode = 403;
    }
}
exports.ForbiddenError = ForbiddenError;
class UnAuthenticatedError extends ServiceError {
    constructor(message) {
        super(message);
        this.statusCode = 401;
    }
}
exports.UnAuthenticatedError = UnAuthenticatedError;
class BadRequestError extends ServiceError {
    constructor(message) {
        super(message);
        this.statusCode = 400;
    }
}
exports.BadRequestError = BadRequestError;
class InternalServerError extends InternalError {
    constructor(message) {
        super(message);
    }
}
exports.InternalServerError = InternalServerError;
