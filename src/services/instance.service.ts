import { emailQueue, redisCache } from '../infrastructure';
import {
  AddressRepository,
  AdminRepository,
  CompanyRepository,
  IndividualRepository,
  InvitationRepository,
  UserRepository,
} from '../repository';
import { logger } from '../utils';
import { AuthCreateservice } from './authCreate.service';
import { AuthReadservice } from './authRead.service';
import { InvitationCreateService } from './invitationCreate.service';
import { InvitationReadService } from './invitationRead.service';
import { RedisService } from './redis.service';
import { SharedServices } from './shared.service';

// All repository instances
const userRepository = new UserRepository();
const companyRepository = new CompanyRepository();
const adminRepository = new AdminRepository();
const individualRepository = new IndividualRepository();
const addressRepository = new AddressRepository();
const invitationRepository = new InvitationRepository();

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
