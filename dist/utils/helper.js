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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Helper = void 0;
const tldts_1 = require("tldts"); // Importing a library for accurate domain extraction
const crypto_1 = __importDefault(require("crypto"));
const user_1 = require("../typings/user");
const errors_1 = require("./errors");
const logger_1 = require("./logger");
const cloudinary_1 = require("cloudinary");
const loadEnv_1 = require("./loadEnv");
(0, loadEnv_1.loadEnv)(process.env.NODE_ENV);
cloudinary_1.v2.config({
    secure: true,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    cloud_name: process.env.CLOUDINARY_NAME,
});
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
    static generateRandomToken(length = 8) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let token = '';
        for (let i = 0; i < length; i++) {
            token += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return token;
    }
    // User access guard
    static checkUserType(userType, allowedUserTypes, suffixMessage) {
        const defaultSuffixMessage = 'access this resource';
        if (!allowedUserTypes.includes(userType)) {
            const suffix = suffixMessage !== undefined ? suffixMessage : defaultSuffixMessage;
            const allowedUserType = allowedUserTypes.length === 1 ? allowedUserTypes[0] : allowedUserTypes.join(' or ');
            const verb = allowedUserTypes.length === 1 ? 'is' : 'are';
            const verb2 = allowedUserTypes.length === 1 ? '' : 's';
            throw new errors_1.ForbiddenError(`Only ${allowedUserType}${verb2} ${verb} allowed to ${suffix}`);
        }
    }
    static hydrateUsers(data) {
        const list = data.list.map((user) => {
            var _a, _b, _c;
            // Determine the name based on the account type
            const name = user.account_type === user_1.UserAccountType.COMPANY
                ? (_a = user.account_details.name) !== null && _a !== void 0 ? _a : ''
                : `${(_b = user.account_details.first_name) !== null && _b !== void 0 ? _b : ''} ${(_c = user.account_details.last_name) !== null && _c !== void 0 ? _c : ''}`.trim();
            // Construct the unified user object
            return Object.assign(Object.assign({}, user), { id: user._id, name, account_type: user.account_type });
        });
        return {
            list,
            lastScore: data.lastScore,
            lastId: data.lastId,
        };
    }
    static uploadImageToCloudinary(filePath) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Upload the image
                const result = yield cloudinary_1.v2.uploader.upload(filePath, {
                    use_filename: false,
                    folder: 'lunchtyme',
                    unique_filename: false,
                });
                return result.secure_url;
            }
            catch (error) {
                logger_1.logger.error('Error uploading image to cloudinary', { error });
                throw error;
            }
        });
    }
}
exports.Helper = Helper;
Helper.generateCacheKey = (params) => {
    const { query, category, lastScore, lastId } = params;
    const key = JSON.stringify({ query, category, lastScore, lastId });
    return crypto_1.default.createHash('sha256').update(key).digest('hex');
};
