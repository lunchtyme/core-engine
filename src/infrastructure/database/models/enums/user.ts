/**
 * Enum for user account types and it should match the model name.
 */
export enum UserAccountType {
  COMPANY = 'Company',
  INDIVIDUAL = 'Individual',
  ADMIN = 'Admin',
}

/**
 * Enum for user account states.
 */
export enum UserAccountState {
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  INACTIVE = 'INACTIVE',
  LOCKED = 'LOCKED',
}

export interface BaseUser {
  _id: string;
  email: string;
  account_type: UserAccountType;
  dial_code: string;
  phone_number: string;
  email_verified: boolean;
  verified: boolean;
  account_state: UserAccountState;
  password?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Company extends BaseUser {
  name: string;
  website: string;
  size: string;
  max_spend_amount_per_employee: number;
}

export interface Individual extends BaseUser {
  first_name: string;
  last_name: string;
  invitation_code: string;
  lunch_time: string;
}

export interface Admin extends BaseUser {
  first_name: string;
  last_name: string;
}

export type User = Company | Individual | Admin;
