import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String, required: true },
  },
  { _id: false }
);

const propertySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 160 },
    description: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },

    city: { type: String, required: true, trim: true, index: true },
    state: { type: String, required: true, trim: true, uppercase: true, maxlength: 2 },

    bedrooms: { type: Number, required: true, min: 0 },
    bathrooms: { type: Number, required: true, min: 0 },
    parking: { type: Number, required: true, min: 0 },
    area: { type: Number, required: true, min: 0 },

    images: { type: [imageSchema], default: [] },

    highlight: { type: Boolean, default: false, index: true },
    luxuryLevel: { type: Number, min: 1, max: 5, default: 3 },
  },
  { timestamps: true }
);

propertySchema.index({ price: 1 });
propertySchema.index({ city: 1, bedrooms: 1 });

export const Property = mongoose.model('Property', propertySchema);
