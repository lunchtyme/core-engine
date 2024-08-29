"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.confirmEmailDTOValidator = exports.resendEmailVerificationCodeDTOValidator = exports.loginDTOValidator = exports.createAdminAccountDTOValidator = exports.createIndividualAccountDTOValidator = exports.createCompanyAccountDTOValidator = exports.createAccountDTOValidator = void 0;
const joi_1 = __importDefault(require("joi"));
const user_1 = require("../../../typings/user");
exports.createAccountDTOValidator = joi_1.default.object({
    email: joi_1.default.string()
        .email({
        minDomainSegments: 2,
        tlds: {
            allow: true,
        },
    })
        .required()
        .messages({
        'any.required': 'Email is required',
        'string.email': 'Enter a valid email address',
        'string.base': 'Email must be a string',
    }),
    password: joi_1.default.string()
        .pattern(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,30}$/))
        .required()
        .messages({
        'string.min': 'Password must be at least 8 characters long.',
        'string.max': 'Password must not be more than 30 characters long.',
        'any.required': 'Password is required.',
        'string.pattern.base': 'Provide a valid and secure password characters',
    }),
    account_type: joi_1.default.string()
        .valid(...Object.values(user_1.UserAccountType)) // Ensures the string matches one of the enum values
        .required()
        .messages({
        'any.required': 'Account type is required',
        'any.only': `Account type must be one of the following: ${Object.values(user_1.UserAccountType).join(', ')}`,
    }),
    dial_code: joi_1.default.string()
        .pattern(/^\+\d+$/)
        .required()
        .messages({
        'string.pattern.base': 'Dial code must start with a plus (+) and be followed by numbers only',
        'any.required': 'Dial code is required',
    }),
    phone_number: joi_1.default.string()
        .pattern(/^\+\d+$/)
        .required()
        .messages({
        'string.pattern.base': 'Phone number must start with a plus (+) and be followed by numbers only',
        'any.required': 'Phone number is required',
    }),
    time_zone: joi_1.default.string()
        .pattern(/^[A-Za-z]+\/[A-Za-z_]+$/)
        .messages({
        'string.pattern.base': 'Time zone must be a valid IANA time zone (e.g., Africa/Lagos)',
    }),
});
exports.createCompanyAccountDTOValidator = exports.createAccountDTOValidator.keys({
    name: joi_1.default.string().required().messages({
        'any.required': 'Company name is required',
    }),
    website: joi_1.default.string().uri().required().messages({
        'string.uri': 'Invalid website URL',
        'any.required': 'Website is required',
    }),
    size: joi_1.default.string().required().messages({
        'any.required': 'Company size is required',
    }),
    max_spend_amount_per_employee: joi_1.default.number().positive().required().messages({
        'number.positive': 'Max spend amount per employee must be a positive number',
        'any.required': 'Max spend amount per employee is required',
    }),
    user: joi_1.default.string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .required()
        .messages({
        'string.pattern.base': 'Invalid user ID',
        'any.required': 'User ID is required',
    }),
});
exports.createIndividualAccountDTOValidator = exports.createAccountDTOValidator.keys({
    first_name: joi_1.default.string().required().messages({
        'any.required': 'First name is required',
    }),
    last_name: joi_1.default.string().required().messages({
        'any.required': 'Last name is required',
    }),
    user: joi_1.default.string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .required()
        .messages({
        'string.pattern.base': 'Invalid user ID',
        'any.required': 'User ID is required',
    }),
    invitation_code: joi_1.default.string().required().messages({
        'any.required': 'Invitation code is required',
    }),
    lunch_time: joi_1.default.string().required().messages({
        'any.required': 'Lunch time is required',
    }),
});
exports.createAdminAccountDTOValidator = exports.createAccountDTOValidator.keys({
    first_name: joi_1.default.string().required().messages({
        'any.required': 'First name is required',
    }),
    last_name: joi_1.default.string().required().messages({
        'any.required': 'Last name is required',
    }),
    user: joi_1.default.string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .required()
        .messages({
        'string.pattern.base': 'Invalid user ID',
        'any.required': 'User ID is required',
    }),
});
exports.loginDTOValidator = joi_1.default.object({
    identifier: joi_1.default.string().required().messages({
        'any.required': 'Identifier is required',
    }),
    password: joi_1.default.string().required().messages({
        'any.required': 'Password is required',
    }),
});
exports.resendEmailVerificationCodeDTOValidator = joi_1.default.object({
    email: joi_1.default.string().email().required().messages({
        'string.email': 'Invalid email format',
        'any.required': 'Email is required',
    }),
});
exports.confirmEmailDTOValidator = joi_1.default.object({
    email: joi_1.default.string().email().required().messages({
        'string.email': 'Invalid email format',
        'any.required': 'Email is required',
    }),
    otp: joi_1.default.string().length(6).required().messages({
        'string.length': 'OTP must be 6 characters long',
        'any.required': 'OTP is required',
    }),
});
