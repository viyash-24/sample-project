import { Slot } from '../models/Slot.js';

export async function listSlots(_req, res) {
  const slots = await Slot.find().sort({ name: 1 });
  res.json({ slots });
}

export async function createSlot(req, res) {
  const { name, area, total = 0, free = 0 } = req.body;
  const exists = await Slot.findOne({ name });
  if (exists) return res.status(400).json({ error: 'Slot exists' });
  const slot = await Slot.create({ name, area, total, free });
  res.json({ slot });
}

export async function updateSlot(req, res) {
  const { id } = req.params;
  const { total, free, area, active } = req.body;
  const slot = await Slot.findByIdAndUpdate(id, { $set: { total, free, area, active } }, { new: true });
  res.json({ slot });
}
