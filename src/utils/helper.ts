import { Response } from 'express';
import { parse } from 'tldts'; // Importing a library for accurate domain extraction
import crypto from 'crypto';
import { ForbiddenError } from './errors';
import { FetchFoodMenuDTO } from '../services/dtos/request.dto';
import { v2 } from 'cloudinary';
import { loadEnv } from './loadEnv';
import { UserAccountType } from '../infrastructure/database/models/enums';
import logger from './logger';

loadEnv(process.env.NODE_ENV!);

v2.config({
  secure: true,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
  cloud_name: process.env.CLOUDINARY_NAME!,
});

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

  static generateCacheKey = (params: FetchFoodMenuDTO): string => {
    const { query, category, lastScore, lastId } = params;
    const key = JSON.stringify({ query, category, lastScore, lastId });
    return crypto.createHash('sha256').update(key).digest('hex');
  };

  static hydrateUsers(data: Record<string, any>) {
    const list = data.list.map((user: User) => {
      // Determine the name based on the account type
      const name =
        user.account_type === UserAccountType.COMPANY
          ? user.account_details.name ?? ''
          : `${user.account_details.first_name ?? ''} ${
              user.account_details.last_name ?? ''
            }`.trim();

      // Construct the unified user object
      return {
        ...user,
        id: user._id,
        name, // Use either company name or first + last name
        account_type: user.account_type,
      };
    });

    return {
      list,
      lastScore: data.lastScore,
      lastId: data.lastId,
    };
  }

  static async uploadImageToCloudinary(filePath: any) {
    try {
      // Upload the image
      const result = await v2.uploader.upload(filePath, {
        use_filename: false,
        folder: 'lunchtyme',
        unique_filename: false,
      });
      return result.secure_url;
    } catch (error) {
      logger.error('Error uploading image to cloudinary', { error });
      throw error;
    }
  }
}

interface User {
  id: string;
  account_type: string;
  first_name?: string;
  last_name?: string;
  company_name?: string;
  [key: string]: any; // other fields
}
