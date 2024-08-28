"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadEnv = loadEnv;
const dotenv_1 = require("dotenv");
var SERVER_ENVIRONMENT;
(function (SERVER_ENVIRONMENT) {
    SERVER_ENVIRONMENT["PRODUCTION"] = "production";
    SERVER_ENVIRONMENT["DEVELOPMENT"] = "development";
})(SERVER_ENVIRONMENT || (SERVER_ENVIRONMENT = {}));
function loadEnv(environment) {
    if (environment === SERVER_ENVIRONMENT.PRODUCTION) {
        return undefined; // Skip loading .env in production
    }
    const result = (0, dotenv_1.config)();
    if (result.error) {
        console.error('Error loading .env file:', result.error);
    }
    return result.parsed;
}
