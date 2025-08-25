import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema({
  plate: { type: String, required: true, index: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  slotName: { type: String },
  status: { type: String, enum: ['Parked', 'Paid', 'Exited'], default: 'Parked' },
  paymentStatus: { type: String, enum: ['Unpaid', 'Paid'], default: 'Unpaid' },
  entryTime: { type: Date, default: Date.now },
  exitTime: { type: Date },
  createdBy: { type: String },
}, { timestamps: true });

export const Vehicle = mongoose.model('Vehicle', vehicleSchema);
