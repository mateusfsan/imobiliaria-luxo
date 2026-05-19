import mongoose from 'mongoose';

const scheduleSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true, index: true },
    date: { type: Date, required: true, index: true },
    notes: { type: String, trim: true, maxlength: 500 },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled'],
      default: 'pending',
      index: true,
    },
  },
  { timestamps: true }
);

scheduleSchema.index({ user: 1, createdAt: -1 });
scheduleSchema.index({ property: 1, date: 1 });

export const Schedule = mongoose.model('Schedule', scheduleSchema);
