"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authReadService = exports.authCreateService = exports.redisService = exports.sharedServices = exports.addressRepository = exports.individualRepository = exports.adminRepository = exports.companyRepository = exports.userRepository = void 0;
const infrastructure_1 = require("../infrastructure");
const repository_1 = require("../repository");
const authCreate_service_1 = require("./authCreate.service");
const authRead_service_1 = require("./authRead.service");
const redis_service_1 = require("./redis.service");
const shared_service_1 = require("./shared.service");
// All repository instances
exports.userRepository = new repository_1.UserRepository();
exports.companyRepository = new repository_1.CompanyRepository();
exports.adminRepository = new repository_1.AdminRepository();
exports.individualRepository = new repository_1.IndividualRepository();
exports.addressRepository = new repository_1.AddressRepository();
// Shared services instance
exports.sharedServices = new shared_service_1.SharedServices(exports.userRepository);
// Redis service instance
exports.redisService = new redis_service_1.RedisService(infrastructure_1.redisCache);
// Auth create/write service instance
exports.authCreateService = new authCreate_service_1.AuthCreateservice(exports.userRepository, exports.companyRepository, exports.adminRepository, exports.individualRepository, exports.addressRepository, exports.sharedServices, exports.redisService, infrastructure_1.emailQueue);
// Auth read service instance
exports.authReadService = new authRead_service_1.AuthReadservice(exports.userRepository, exports.companyRepository, exports.adminRepository, exports.individualRepository, exports.sharedServices, exports.redisService);
