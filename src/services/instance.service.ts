import { emailQueue, redisCache } from '../infrastructure';
import {
  AddressRepository,
  AdminRepository,
  BillingRepository,
  CompanyRepository,
  FoodMenuRepository,
  IndividualRepository,
  InvitationRepository,
  OrderRepository,
  UserRepository,
} from '../repository';
import { logger } from '../utils';
import { AdminReadService } from './adminRead.service';
import { AuthCreateservice } from './authCreate.service';
import { AuthReadservice } from './authRead.service';
import { BillingCreateService } from './billingCreate.service';
import { BillingReadService } from './billingRead.service';
import { FoodMenuCreateService } from './foodMenuCreate.service';
import { FoodMenuReadService } from './foodMenuRead.service';
import { InvitationCreateService } from './invitationCreate.service';
import { InvitationReadService } from './invitationRead.service';
import { OrderCreateService } from './orderCreate.service';
import { OrderReadService } from './orderRead.service';
import { RedisService } from './redis.service';
import { SharedServices } from './shared.service';
import { UserReadService } from './userRead.service';

// All repository instances
const userRepository = new UserRepository();
const companyRepository = new CompanyRepository();
const adminRepository = new AdminRepository();
const individualRepository = new IndividualRepository();
const addressRepository = new AddressRepository();
const invitationRepository = new InvitationRepository();
const foodMenuRepository = new FoodMenuRepository();
const billingRepository = new BillingRepository();
const orderRepository = new OrderRepository();

// Shared services instance
export const sharedServices = new SharedServices(userRepository);

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
