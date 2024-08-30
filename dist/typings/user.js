"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserAccountState = exports.UserAccountType = void 0;
/**
 * Enum for user account types and it should match the model name.
 */
var UserAccountType;
(function (UserAccountType) {
    /**
     * Company account type.
     */
    UserAccountType["COMPANY"] = "Company";
    /**
     * Individual account type.
     */
    UserAccountType["INDIVIDUAL"] = "Individual";
    /**
     * Administrative account type.
     */
    UserAccountType["ADMIN"] = "Admin";
    /**
     * Internal staff or employee account type.
     */
    // STAFF = 'Staff',
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
