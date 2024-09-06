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
exports.CompanyRepository = void 0;
const infrastructure_1 = require("../infrastructure");
const utils_1 = require("../utils");
class CompanyRepository {
    create(params, session) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = new infrastructure_1.CompanyModel(params);
                return yield result.save({ session });
            }
            catch (error) {
                utils_1.logger.error('Error storing company to db:', error);
                throw error;
            }
        });
    }
    update(params, session) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updateQuery = Object.assign({}, params);
                const options = {};
                if (session) {
                    options.session = session;
                }
                const result = yield infrastructure_1.CompanyModel.updateOne({ user: params.user }, updateQuery, options);
                return result.acknowledged;
            }
            catch (error) {
                utils_1.logger.error('Error updating company user in db:', error);
                throw error;
            }
        });
    }
}
exports.CompanyRepository = CompanyRepository;
