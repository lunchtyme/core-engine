import mongoose from 'mongoose';
import { BillingStatus, BillingType, FoodCategory } from '../../infrastructure';
import { UserAccountType } from '../../infrastructure/database/models/enums';
import { AuthUserClaim } from '../../typings/user';

export interface CreateAccountDTO {
  email: string;
  password: string;
  account_type: UserAccountType;
  dial_code: string;
  phone_number: string;
  time_zone: string;
  account_ref: mongoose.Types.ObjectId;
}

export interface CreateCompanyAccountDTO extends CreateAccountDTO {
  name: string;
  email: string;
  website: String;
  size: string;
  max_spend_amount_per_employee: number;
  user: mongoose.Types.ObjectId;
}

export interface CreateIndividualAccountDTO extends CreateAccountDTO {
  first_name: string;
  last_name: string;
  user: mongoose.Types.ObjectId;
  invitation_code: string;
  lunch_time: string;
}

export interface CreateAdminAccountDTO extends CreateAccountDTO {
  first_name: string;
  last_name: string;
  user: mongoose.Types.ObjectId;
}

export type RegisterAccountDTO =
  | CreateCompanyAccountDTO
  | CreateAdminAccountDTO
  | CreateIndividualAccountDTO;

export interface LoginDTO {
  identifier: string;
  password: string;
}

export interface ResendEmailVerificationCodeDTO {
  email: string;
}
export interface ConfirmEmailDTO {
  email: string;
  otp: string;
}

export interface CreateAddressDTO {
  address_line_1: string;
  city: string;
  state: string;
  country: string;
  zip_code: string;
  user: AuthUserClaim | mongoose.Types.ObjectId;
  address_line_2?: string;
}

export interface AddUserHealthInfoDTO {
  allergies: string[];
  medical_conditions: string[];
  dietary_preferences: string[];
  user: AuthUserClaim | mongoose.Types.ObjectId;
}

export interface EmployeeOnboardingDTO extends AddUserHealthInfoDTO, CreateAddressDTO {
  lunch_time: string;
}

export interface CompanyOnboardingDTO extends CreateAddressDTO {
  max_spend_amount_per_employee: string;
  size: string;
}

export type OnboardingUserDTO = EmployeeOnboardingDTO | CompanyOnboardingDTO;

export interface CreateInvitationDTO {
  employee_work_email: string;
  user: mongoose.Types.ObjectId;
}

export interface StoreInvitationDTO {
  employee_work_email: string;
  user: mongoose.Types.ObjectId;
  expires_at: Date;
  invitation_token: string;
}

export interface AddFoodToMenuDTO {
  name: string;
  description: string;
  price: string;
  categories: FoodCategory[];
  user: AuthUserClaim | mongoose.Types.ObjectId;
  food_image: Express.Multer.File | string;
}

export interface FetchDataDTO {
  limit: number;
  query?: string;
}

export interface FetchFoodMenuDTO extends FetchDataDTO {
  category?: FoodCategory;
  lastScore?: number;
  lastId?: string;
  user: AuthUserClaim;
}

export interface FetchUsersDTO extends FetchDataDTO {
  user: AuthUserClaim;
  lastScore?: number;
  lastId?: string;
}

export interface CreateBillingDTO {
  amount: number | string;
  user: AuthUserClaim | mongoose.Types.ObjectId;
}

export interface SaveBillingDTO extends CreateBillingDTO {
  user: mongoose.Types.ObjectId;
  amount: string;
  reference_code: string;
  type: BillingType;
  email: string;
  status?: BillingStatus;
}

export interface FetchBillingsDTO extends FetchDataDTO {
  user: AuthUserClaim;
  lastId?: string;
}

export interface CreateOrderDTO {
  user: AuthUserClaim;
  foodItems: { food_menu: mongoose.Types.ObjectId; quantity: number }[];
}

export interface FetchOrderssDTO extends FetchDataDTO {
  user: AuthUserClaim;
  lastId?: string;
}

export interface InitiatePasswordResetDTO {
  email: string;
}

export interface ResetPasswordDTO extends InitiatePasswordResetDTO {
  otp: string;
  password: string;
  confirmPassword: string;
}
