export class Helper {
  static generateOTPCode() {
    return Math.floor(Math.random() * 900000);
  }
}
