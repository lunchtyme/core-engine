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
exports.RedisService = void 0;
const logger_1 = __importDefault(require("../utils/logger"));
class RedisService {
    /**
     * Constructs a new RedisCacheAdapter instance.
     *
     * @param redisClient The Redis client instance
     */
    constructor(redisClient) {
        this.redisClient = redisClient;
    }
    /**
     * Retrieves data from the cache.
     *
     * @param key The unique key for the cached data
     * @returns A promise resolving to the cached data
     */
    get(key) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.redisClient.get(key);
            }
            catch (error) {
                logger_1.default.error('Error getting value for redis via key:', error);
                throw error;
            }
        });
    }
    /**
     * Stores data in the cache.
     *
     * @param key The unique key for the cached data
     * @param value The data to be stored
     * @param shouldExpire A boolean indicating if the cached data should be deleted after the provided ttl
     * @param ttl Expiry time in seconds (only applicable if shouldExpire is true)
     * @returns A promise resolving when the data is stored
     */
    set(key_1, value_1) {
        return __awaiter(this, arguments, void 0, function* (key, value, shouldExpire = false, expiresInSecs = 0) {
            try {
                if (shouldExpire) {
                    if (!expiresInSecs || expiresInSecs <= 0) {
                        throw new Error('Expiration time must be a positive number');
                    }
                    yield this.redisClient.set(key, value, 'EX', expiresInSecs);
                }
                else {
                    yield this.redisClient.set(key, value);
                }
            }
            catch (error) {
                logger_1.default.error('Error setting redis value:', error);
                throw error;
            }
        });
    }
    del(key) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.redisClient.del(key);
            }
            catch (error) {
                logger_1.default.error('Error deleting value from redis store:', error);
                throw error;
            }
        });
    }
}
exports.RedisService = RedisService;
