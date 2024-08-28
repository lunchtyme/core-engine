import mongoose from 'mongoose';
import { UserAccountType } from '../../typings/user';

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
