"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Authservice = void 0;
class Authservice {
    constructor(userRepo, companyRepo) {
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
    authenticate() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
}
exports.Authservice = Authservice;
