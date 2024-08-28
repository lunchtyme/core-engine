"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Helper = void 0;
class Helper {
    static generateOTPCode() {
        return Math.floor(Math.random() * 900000);
    }
}
exports.Helper = Helper;
