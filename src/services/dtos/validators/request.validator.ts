import Joi from 'joi';
import { UserAccountType } from '../../../typings/user';

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
    size: Joi.string().required().messages({
      'any.required': 'Company size is required',
    }),
    max_spend_amount_per_employee: Joi.number().positive().required().messages({
      'number.positive': 'Max spend amount per employee must be a positive number',
      'any.required': 'Max spend amount per employee is required',
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
    lunch_time: Joi.string().required().messages({
      'any.required': 'Lunch time is required',
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
