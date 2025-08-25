import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  amount: { type: Number, required: true },
  method: { type: String, enum: ['Manual', 'UPI', 'Card', 'Wallet', 'Cash'], default: 'Manual' },
  status: { type: String, enum: ['Success', 'Offline', 'Failed'], default: 'Success' },
  time: { type: Date, default: Date.now },
  receiptId: { type: String, index: true },
}, { timestamps: true });

export const Payment = mongoose.model('Payment', paymentSchema);
