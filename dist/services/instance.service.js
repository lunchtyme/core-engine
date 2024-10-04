"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mealSuggestionReadService = exports.mealSuggestionCreateService = exports.orderReadService = exports.orderCreateService = exports.adminReadService = exports.billingReadService = exports.billingCreateService = exports.userReadService = exports.foodMenuReadService = exports.foodMenuCreateService = exports.invitationReadService = exports.invitationCreateService = exports.authReadService = exports.authCreateService = exports.redisService = exports.healthInfoReadService = exports.healthInfoCreateService = exports.sharedServices = exports.mealSuggestionRepository = exports.healthInfoRepository = exports.orderRepository = exports.billingRepository = exports.foodMenuRepository = exports.invitationRepository = exports.addressRepository = exports.individualRepository = exports.adminRepository = exports.companyRepository = exports.userRepository = void 0;
const infrastructure_1 = require("../infrastructure");
const emailQueue_1 = require("../infrastructure/queue/emailQueue");
const processAtQueue_1 = require("../infrastructure/queue/processAtQueue");
const repository_1 = require("../repository");
const logger_1 = __importDefault(require("../utils/logger"));
const adminRead_service_1 = require("./adminRead.service");
const authCreate_service_1 = require("./authCreate.service");
const authRead_service_1 = require("./authRead.service");
const billingCreate_service_1 = require("./billingCreate.service");
const billingRead_service_1 = require("./billingRead.service");
const foodMenuCreate_service_1 = require("./foodMenuCreate.service");
const foodMenuRead_service_1 = require("./foodMenuRead.service");
const healthInfoCreate_service_1 = require("./healthInfoCreate.service");
const healthInfoRead_service_1 = require("./healthInfoRead.service");
const invitationCreate_service_1 = require("./invitationCreate.service");
const invitationRead_service_1 = require("./invitationRead.service");
const mealSuggestionCreate_service_1 = require("./mealSuggestionCreate.service");
const mealSuggestionRead_service_1 = require("./mealSuggestionRead.service");
const orderCreate_service_1 = require("./orderCreate.service");
const orderRead_service_1 = require("./orderRead.service");
const redis_service_1 = require("./redis.service");
const shared_service_1 = require("./shared.service");
const userRead_service_1 = require("./userRead.service");
// All repository instances
exports.userRepository = new repository_1.UserRepository();
exports.companyRepository = new repository_1.CompanyRepository();
exports.adminRepository = new repository_1.AdminRepository();
exports.individualRepository = new repository_1.IndividualRepository();
exports.addressRepository = new repository_1.AddressRepository();
exports.invitationRepository = new repository_1.InvitationRepository();
exports.foodMenuRepository = new repository_1.FoodMenuRepository();
exports.billingRepository = new repository_1.BillingRepository();
exports.orderRepository = new repository_1.OrderRepository();
exports.healthInfoRepository = new repository_1.HealthInfoRepository();
exports.mealSuggestionRepository = new repository_1.MealSuggestionRepository();
// Shared services instance
exports.sharedServices = new shared_service_1.SharedServices(exports.userRepository, exports.individualRepository, emailQueue_1.emailQueue, processAtQueue_1.processAtQueue, logger_1.default);
exports.healthInfoCreateService = new healthInfoCreate_service_1.HealthInfoCreateService(exports.healthInfoRepository, logger_1.default);
exports.healthInfoReadService = new healthInfoRead_service_1.HealthInfoReadService(exports.healthInfoRepository, logger_1.default);
// Redis service instance
exports.redisService = new redis_service_1.RedisService(infrastructure_1.redisCache);
// Auth create/write service instance
exports.authCreateService = new authCreate_service_1.AuthCreateservice(exports.userRepository, exports.companyRepository, exports.adminRepository, exports.individualRepository, exports.invitationRepository, exports.addressRepository, exports.sharedServices, exports.redisService, exports.healthInfoCreateService, emailQueue_1.emailQueue, logger_1.default);
// Auth read service instance
exports.authReadService = new authRead_service_1.AuthReadservice(exports.userRepository, exports.companyRepository, exports.adminRepository, exports.individualRepository, exports.sharedServices, exports.redisService, logger_1.default);
exports.invitationCreateService = new invitationCreate_service_1.InvitationCreateService(exports.invitationRepository, exports.sharedServices, emailQueue_1.emailQueue, logger_1.default);
exports.invitationReadService = new invitationRead_service_1.InvitationReadService(exports.invitationRepository, exports.sharedServices, exports.redisService, logger_1.default);
exports.foodMenuCreateService = new foodMenuCreate_service_1.FoodMenuCreateService(exports.foodMenuRepository, logger_1.default);
exports.foodMenuReadService = new foodMenuRead_service_1.FoodMenuReadService(exports.foodMenuRepository, exports.redisService, logger_1.default);
exports.userReadService = new userRead_service_1.UserReadService(exports.userRepository, exports.companyRepository, exports.orderRepository, exports.billingRepository, exports.individualRepository, exports.redisService, logger_1.default);
exports.billingCreateService = new billingCreate_service_1.BillingCreateService(exports.companyRepository, exports.billingRepository, exports.sharedServices, emailQueue_1.emailQueue, logger_1.default);
exports.billingReadService = new billingRead_service_1.BillingReadService(exports.userRepository, exports.companyRepository, exports.adminRepository, exports.individualRepository, exports.billingRepository, exports.sharedServices, exports.redisService, logger_1.default);
exports.adminReadService = new adminRead_service_1.AdminReadService(exports.userRepository, exports.orderRepository, logger_1.default);
exports.orderCreateService = new orderCreate_service_1.OrderCreateService(exports.orderRepository, exports.foodMenuRepository, exports.individualRepository, exports.companyRepository, exports.billingCreateService, emailQueue_1.emailQueue, exports.sharedServices, logger_1.default);
exports.orderReadService = new orderRead_service_1.OrderReadService(exports.orderRepository, logger_1.default);
exports.mealSuggestionCreateService = new mealSuggestionCreate_service_1.MealSuggestionCreateService(exports.mealSuggestionRepository, logger_1.default);
exports.mealSuggestionReadService = new mealSuggestionRead_service_1.MealSuggestionReadService(exports.mealSuggestionRepository, logger_1.default);
