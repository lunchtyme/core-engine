import { emailQueue, redisCache } from '../infrastructure';
import {
  AddressRepository,
  AdminRepository,
  CompanyRepository,
  IndividualRepository,
  UserRepository,
} from '../repository';
import { AuthCreateservice } from './authCreate.service';
import { AuthReadservice } from './authRead.service';
import { RedisService } from './redis.service';
import { SharedServices } from './shared.service';

// All repository instances
export const userRepository = new UserRepository();
export const companyRepository = new CompanyRepository();
export const adminRepository = new AdminRepository();
export const individualRepository = new IndividualRepository();
export const addressRepository = new AddressRepository();

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
  addressRepository,
  sharedServices,
  redisService,
  emailQueue,
);

// Auth read service instance
export const authReadService = new AuthReadservice(
  userRepository,
  companyRepository,
  adminRepository,
  individualRepository,
  sharedServices,
  redisService,
);
