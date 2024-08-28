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
exports.DB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const utils_1 = require("../../utils");
(0, utils_1.loadEnv)(process.env.NODE_ENV);
// Singleton design pattern
class Database {
    constructor() { }
    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            if (mongoose_1.default.connection.readyState === 0) {
                // Not connected
                try {
                    yield mongoose_1.default.connect(process.env.MONGO_URI, {});
                    console.log('Database connected');
                }
                catch (error) {
                    console.error('Database failed to connect', error.message);
                    process.exit(0);
                }
            }
        });
    }
    disconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            if (mongoose_1.default.connection.readyState !== 0) {
                // Connected
                try {
                    yield mongoose_1.default.disconnect();
                    console.log('Database disconnected');
                }
                catch (error) {
                    console.error('Database failed to disconnect', error.message);
                }
            }
        });
    }
}
exports.DB = Database.getInstance();
