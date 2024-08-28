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
exports.SharedServices = void 0;
class SharedServices {
    constructor(userRepo) {
        this._userRepo = userRepo;
    }
    getUser(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this._userRepo.getUser(params);
            if (!user) {
                // TODO: Refactor to use custom not found error handler
                throw new Error('User not found');
            }
            return user;
        });
    }
    checkUserExist(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._userRepo.checkUserExist(params);
        });
    }
}
exports.SharedServices = SharedServices;
