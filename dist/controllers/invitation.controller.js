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
exports.fetchInvitationsController = exports.fetchMyInvitationsController = exports.sendInvitationController = void 0;
const utils_1 = require("../utils");
const services_1 = require("../services");
const sendInvitationController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const result = yield services_1.invitationCreateService.createOrResendInvitation(Object.assign(Object.assign({}, req.body), { user: (_a = req.user) === null || _a === void 0 ? void 0 : _a.sub }));
        utils_1.Helper.formatAPIResponse(res, 'Invitation sent', result);
    }
    catch (error) {
        next(error);
    }
});
exports.sendInvitationController = sendInvitationController;
const fetchMyInvitationsController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const result = yield services_1.invitationReadService.fetchMyInvitations({ user: (_a = req.user) === null || _a === void 0 ? void 0 : _a.sub });
        utils_1.Helper.formatAPIResponse(res, 'Invitations fetched', result);
    }
    catch (error) {
        next(error);
    }
});
exports.fetchMyInvitationsController = fetchMyInvitationsController;
const fetchInvitationsController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const result = yield services_1.invitationReadService.fetchAllInvitations({ user: (_a = req.user) === null || _a === void 0 ? void 0 : _a.sub });
        utils_1.Helper.formatAPIResponse(res, 'Invitations Fetched', result);
    }
    catch (error) {
        next(error);
    }
});
exports.fetchInvitationsController = fetchInvitationsController;
