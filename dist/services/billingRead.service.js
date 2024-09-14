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
exports.BillingReadservice = void 0;
class BillingReadservice {
    constructor(_userRepo, _companyRepo, _adminRepo, _individualRepo, _sharedService, _redisService, _logger) {
        this._userRepo = _userRepo;
        this._companyRepo = _companyRepo;
        this._adminRepo = _adminRepo;
        this._individualRepo = _individualRepo;
        this._sharedService = _sharedService;
        this._redisService = _redisService;
        this._logger = _logger;
    }
    // Company/Admin
    getBillingHistory() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
            }
            catch (error) {
                this._logger.error('Error fetching employee lists', error);
                throw error;
            }
        });
    }
}
exports.BillingReadservice = BillingReadservice;
