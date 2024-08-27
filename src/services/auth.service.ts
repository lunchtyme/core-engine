import { CompanyRepository, UserRepository } from '../repository';
import { Admin, Company, Individual, User } from '../typings/user';
import {
  CreateAdminAccountDTO,
  CreateCompanyAccountDTO,
  CreateIndividualAccountDTO,
  RegisterAccountDTO,
} from './dtos/request.dto';

export class Authservice {
  private readonly _userRepo: UserRepository;
  private readonly _companyRepo: CompanyRepository;

  constructor(userRepo: UserRepository, companyRepo: CompanyRepository) {
    this._userRepo = userRepo;
    this._companyRepo = companyRepo;
  }

  // async register(payload: RegisterAccountDTO): Promise<User> {
  //   try {
  //     return;
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  // async registerCompany(payload: CreateCompanyAccountDTO): Promise<Company> {
  //   try {
  //     return;
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  // async registerAdmin(payload: CreateAdminAccountDTO): Promise<Admin> {
  //   try {
  //     return;
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  // async registerIndividual(payload: CreateIndividualAccountDTO): Promise<Individual> {
  //   try {
  //     return;
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  async authenticate() {}
}
