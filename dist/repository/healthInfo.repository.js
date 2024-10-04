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
exports.HealthInfoRepository = void 0;
const infrastructure_1 = require("../infrastructure");
const base_repository_1 = require("./base.repository");
const logger_1 = __importDefault(require("../utils/logger"));
class HealthInfoRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(infrastructure_1.HealthInfoModel);
    }
    create(params, session) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { allergies, dietary_preferences, medical_conditions, user } = params;
                const result = new infrastructure_1.HealthInfoModel({
                    user,
                    allergies,
                    dietary_preferences,
                    medical_conditions,
                });
                return yield result.save({ session });
            }
            catch (error) {
                logger_1.default.error('Error saving user health info', { error });
                throw error;
            }
        });
    }
    getOne(params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.getModel().findOne({ user: params.user_id });
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.HealthInfoRepository = HealthInfoRepository;
