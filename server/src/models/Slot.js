import mongoose from 'mongoose';

const slotSchema = new mongoose.Schema({
  name: { type: String, unique: true, required: true },
  area: { type: String },
  total: { type: Number, default: 0 },
  free: { type: Number, default: 0 },
  active: { type: Boolean, default: true },
}, { timestamps: true });

export const Slot = mongoose.model('Slot', slotSchema);
