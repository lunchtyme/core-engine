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
exports.getAllEmployeesController = exports.getAllUsersController = void 0;
const utils_1 = require("../utils");
const services_1 = require("../services");
const getAllUsersController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { limit, lastScore, lastId, query } = req.query;
        const fetchAllUsersDTO = {
            limit: limit ? parseInt(limit, 10) : 10,
            lastScore: lastScore ? parseFloat(lastScore) : undefined,
            lastId: lastId || undefined,
            query: query || undefined,
            user: req.user,
        };
        const data = yield services_1.userReadService.allUsers(fetchAllUsersDTO);
        const result = utils_1.Helper.hydrateUsers(data);
        utils_1.Helper.formatAPIResponse(res, 'All users fetched successfully', result);
    }
    catch (error) {
        next(error);
    }
});
exports.getAllUsersController = getAllUsersController;
const getAllEmployeesController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { limit, lastScore, lastId, query } = req.query;
        const fetchAllEmployeesDTO = {
            limit: limit ? parseInt(limit, 10) : 10,
            lastScore: lastScore ? parseFloat(lastScore) : undefined,
            lastId: lastId || undefined,
            query: query || undefined,
            user: req.user,
        };
        const data = yield services_1.userReadService.allEmployeesForCompany(fetchAllEmployeesDTO);
        const result = utils_1.Helper.hydrateUsers(data);
        utils_1.Helper.formatAPIResponse(res, 'All employees fetched successfully', result);
    }
    catch (error) {
        next(error);
    }
});
exports.getAllEmployeesController = getAllEmployeesController;
