"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserAccountState = exports.UserAccountType = void 0;
/**
 * Enum for user account types.
 */
var UserAccountType;
(function (UserAccountType) {
    /**
     * Company account type.
     */
    UserAccountType["COMPANY"] = "COMPANY";
    /**
     * Individual account type.
     */
    UserAccountType["INDIVIDUAL"] = "INDIVIDUAL";
    /**
     * Administrative account type.
     */
    UserAccountType["ADMIN"] = "ADMIN";
    /**
     * Internal staff or employee account type.
     */
    // STAFF = 'STAFF',
})(UserAccountType || (exports.UserAccountType = UserAccountType = {}));
/**
 * Enum for user account states.
 */
var UserAccountState;
(function (UserAccountState) {
    /**
     * Account is active and fully functional.
     */
    UserAccountState["ACTIVE"] = "ACTIVE";
    /**
     * Account is temporarily blocked or restricted.
     */
    UserAccountState["SUSPENDED"] = "SUSPENDED";
    /**
     * Account is no longer active or has been deactivated.
     */
    UserAccountState["INACTIVE"] = "INACTIVE";
    /**
     * Account is locked due to security concerns or excessive login attempts.
     */
    UserAccountState["LOCKED"] = "LOCKED";
})(UserAccountState || (exports.UserAccountState = UserAccountState = {}));
