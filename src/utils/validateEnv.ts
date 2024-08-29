const requiredEnvVariables = [
  'MONGO_URI',
  'NODE_ENV',
  'JWT_SECRET',
  'JWT_EXPIRES_IN',
  'MAIL_SENDER_FROM',
  'MAIL_HOST',
  'MAIL_PORT',
  'MAIL_USER',
  'MAIL_PASS',
  'REDIS_URL',
  // Add all other required environment variables here
];

export function validateEnvVariables() {
  const missingVariables: string[] = [];

  requiredEnvVariables.forEach((variable) => {
    if (!process.env[variable]) {
      missingVariables.push(variable);
    }
  });

  if (missingVariables.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVariables.join(', ')}`);
  }
}
