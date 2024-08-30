"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Helper = void 0;
class Helper {
    static generateOTPCode() {
        return Math.floor(Math.random() * 900000)
            .toString()
            .padStart(6, '0');
    }
    // Utility function for API response
    static APIJSONResponse(params) {
        return {
            success: true,
            message: params.message,
            data: params.result,
        };
    }
    static formatAPIResponse(res, message, result, statusCode = 200) {
        const apiResponse = Helper.APIJSONResponse({ message, result });
        res.status(statusCode).json(apiResponse);
    }
}
exports.Helper = Helper;
