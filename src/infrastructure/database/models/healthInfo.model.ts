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

export interface HealthInfoDocument extends HealthInfo, Document {}

// Pre-save hook to transform health-related fields
healthInfoSchema.pre<HealthInfoDocument>('save', function (next) {
  // Transform allergies to lowercase and snake_case
  this.allergies = this.allergies.map((allergen) => allergen.toLowerCase().replace(/\s+/g, '_'));

  // Transform medical_conditions to lowercase and snake_case
  this.medical_conditions = this.medical_conditions.map((condition) =>
    condition.toLowerCase().replace(/\s+/g, '_'),
  );

  // Transform dietary_preferences to lowercase and snake_case
  this.dietary_preferences = this.dietary_preferences.map((preference) =>
    preference.toLowerCase().replace(/\s+/g, '_'),
  );

  // Proceed to the next middleware or save
  next();
});

// Create indexes for the fields
healthInfoSchema.index({ allergies: 1 }, { background: true });
healthInfoSchema.index({ medical_conditions: 1 }, { background: true });
healthInfoSchema.index({ dietary_preferences: 1 }, { background: true });

export const HealthInfoModel = mongoose.model<HealthInfoDocument>('HealthInfo', healthInfoSchema);
