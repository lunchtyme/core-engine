import { redisCache } from '../infrastructure';
import { emailQueue } from '../infrastructure/queue/emailQueue';
import { processAtQueue } from '../infrastructure/queue/processAtQueue';
import {
  AddressRepository,
  AdminRepository,
  BillingRepository,
  CompanyRepository,
  FoodMenuRepository,
  HealthInfoRepository,
  IndividualRepository,
  InvitationRepository,
  OrderRepository,
  UserRepository,
} from '../repository';
import logger from '../utils/logger';
import { AdminReadService } from './adminRead.service';
import { AuthCreateservice } from './authCreate.service';
import { AuthReadservice } from './authRead.service';
import { BillingCreateService } from './billingCreate.service';
import { BillingReadService } from './billingRead.service';
import { FoodMenuCreateService } from './foodMenuCreate.service';
import { FoodMenuReadService } from './foodMenuRead.service';
import { HealthInfoCreateService } from './healthInfoCreate.service';
import { HealthInfoReadService } from './healthInfoRead.service';
import { InvitationCreateService } from './invitationCreate.service';
import { InvitationReadService } from './invitationRead.service';
import { OrderCreateService } from './orderCreate.service';
import { OrderReadService } from './orderRead.service';
import { RedisService } from './redis.service';
import { SharedServices } from './shared.service';
import { UserReadService } from './userRead.service';

// All repository instances
export const userRepository = new UserRepository();
export const companyRepository = new CompanyRepository();
export const adminRepository = new AdminRepository();
export const individualRepository = new IndividualRepository();
export const addressRepository = new AddressRepository();
export const invitationRepository = new InvitationRepository();
export const foodMenuRepository = new FoodMenuRepository();
export const billingRepository = new BillingRepository();
export const orderRepository = new OrderRepository();
export const healthInfoRepository = new HealthInfoRepository();

// Shared services instance
export const sharedServices = new SharedServices(
  userRepository,
  individualRepository,
  emailQueue,
  processAtQueue,
  logger,
);

export const healthInfoCreateService = new HealthInfoCreateService(healthInfoRepository, logger);
export const healthInfoReadService = new HealthInfoReadService(healthInfoRepository, logger);

// Redis service instance
export const redisService = new RedisService(redisCache);

// Auth create/write service instance
export const authCreateService = new AuthCreateservice(
  userRepository,
  companyRepository,
  adminRepository,
  individualRepository,
  invitationRepository,
  addressRepository,
  sharedServices,
  redisService,
  healthInfoCreateService,
  emailQueue,
  logger,
);

// Auth read service instance
export const authReadService = new AuthReadservice(
  userRepository,
  companyRepository,
  adminRepository,
  individualRepository,
  sharedServices,
  redisService,
  logger,
);

export const invitationCreateService = new InvitationCreateService(
  invitationRepository,
  sharedServices,
  emailQueue,
  logger,
);

export const invitationReadService = new InvitationReadService(
  invitationRepository,
  sharedServices,
  redisService,
  logger,
);

export const foodMenuCreateService = new FoodMenuCreateService(foodMenuRepository, logger);

export const foodMenuReadService = new FoodMenuReadService(
  foodMenuRepository,
  redisService,
  logger,
);

export const userReadService = new UserReadService(
  userRepository,
  companyRepository,
  orderRepository,
  billingRepository,
  individualRepository,
  redisService,
  logger,
);

export const billingCreateService = new BillingCreateService(
  companyRepository,
  billingRepository,
  sharedServices,
  emailQueue,
  logger,
);

export const billingReadService = new BillingReadService(
  userRepository,
  companyRepository,
  adminRepository,
  individualRepository,
  billingRepository,
  sharedServices,
  redisService,
  logger,
);

export const adminReadService = new AdminReadService(userRepository, orderRepository, logger);
export const orderCreateService = new OrderCreateService(
  orderRepository,
  foodMenuRepository,
  individualRepository,
  companyRepository,
  billingCreateService,
  emailQueue,
  sharedServices,
  logger,
);
export const orderReadService = new OrderReadService(orderRepository, logger);
