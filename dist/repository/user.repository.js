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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const infrastructure_1 = require("../infrastructure");
class UserRepository {
    create(params, session) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = new infrastructure_1.UserModel(params);
                return yield result.save({ session });
            }
            catch (error) {
                throw error;
            }
        });
    }
    getUser(params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { identifier, value } = params;
                let getUserFilterOptions = identifier === 'email'
                    ? { email: value }
                    : {
                        _id: mongoose_1.default.Types.ObjectId.isValid(value)
                            ? new mongoose_1.default.Types.ObjectId(value)
                            : value,
                    };
                return yield infrastructure_1.UserModel.findOne(getUserFilterOptions)
                    .populate('account_details')
                    .lean()
                    .exec();
            }
            catch (error) {
                throw error;
            }
        });
    }
    checkUserExist(params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { identifier, value } = params;
                let getUserFilterOptions = identifier === 'email'
                    ? { email: value }
                    : {
                        _id: mongoose_1.default.Types.ObjectId.isValid(value)
                            ? new mongoose_1.default.Types.ObjectId(value)
                            : value,
                    };
                const user = yield infrastructure_1.UserModel.exists(getUserFilterOptions).exec();
                return !!user;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.UserRepository = UserRepository;