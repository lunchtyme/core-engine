"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserAccountState = exports.UserAccountType = void 0;
/**
 * Enum for user account types and it should match the model name.
 */
var UserAccountType;
(function (UserAccountType) {
    UserAccountType["COMPANY"] = "Company";
    UserAccountType["INDIVIDUAL"] = "Individual";
    UserAccountType["ADMIN"] = "Admin";
})(UserAccountType || (exports.UserAccountType = UserAccountType = {}));
/**
 * Enum for user account states.
 */
var UserAccountState;
(function (UserAccountState) {
    UserAccountState["ACTIVE"] = "ACTIVE";
    UserAccountState["SUSPENDED"] = "SUSPENDED";
    UserAccountState["INACTIVE"] = "INACTIVE";
    UserAccountState["LOCKED"] = "LOCKED";
})(UserAccountState || (exports.UserAccountState = UserAccountState = {}));
