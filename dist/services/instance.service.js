"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = exports.redisService = exports.sharedServices = exports.individualRepository = exports.adminRepository = exports.companyRepository = exports.userRepository = void 0;
const infrastructure_1 = require("../infrastructure");
const repository_1 = require("../repository");
const auth_service_1 = require("./auth.service");
const redis_service_1 = require("./redis.service");
const shared_service_1 = require("./shared.service");
// All repository instances
exports.userRepository = new repository_1.UserRepository();
exports.companyRepository = new repository_1.CompanyRepository();
exports.adminRepository = new repository_1.AdminRepository();
exports.individualRepository = new repository_1.IndividualRepository();
// Shared services instance
exports.sharedServices = new shared_service_1.SharedServices(exports.userRepository);
// Redis service instance
exports.redisService = new redis_service_1.RedisService(infrastructure_1.redisCache);
// Auth service instance
exports.authService = new auth_service_1.Authservice(exports.userRepository, exports.companyRepository, exports.adminRepository, exports.individualRepository, exports.sharedServices, exports.redisService, infrastructure_1.emailQueue);
