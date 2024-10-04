"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddUserHealthInfoDTOValidator = exports.resetPasswordDTOValidator = exports.initiatePasswordResetDTOValidator = exports.CreateBillingDTOValidator = exports.AddFoodToMenuDTOValidator = exports.CreateInvitationDTOValidator = exports.employeeOnboardingDTOValidator = exports.companyOnboardingDTOValidator = exports.createAddressDTOValidator = exports.confirmEmailDTOValidator = exports.resendEmailVerificationCodeDTOValidator = exports.loginDTOValidator = exports.createAdminAccountDTOValidator = exports.createIndividualAccountDTOValidator = exports.createCompanyAccountDTOValidator = exports.createAccountDTOValidator = void 0;
const joi_1 = __importDefault(require("joi"));
const infrastructure_1 = require("../../../infrastructure");
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
        .valid(...Object.values(infrastructure_1.UserAccountType)) // Ensures the string matches one of the enum values
        .required()
        .messages({
        'any.required': 'Account type is required',
        'any.only': `Account type must be one of the following: ${Object.values(infrastructure_1.UserAccountType).join(', ')}`,
    }),
    dial_code: joi_1.default.string()
        .pattern(/^\+\d+$/)
        .required()
        .messages({
        'string.pattern.base': 'Dial code must start with a plus (+) and be followed by numbers only',
        'any.required': 'Dial code is required',
    }),
    phone_number: joi_1.default.string()
        .length(10) // Enforces exactly 10 characters
        .required()
        .messages({
        'string.length': 'Phone number must be exactly 10 characters long',
        'any.required': 'Phone number is required',
    }),
    time_zone: joi_1.default.string()
        .pattern(/^[A-Za-z]+\/[A-Za-z_]+$/)
        .messages({
        'string.pattern.base': 'Time zone must be a valid IANA time zone (e.g., Africa/Lagos)',
        'any.required': 'Timezone is required',
    }),
}).unknown(); // Allow additional fields not defined in the schema
exports.createCompanyAccountDTOValidator = exports.createAccountDTOValidator
    .keys({
    name: joi_1.default.string().required().messages({
        'any.required': 'Company name is required',
    }),
    website: joi_1.default.string().uri().required().messages({
        'string.uri': 'Invalid website URL',
        'any.required': 'Website is required',
    }),
    user: joi_1.default.required(),
})
    .unknown(); // Allow additional fields not defined in the schema
exports.createIndividualAccountDTOValidator = exports.createAccountDTOValidator
    .keys({
    first_name: joi_1.default.string().required().messages({
        'any.required': 'First name is required',
    }),
    last_name: joi_1.default.string().required().messages({
        'any.required': 'Last name is required',
    }),
    user: joi_1.default.required(),
    invitation_code: joi_1.default.string().required().messages({
        'any.required': 'Invitation code is required',
    }),
})
    .unknown(); // Allow additional fields not defined in the schema
exports.createAdminAccountDTOValidator = exports.createAccountDTOValidator
    .keys({
    first_name: joi_1.default.string().required().messages({
        'any.required': 'First name is required',
    }),
    last_name: joi_1.default.string().required().messages({
        'any.required': 'Last name is required',
    }),
    user: joi_1.default.required(),
})
    .unknown(); // Allow additional fields not defined in the schema
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
}).unknown(); // Allow additional fields not defined in the schema
exports.confirmEmailDTOValidator = joi_1.default.object({
    email: joi_1.default.string().email().required().messages({
        'string.email': 'Invalid email format',
        'any.required': 'Email is required',
    }),
    otp: joi_1.default.string().length(6).required().messages({
        'string.length': 'OTP must be 6 characters long',
        'any.required': 'OTP is required',
    }),
}).unknown(); // Allow additional fields not defined in the schema
exports.createAddressDTOValidator = joi_1.default.object({
    address_line_1: joi_1.default.string().required().messages({
        'any.required': 'Provide your street address line',
    }),
    city: joi_1.default.string().required().messages({
        'any.required': 'City is required',
    }),
    state: joi_1.default.string().required().messages({
        'any.required': 'State is required',
    }),
    country: joi_1.default.string().required().messages({
        'any.required': 'Country is required',
    }),
    zip_code: joi_1.default.string().required().messages({
        'any.required': 'Please provide your address zipcode',
    }),
    user: joi_1.default.required(),
    // address_line_2: Joi.string().optional(),
}).unknown();
exports.companyOnboardingDTOValidator = exports.createAddressDTOValidator
    .keys({
    max_spend_amount_per_employee: joi_1.default.number().positive().required().messages({
        'number.positive': 'Spend budget must be a positive number',
        'any.required': 'Please specify spend budget for each employees you invite',
    }),
    size: joi_1.default.string()
        .pattern(/^\d+-(\d+|\+|\d+\+)$/)
        .required()
        .messages({
        'string.pattern.base': 'Provide company size in a valid format (e.g., 0-5, 50-100, 1000+)',
        'any.required': 'Provide company size',
    }),
})
    .unknown();
exports.employeeOnboardingDTOValidator = exports.createAddressDTOValidator
    .keys({
    lunch_time: joi_1.default.string()
        .pattern(/^((0[1-9]|1[0-2]):([0-5][0-9]) (AM|PM))$/)
        .required()
        .messages({
        'string.pattern.base': 'Please enter a valid lunch time (e.g., 12:30 PM)',
        'any.required': 'Please choose your preferred lunchtime',
    }),
})
    .unknown();
exports.CreateInvitationDTOValidator = joi_1.default.object({
    employee_work_email: joi_1.default.string()
        .email({
        minDomainSegments: 2,
        tlds: {
            allow: true,
        },
    })
        .required()
        .messages({
        'any.required': 'Employee work email is required',
        'string.email': 'Enter a valid work email address',
        'string.base': 'Email must be a string',
    }),
    user: joi_1.default.required(),
});
exports.AddFoodToMenuDTOValidator = joi_1.default.object({
    name: joi_1.default.string().required().example('Grilled Chicken Salad').messages({
        'any.required': "Provide the name of the food you're adding",
    }),
    description: joi_1.default.string()
        .required()
        .example('A healthy grilled chicken salad with fresh greens')
        .messages({
        'any.required': "Provide a brief description of the food you're adding",
    }),
    price: joi_1.default.string().required().example('15.99').messages({
        'any.required': 'Add a price to the food menu',
    }),
    categories: joi_1.default.array()
        .items(joi_1.default.string().valid(...Object.values(infrastructure_1.FoodCategory)))
        .required()
        .example(['Salad', 'Grill'])
        .messages({
        'any.required': 'Please provide one or more categories the food belongs to',
        'any.only': 'Invalid category provided',
    }),
    user: joi_1.default.required().example('603dcd417997db243b3c7a6d'), // Example ObjectId
    // New health-related fields with examples
    health_benefits: joi_1.default.array()
        .items(joi_1.default.string())
        .optional()
        .example(['Rich in vitamins', 'Boosts immunity'])
        .messages({
        'array.includes': 'Health benefits should be a list of strings',
    }),
    allergens: joi_1.default.array().items(joi_1.default.string()).optional().example(['Peanuts', 'Dairy']).messages({
        'array.includes': 'Allergens should be a list of strings',
    }),
    suitable_for_conditions: joi_1.default.array()
        .items(joi_1.default.string())
        .optional()
        .example(['Diabetes', 'Hypertension'])
        .messages({
        'array.includes': 'Medical condition suitability should be a list of strings',
    }),
    suitable_for_diet: joi_1.default.array()
        .items(joi_1.default.string())
        .optional()
        .example(['Vegan', 'Gluten-Free'])
        .messages({
        'array.includes': 'Dietary suitability should be a list of strings',
    }),
}).unknown();
exports.CreateBillingDTOValidator = joi_1.default.object({
    amount: joi_1.default.string().required().messages({
        'any.required': 'Provide amount you want to topup',
    }),
    user: joi_1.default.required(),
});
exports.initiatePasswordResetDTOValidator = joi_1.default.object({
    email: joi_1.default.string().email().required().messages({
        'string.email': 'Invalid email format',
        'any.required': 'Email is required',
    }),
});
exports.resetPasswordDTOValidator = joi_1.default.object({
    email: joi_1.default.string().email().required().messages({
        'string.email': 'Invalid email format',
        'any.required': 'Email is required',
    }),
    otp: joi_1.default.string().length(6).required().messages({
        'string.length': 'OTP must be 6 characters long',
        'any.required': 'OTP is required',
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
    confirmPassword: joi_1.default.any().valid(joi_1.default.ref('password')).required().messages({
        'any.only': 'Passwords must match',
        'any.required': 'Confirm Password is required',
    }),
});
exports.AddUserHealthInfoDTOValidator = joi_1.default.object({
    allergies: joi_1.default.array().items(joi_1.default.string().min(1)).required().messages({
        'array.base': 'Allergies must be an array of strings',
        'array.empty': 'Please provide at least one allergy',
        'any.required': 'Allergies field is required',
        'string.empty': 'Each allergy must be a non-empty string',
    }),
    medical_conditions: joi_1.default.array().items(joi_1.default.string().min(1)).required().messages({
        'array.base': 'Medical conditions must be an array of strings',
        'array.empty': 'Please provide at least one medical condition',
        'any.required': 'Medical conditions field is required',
        'string.empty': 'Each medical condition must be a non-empty string',
    }),
    dietary_preferences: joi_1.default.array().items(joi_1.default.string().min(1)).required().messages({
        'array.base': 'Dietary preferences must be an array of strings',
        'array.empty': 'Please provide at least one dietary preference',
        'any.required': 'Dietary preferences field is required',
        'string.empty': 'Each dietary preference must be a non-empty string',
    }),
    user: joi_1.default.object().required().messages({
        'any.required': 'User information is required',
    }),
});
