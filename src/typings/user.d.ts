/**
 * Enum for user account types and it should match the model name.
 */
export enum UserAccountType {
  /**
   * Company account type.
   */
  COMPANY = 'Company',
  /**
   * Individual account type.
   */
  INDIVIDUAL = 'Individual',
  /**
   * Administrative account type.
   */
  ADMIN = 'Admin',
  /**
   * Internal staff or employee account type.
   */
  // STAFF = 'Staff',
}

/**
 * Enum for user account states.
 */
export enum UserAccountState {
  /**
   * Account is active and fully functional.
   */
  ACTIVE = 'ACTIVE',
  /**
   * Account is temporarily blocked or restricted.
   */
  SUSPENDED = 'SUSPENDED',
  /**
   * Account is no longer active or has been deactivated.
   */
  INACTIVE = 'INACTIVE',
  /**
   * Account is locked due to security concerns or excessive login attempts.
   */
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
  // Include other company-specific fields
}

export interface Individual extends BaseUser {
  first_name: string;
  last_name: string;
  invitation_code: string;
  lunch_time: string;
  // Include other individual-specific fields
}

export interface Admin extends BaseUser {
  first_name: string;
  last_name: string;
  // Include other admin-specific fields
}

export type User = Company | Individual | Admin;

export interface AuthUserClaim {
  sub: mongoose.Types.ObjectId | string;
  account_type: UserAccountType;
}
