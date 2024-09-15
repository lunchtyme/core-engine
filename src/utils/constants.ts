export const APP_NAME = 'Lunchtyme';
export const EMAIL_DATA = {
  subject: {
    welcome: `Welcome to ${APP_NAME}`,
    verifyEmail: `Verify your email address`,
    employeeInvitation(companyName: string) {
      return `${companyName} is inviting you to join ${APP_NAME}`;
    },
    balanceTopup: 'Wallet topup successful',
  },
  template: {
    welcome: 'welcome',
    verifyEmail: 'verifyEmail',
    employeeInvitation: 'employeeInvitation',
    balanceTopup: 'balanceTopup',
  },
};
export const DEFAULT_CACHE_EXPIRY_IN_SECS = 180;
export const CLIENT_BASE_URL = 'https://order.lunchtyme.store';
