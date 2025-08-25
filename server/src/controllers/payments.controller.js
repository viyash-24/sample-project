import { Payment } from '../models/Payment.js';

export async function listPayments(_req, res) {
  const payments = await Payment.find().sort({ createdAt: -1 });
  res.json({ payments });
}
