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
exports.BaseRepository = void 0;
const mongoose_1 = require("mongoose");
class BaseRepository {
    constructor(model) {
        this.model = model;
    }
    getModel() {
        return this.model;
    }
    paginateAndAggregateCursor(pipeline_1, _a) {
        return __awaiter(this, arguments, void 0, function* (pipeline, { lastScore, lastId, limit, sortBy = { created_at: -1 }, // Default sort field
        excludeFields = [], }) {
            var _b, _c, _d;
            const cursorPipeline = [...pipeline];
            // Optional cursor pagination logic (only if lastScore and lastId are provided)
            if (lastId) {
                const matchConditions = { _id: { $lt: new mongoose_1.Types.ObjectId(lastId) } };
                if (lastScore !== undefined) {
                    matchConditions.$or = [
                        { score: { $lt: lastScore } },
                        { score: lastScore, _id: { $lt: new mongoose_1.Types.ObjectId(lastId) } },
                    ];
                }
                cursorPipeline.push({ $match: matchConditions });
            }
            // Optional exclusion of fields
            if (excludeFields.length > 0) {
                const projection = excludeFields.reduce((acc, field) => {
                    acc[field] = 0;
                    return acc;
                }, {});
                cursorPipeline.push({ $project: projection });
            }
            cursorPipeline.push({ $sort: Object.assign({}, sortBy) }, { $limit: limit + 1 });
            const result = yield this.model.aggregate(cursorPipeline).exec();
            const list = result.slice(0, limit);
            const lastItem = (_b = list[list.length - 1]) !== null && _b !== void 0 ? _b : null;
            // Use the fallback field for pagination
            const newLastScore = (_c = lastItem === null || lastItem === void 0 ? void 0 : lastItem.score) !== null && _c !== void 0 ? _c : null;
            const newLastId = (_d = lastItem === null || lastItem === void 0 ? void 0 : lastItem._id.toString()) !== null && _d !== void 0 ? _d : null;
            return { list, lastScore: newLastScore, lastId: newLastId };
        });
    }
}
exports.BaseRepository = BaseRepository;
