import { Response } from 'express';
import { parse } from 'tldts'; // Importing a library for accurate domain extraction
import { UserAccountType } from '../typings/user';
import { ForbiddenError } from './errors';

export type APIJSONResponseParams = {
  message: string;
  result: object;
};

export class Helper {
  static generateOTPCode() {
    return Math.floor(Math.random() * 900000)
      .toString()
      .padStart(6, '0');
  }

  // Utility function for API response
  private static APIJSONResponse(params: APIJSONResponseParams) {
    return {
      success: true,
      message: params.message,
      data: params.result,
    };
  }

  static formatAPIResponse(res: Response, message: string, result: any, statusCode: number = 200) {
    const apiResponse = Helper.APIJSONResponse({ message, result });
    res.status(statusCode).json(apiResponse);
  }

  static async verifyCompanyDomain(companyWebsite: string, email: string): Promise<boolean> {
    // Extract the domain from the company's website
    const companyDomain = parse(companyWebsite).domain;

    // Extract the domain from the email
    const emailDomain = email.split('@')[1];

    // Compare the two domains
    return companyDomain === emailDomain;
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
  static checkUserType(
    userType: UserAccountType,
    allowedUserTypes: UserAccountType[],
    suffixMessage?: string, // Optional message to customize the error message
  ) {
    const defaultSuffixMessage = 'access this resource';
    if (!allowedUserTypes.includes(userType)) {
      const suffix = suffixMessage !== undefined ? suffixMessage : defaultSuffixMessage;
      const allowedUserType =
        allowedUserTypes.length === 1 ? allowedUserTypes[0] : allowedUserTypes.join(' or ');
      const verb = allowedUserTypes.length === 1 ? 'is' : 'are';
      const verb2 = allowedUserTypes.length === 1 ? '' : 's';
      throw new ForbiddenError(`Only ${allowedUserType}${verb2} ${verb} allowed to ${suffix}`);
    }
  }
}
