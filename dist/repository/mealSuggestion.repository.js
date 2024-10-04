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
exports.MealSuggestionRepository = void 0;
const infrastructure_1 = require("../infrastructure");
const base_repository_1 = require("./base.repository");
const logger_1 = __importDefault(require("../utils/logger"));
class MealSuggestionRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(infrastructure_1.MealSuggestionModel);
    }
    create(params, session) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, description, reason_for_suggestion, user } = params;
                const result = new infrastructure_1.MealSuggestionModel({
                    user: user.sub,
                    name,
                    reason_for_suggestion,
                    description,
                });
                return yield result.save({ session });
            }
            catch (error) {
                logger_1.default.error('Error storing meal suggestion', { error });
                throw error;
            }
        });
    }
    getOne(params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.getModel().findOne({ _id: params.id });
            }
            catch (error) {
                throw error;
            }
        });
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
}
exports.MealSuggestionRepository = MealSuggestionRepository;
