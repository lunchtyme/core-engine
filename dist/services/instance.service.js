"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.invitationReadService = exports.invitationCreateService = exports.authReadService = exports.authCreateService = exports.redisService = exports.sharedServices = void 0;
const infrastructure_1 = require("../infrastructure");
const repository_1 = require("../repository");
const utils_1 = require("../utils");
const authCreate_service_1 = require("./authCreate.service");
const authRead_service_1 = require("./authRead.service");
const invitationCreate_service_1 = require("./invitationCreate.service");
const invitationRead_service_1 = require("./invitationRead.service");
const redis_service_1 = require("./redis.service");
const shared_service_1 = require("./shared.service");
// All repository instances
const userRepository = new repository_1.UserRepository();
const companyRepository = new repository_1.CompanyRepository();
const adminRepository = new repository_1.AdminRepository();
const individualRepository = new repository_1.IndividualRepository();
const addressRepository = new repository_1.AddressRepository();
const invitationRepository = new repository_1.InvitationRepository();
// Shared services instance
exports.sharedServices = new shared_service_1.SharedServices(userRepository);
// Redis service instance
exports.redisService = new redis_service_1.RedisService(infrastructure_1.redisCache);
// Auth create/write service instance
exports.authCreateService = new authCreate_service_1.AuthCreateservice(userRepository, companyRepository, adminRepository, individualRepository, invitationRepository, addressRepository, exports.sharedServices, exports.redisService, infrastructure_1.emailQueue, utils_1.logger);
// Auth read service instance
exports.authReadService = new authRead_service_1.AuthReadservice(userRepository, companyRepository, adminRepository, individualRepository, exports.sharedServices, exports.redisService, utils_1.logger);
exports.invitationCreateService = new invitationCreate_service_1.InvitationCreateService(invitationRepository, exports.sharedServices, infrastructure_1.emailQueue, utils_1.logger);
exports.invitationReadService = new invitationRead_service_1.InvitationReadService(invitationRepository, exports.sharedServices, exports.redisService, utils_1.logger);
