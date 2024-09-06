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
exports.AddressRepository = void 0;
const utils_1 = require("../utils");
const infrastructure_1 = require("../infrastructure");
class AddressRepository {
    create(params, session) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = new infrastructure_1.AddressModel(params);
                return yield result.save({ session });
            }
            catch (error) {
                utils_1.logger.error('Error storing address to db:', error);
                throw error;
            }
        });
    }
    checkIfExist(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const address = yield infrastructure_1.AddressModel.exists({ user: user_id }).exec();
                return !!address;
            }
            catch (error) {
                utils_1.logger.error('Error checking user exist from db:', error);
                throw error;
            }
        });
    }
}
exports.AddressRepository = AddressRepository;
