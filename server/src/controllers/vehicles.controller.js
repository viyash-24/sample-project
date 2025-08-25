import { Vehicle } from '../models/Vehicle.js';
import { Slot } from '../models/Slot.js';
import { Payment } from '../models/Payment.js';
import { nanoid } from 'nanoid';

export async function listVehicles(_req, res) {
  const vehicles = await Vehicle.find().sort({ createdAt: -1 });
  res.json({ vehicles });
}

export async function createVehicle(req, res) {
  const { plate, userEmail, slotName } = req.body;
  const v = await Vehicle.create({
    plate: (plate||'').toUpperCase(),
    slotName: slotName || null,
    status: 'Parked',
    paymentStatus: 'Unpaid',
    createdBy: req.user?.email || 'system'
  });
  if (slotName) {
    const s = await Slot.findOne({ name: slotName });
    if (s) { s.free = Math.max(0, (s.free ?? 0) - 1); await s.save(); }
  }
  res.json({ vehicle: v });
}

export async function markPaid(req, res) {
  const { id } = req.params;
  const { amount = 50, method = 'Manual' } = req.body;
  const v = await Vehicle.findById(id);
  if (!v) return res.status(404).json({ error: 'Vehicle not found' });
  v.paymentStatus = 'Paid';
  v.status = 'Paid';
  await v.save();
  const p = await Payment.create({ vehicleId: v._id, amount, method, status: 'Success', receiptId: nanoid(8) });
  res.json({ vehicle: v, payment: p });
}

export async function exitVehicle(req, res) {
  const { id } = req.params;
  const v = await Vehicle.findById(id);
  if (!v) return res.status(404).json({ error: 'Vehicle not found' });
  v.status = 'Exited';
  v.exitTime = new Date();
  await v.save();
  if (v.slotName) {
    const s = await Slot.findOne({ name: v.slotName });
    if (s) { s.free = (s.free ?? 0) + 1; await s.save(); }
  }
  res.json({ vehicle: v });
}
