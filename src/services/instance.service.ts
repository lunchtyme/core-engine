import { emailQueue, redisCache } from '../infrastructure';
import {
  AdminRepository,
  CompanyRepository,
  IndividualRepository,
  UserRepository,
} from '../repository';
import { Authservice } from './auth.service';
import { RedisService } from './redis.service';
import { SharedServices } from './shared.service';

// All repository instances
export const userRepository = new UserRepository();
export const companyRepository = new CompanyRepository();
export const adminRepository = new AdminRepository();
export const individualRepository = new IndividualRepository();

// Shared services instance
export const sharedServices = new SharedServices(userRepository);

// Redis service instance
export const redisService = new RedisService(redisCache);

// Auth service instance
export const authService = new Authservice(
  userRepository,
  companyRepository,
  adminRepository,
  individualRepository,
  sharedServices,
  redisService,
  emailQueue,
);
