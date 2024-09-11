import { Model, Types, Document, PipelineStage } from 'mongoose';

interface PaginateCursorParams {
  limit: number;
  lastScore?: number;
  lastId?: string;
  sortBy?: Record<string, 1 | -1>;
  excludeFields?: string[];
}

export class BaseRepository<T extends Document> {
  private readonly model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  getModel(): Model<T> {
    return this.model;
  }

  async paginateAndAggregateCursor(
    pipeline: PipelineStage[],
    {
      lastScore,
      lastId,
      limit,
      sortBy = { created_at: -1 }, // Default sort field
      excludeFields = [],
    }: PaginateCursorParams,
  ): Promise<{ list: T[]; lastScore: number | null; lastId: string | null }> {
    const cursorPipeline: PipelineStage[] = [...pipeline];

    // Optional cursor pagination logic (only if lastScore and lastId are provided)
    if (lastId) {
      const matchConditions: any = { _id: { $lt: new Types.ObjectId(lastId) } };

      if (lastScore !== undefined) {
        matchConditions.$or = [
          { score: { $lt: lastScore } },
          { score: lastScore, _id: { $lt: new Types.ObjectId(lastId) } },
        ];
      }

      cursorPipeline.push({ $match: matchConditions });
    }

    // Optional exclusion of fields
    if (excludeFields.length > 0) {
      const projection = excludeFields.reduce((acc, field) => {
        acc[field] = 0;
        return acc;
      }, {} as Record<string, 0>);
      cursorPipeline.push({ $project: projection });
    }

    cursorPipeline.push({ $sort: { ...sortBy } }, { $limit: limit + 1 });

    const result = await this.model.aggregate(cursorPipeline).exec();
    const list = result.slice(0, limit);
    const lastItem = list[list.length - 1] ?? null;

    // Use the fallback field for pagination
    const newLastScore = lastItem?.score ?? null;
    const newLastId = lastItem?._id.toString() ?? null;

    return { list, lastScore: newLastScore, lastId: newLastId };
  }
}
