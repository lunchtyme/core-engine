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
exports.InvitationRepository = void 0;
const infrastructure_1 = require("../infrastructure");
const utils_1 = require("../utils");
class InvitationRepository {
    upsert(params, session) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { user, employee_work_email } = params;
                const updateFilter = { user, employee_work_email };
                const updateValues = Object.assign({}, params);
                return (yield infrastructure_1.InvitationModel.updateOne(updateFilter, updateValues, {
                    upsert: true,
                    session: session !== null && session !== void 0 ? session : undefined,
                }).exec()).acknowledged;
            }
            catch (error) {
                throw error;
            }
        });
    }
    checkInvitationExists(params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { employee_work_email, user } = params;
                return yield infrastructure_1.InvitationModel.exists({ employee_work_email, user }).exec();
            }
            catch (error) {
                throw error;
            }
        });
    }
    validInvitationExists(params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { user, employee_work_email, invitation_code } = params;
                const filterOptions = {
                    user,
                    employee_work_email,
                    expires_at: { $gt: new Date() },
                    status: infrastructure_1.InvitationStatus.PENDING,
                };
                if (invitation_code) {
                    filterOptions.invitation_token = invitation_code;
                }
                return yield infrastructure_1.InvitationModel.exists(filterOptions).exec();
            }
            catch (error) {
                throw error;
            }
        });
    }
    getInvitationDetails(params, session) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { employee_work_email, invitation_code } = params;
                const filterOptions = {
                    employee_work_email,
                    expires_at: { $gt: new Date() },
                    status: infrastructure_1.InvitationStatus.PENDING,
                };
                if (invitation_code) {
                    filterOptions.invitation_token = invitation_code;
                }
                let currentSession = null;
                if (session != null) {
                    currentSession = session;
                }
                return yield infrastructure_1.InvitationModel.findOne(filterOptions)
                    .session(currentSession)
                    .populate('user')
                    .exec();
            }
            catch (error) {
                throw error;
            }
        });
    }
    generateUniqueInvitationToken() {
        return __awaiter(this, arguments, void 0, function* (length = 8) {
            let token;
            let isUnique = false;
            while (!isUnique) {
                token = utils_1.Helper.generateRandomToken(length);
                const existingInvitation = yield infrastructure_1.InvitationModel.findOne({ invitation_token: token }).exec();
                if (!existingInvitation) {
                    isUnique = true;
                }
            }
            return token;
        });
    }
    deleteInvitation(invitationId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return (yield infrastructure_1.InvitationModel.deleteOne({ _id: invitationId }).exec()).acknowledged;
            }
            catch (error) {
                throw error;
            }
        });
    }
    updateInvitationStatus(params, session) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { invitationId, status } = params;
                return (yield infrastructure_1.InvitationModel.updateOne({ _id: invitationId }, { status }, { session: session !== null && session !== void 0 ? session : undefined }).exec()).acknowledged;
            }
            catch (error) {
                throw error;
            }
        });
    }
    fetchMyInvitations(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield infrastructure_1.InvitationModel.find({ user }).sort({ created_at: -1 }).exec();
            }
            catch (error) {
                throw error;
            }
        });
    }
    fetchInvitations() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield infrastructure_1.InvitationModel.find({}).sort({ created_at: -1 }).exec();
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.InvitationRepository = InvitationRepository;
