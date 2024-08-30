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
exports.Helper = void 0;
const tldts_1 = require("tldts"); // Importing a library for accurate domain extraction
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
    static verifyCompanyDomain(companyWebsite, email) {
        return __awaiter(this, void 0, void 0, function* () {
            // Extract the domain from the company's website
            const companyDomain = (0, tldts_1.parse)(companyWebsite).domain;
            // Extract the domain from the email
            const emailDomain = email.split('@')[1];
            // Compare the two domains
            return companyDomain === emailDomain;
        });
    }
}
exports.Helper = Helper;
