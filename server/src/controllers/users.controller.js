import { User } from '../models/User.js';
import { hashPassword } from '../utils/passwords.js';

export async function listUsers(_req, res) {
  const users = await User.find().select('-passwordHash').sort({ createdAt: -1 });
  res.json({ users });
}

export async function createUser(req, res) {
  const { name, email, phone, password = 'changeme123', role = 'user' } = req.body;
  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) return res.status(400).json({ error: 'Email already exists' });
  const passwordHash = await hashPassword(password);
  const user = await User.create({ name, email: email.toLowerCase(), phone, passwordHash, role });
  res.json({ user: { id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role } });
}
