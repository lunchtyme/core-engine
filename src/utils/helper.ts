import { Response } from 'express';

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
}
