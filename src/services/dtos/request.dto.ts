import mongoose from 'mongoose';
import { AuthUserClaim, UserAccountType } from '../../typings/user';
import { FoodCategory } from '../../infrastructure';

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
  user: mongoose.Types.ObjectId;
  address_line_2?: string;
}

export interface EmployeeOnboardingDTO extends CreateAddressDTO {
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
  user: AuthUserClaim;
}
