import mongoose, { Document, Schema } from 'mongoose';

const healthInfoSchema = new Schema(
  {
    allergies: {
      type: [String],
      required: true,
    },
    medical_conditions: {
      type: [String],
      required: true,
    },
    dietary_preferences: {
      type: [String],
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

export interface HealthInfo {
  allergies: string[];
  medical_conditions: string[];
  dietary_preferences: string[];
  user: Schema.Types.ObjectId;
  created_at?: Date;
  updated_at?: Date;
}

healthInfoSchema.index({ allergies: 1 }, { background: true });
healthInfoSchema.index({ medical_conditions: 1 }, { background: true });
healthInfoSchema.index({ dietary_preferences: 1 }, { background: true });

export interface HealthInfoDocument extends HealthInfo, Document {}
export const HealthInfoModel = mongoose.model<HealthInfoDocument>('HealthInfo', healthInfoSchema);
