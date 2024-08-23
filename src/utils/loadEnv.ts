import { config } from 'dotenv';

enum SERVER_ENVIRONMENT {
  PRODUCTION = 'production',
  DEVELOPMENT = 'development',
}

export function loadEnv(environment: string | SERVER_ENVIRONMENT) {
  if (environment === SERVER_ENVIRONMENT.PRODUCTION) {
    return undefined; // Skip loading .env in production
  }

  const result = config();

  if (result.error) {
    console.error('Error loading .env file:', result.error);
  }

  return result.parsed;
}
