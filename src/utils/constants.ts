import { OrderStatus } from '../infrastructure';

export const APP_NAME = 'Lunchtyme';
export const EMAIL_DATA = {
  subject: {
    welcome: `Welcome to ${APP_NAME}`,
    verifyEmail: `Verify your email address`,
    employeeInvitation(companyName: string) {
      return `${companyName} (via ${APP_NAME})`;
    },
    balanceTopup: 'Wallet topup successful',
    orderReciept(orderId: string) {
      return `Order [${orderId}] confirmation receipt`;
    },
    orderUpdated(orderId: string, status: OrderStatus) {
      // Use switch to choose right subject
      let msg = `has been updated`;
      switch (status) {
        case OrderStatus.CONFIRMED:
          msg = ' has been confirmed for delivery';
          break;
        case OrderStatus.CANCELLED:
          msg = 'has been cancelled';
          break;
        case OrderStatus.DELIVERED:
          msg = 'is on it way to you';
          break;
        default:
          msg = msg;
          break;
      }
      return `Order [${orderId}] ${msg}`;
    },
    walletCharge: 'Your wallet was charged',
    chargeFail: 'Insufficient wallet balance',
    dailyNotification: "Check out today's menu for your lunch",
  },
  template: {
    welcome: 'welcome',
    verifyEmail: 'verifyEmail',
    employeeInvitation: 'employeeInvitation',
    balanceTopup: 'balanceTopup',
    orderReceipt: 'orderReceipt',
    walletCharge: 'walletCharge',
    chargeFail: 'chargeFail',
    dailyNotification: 'dailyNotification',
    orderUpdated: 'orderUpdated',
  },
};
export const DEFAULT_CACHE_EXPIRY_IN_SECS = 180;
export const CLIENT_BASE_URL = 'https://order.lunchtyme.store';
