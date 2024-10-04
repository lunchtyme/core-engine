import Joi from 'joi';

import { FoodCategory, UserAccountType } from '../../../infrastructure';

export const createAccountDTOValidator = Joi.object({
  email: Joi.string()
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
  password: Joi.string()
    .pattern(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,30}$/))
    .required()
    .messages({
      'string.min': 'Password must be at least 8 characters long.',
      'string.max': 'Password must not be more than 30 characters long.',
      'any.required': 'Password is required.',
      'string.pattern.base': 'Provide a valid and secure password characters',
    }),
  account_type: Joi.string()
    .valid(...Object.values(UserAccountType)) // Ensures the string matches one of the enum values
    .required()
    .messages({
      'any.required': 'Account type is required',
      'any.only': `Account type must be one of the following: ${Object.values(UserAccountType).join(
        ', ',
      )}`,
    }),
  dial_code: Joi.string()
    .pattern(/^\+\d+$/)
    .required()
    .messages({
      'string.pattern.base': 'Dial code must start with a plus (+) and be followed by numbers only',
      'any.required': 'Dial code is required',
    }),
  phone_number: Joi.string()
    .length(10) // Enforces exactly 10 characters
    .required()
    .messages({
      'string.length': 'Phone number must be exactly 10 characters long',
      'any.required': 'Phone number is required',
    }),
  time_zone: Joi.string()
    .pattern(/^[A-Za-z]+\/[A-Za-z_]+$/)
    .messages({
      'string.pattern.base': 'Time zone must be a valid IANA time zone (e.g., Africa/Lagos)',
      'any.required': 'Timezone is required',
    }),
}).unknown(); // Allow additional fields not defined in the schema

export const createCompanyAccountDTOValidator = createAccountDTOValidator
  .keys({
    name: Joi.string().required().messages({
      'any.required': 'Company name is required',
    }),
    website: Joi.string().uri().required().messages({
      'string.uri': 'Invalid website URL',
      'any.required': 'Website is required',
    }),
    user: Joi.required(),
  })
  .unknown(); // Allow additional fields not defined in the schema

export const createIndividualAccountDTOValidator = createAccountDTOValidator
  .keys({
    first_name: Joi.string().required().messages({
      'any.required': 'First name is required',
    }),
    last_name: Joi.string().required().messages({
      'any.required': 'Last name is required',
    }),
    user: Joi.required(),
    invitation_code: Joi.string().required().messages({
      'any.required': 'Invitation code is required',
    }),
  })
  .unknown(); // Allow additional fields not defined in the schema

export const createAdminAccountDTOValidator = createAccountDTOValidator
  .keys({
    first_name: Joi.string().required().messages({
      'any.required': 'First name is required',
    }),
    last_name: Joi.string().required().messages({
      'any.required': 'Last name is required',
    }),
    user: Joi.required(),
  })
  .unknown(); // Allow additional fields not defined in the schema

export const loginDTOValidator = Joi.object({
  identifier: Joi.string().required().messages({
    'any.required': 'Identifier is required',
  }),
  password: Joi.string().required().messages({
    'any.required': 'Password is required',
  }),
});

export const resendEmailVerificationCodeDTOValidator = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Invalid email format',
    'any.required': 'Email is required',
  }),
}).unknown(); // Allow additional fields not defined in the schema

export const confirmEmailDTOValidator = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Invalid email format',
    'any.required': 'Email is required',
  }),
  otp: Joi.string().length(6).required().messages({
    'string.length': 'OTP must be 6 characters long',
    'any.required': 'OTP is required',
  }),
}).unknown(); // Allow additional fields not defined in the schema

export const createAddressDTOValidator = Joi.object({
  address_line_1: Joi.string().required().messages({
    'any.required': 'Provide your street address line',
  }),
  city: Joi.string().required().messages({
    'any.required': 'City is required',
  }),
  state: Joi.string().required().messages({
    'any.required': 'State is required',
  }),
  country: Joi.string().required().messages({
    'any.required': 'Country is required',
  }),
  zip_code: Joi.string().required().messages({
    'any.required': 'Please provide your address zipcode',
  }),
  user: Joi.required(),
  // address_line_2: Joi.string().optional(),
}).unknown();

export const companyOnboardingDTOValidator = createAddressDTOValidator
  .keys({
    max_spend_amount_per_employee: Joi.number().positive().required().messages({
      'number.positive': 'Spend budget must be a positive number',
      'any.required': 'Please specify spend budget for each employees you invite',
    }),
    size: Joi.string()
      .pattern(/^\d+-(\d+|\+|\d+\+)$/)
      .required()
      .messages({
        'string.pattern.base': 'Provide company size in a valid format (e.g., 0-5, 50-100, 1000+)',
        'any.required': 'Provide company size',
      }),
  })
  .unknown();

export const employeeOnboardingDTOValidator = createAddressDTOValidator
  .keys({
    lunch_time: Joi.string()
      .pattern(/^((0[1-9]|1[0-2]):([0-5][0-9]) (AM|PM))$/)
      .required()
      .messages({
        'string.pattern.base': 'Please enter a valid lunch time (e.g., 12:30 PM)',
        'any.required': 'Please choose your preferred lunchtime',
      }),
  })
  .unknown();

export const CreateInvitationDTOValidator = Joi.object({
  employee_work_email: Joi.string()
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
  user: Joi.required(),
});

export const AddFoodToMenuDTOValidator = Joi.object({
  name: Joi.string().required().example('Grilled Chicken Salad').messages({
    'any.required': "Provide the name of the food you're adding",
  }),
  description: Joi.string()
    .required()
    .example('A healthy grilled chicken salad with fresh greens')
    .messages({
      'any.required': "Provide a brief description of the food you're adding",
    }),
  price: Joi.string().required().example('15.99').messages({
    'any.required': 'Add a price to the food menu',
  }),
  categories: Joi.array()
    .items(Joi.string().valid(...Object.values(FoodCategory)))
    .required()
    .example(['Salad', 'Grill'])
    .messages({
      'any.required': 'Please provide one or more categories the food belongs to',
      'any.only': 'Invalid category provided',
    }),
  user: Joi.required().example('603dcd417997db243b3c7a6d'), // Example ObjectId

  // New health-related fields with examples
  health_benefits: Joi.array()
    .items(Joi.string())
    .optional()
    .example(['Rich in vitamins', 'Boosts immunity'])
    .messages({
      'array.includes': 'Health benefits should be a list of strings',
    }),
  allergens: Joi.array().items(Joi.string()).optional().example(['Peanuts', 'Dairy']).messages({
    'array.includes': 'Allergens should be a list of strings',
  }),
  suitable_for_conditions: Joi.array()
    .items(Joi.string())
    .optional()
    .example(['Diabetes', 'Hypertension'])
    .messages({
      'array.includes': 'Medical condition suitability should be a list of strings',
    }),
  suitable_for_diet: Joi.array()
    .items(Joi.string())
    .optional()
    .example(['Vegan', 'Gluten-Free'])
    .messages({
      'array.includes': 'Dietary suitability should be a list of strings',
    }),
}).unknown();

export const CreateBillingDTOValidator = Joi.object({
  amount: Joi.string().required().messages({
    'any.required': 'Provide amount you want to topup',
  }),
  user: Joi.required(),
});

export const initiatePasswordResetDTOValidator = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Invalid email format',
    'any.required': 'Email is required',
  }),
});

export const resetPasswordDTOValidator = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Invalid email format',
    'any.required': 'Email is required',
  }),
  otp: Joi.string().length(6).required().messages({
    'string.length': 'OTP must be 6 characters long',
    'any.required': 'OTP is required',
  }),
  password: Joi.string()
    .pattern(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,30}$/))
    .required()
    .messages({
      'string.min': 'Password must be at least 8 characters long.',
      'string.max': 'Password must not be more than 30 characters long.',
      'any.required': 'Password is required.',
      'string.pattern.base': 'Provide a valid and secure password characters',
    }),
  confirmPassword: Joi.any().valid(Joi.ref('password')).required().messages({
    'any.only': 'Passwords must match',
    'any.required': 'Confirm Password is required',
  }),
});

export const AddUserHealthInfoDTOValidator = Joi.object({
  allergies: Joi.array().items(Joi.string().min(1)).required().messages({
    'array.base': 'Allergies must be an array of strings',
    'array.empty': 'Please provide at least one allergy',
    'any.required': 'Allergies field is required',
    'string.empty': 'Each allergy must be a non-empty string',
  }),
  medical_conditions: Joi.array().items(Joi.string().min(1)).required().messages({
    'array.base': 'Medical conditions must be an array of strings',
    'array.empty': 'Please provide at least one medical condition',
    'any.required': 'Medical conditions field is required',
    'string.empty': 'Each medical condition must be a non-empty string',
  }),
  dietary_preferences: Joi.array().items(Joi.string().min(1)).required().messages({
    'array.base': 'Dietary preferences must be an array of strings',
    'array.empty': 'Please provide at least one dietary preference',
    'any.required': 'Dietary preferences field is required',
    'string.empty': 'Each dietary preference must be a non-empty string',
  }),
  user: Joi.object().required().messages({
    'any.required': 'User information is required',
  }),
});
