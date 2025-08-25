import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export function authRequired(req, res, next) {
  try {
    const bearer = req.headers.authorization || '';
    const token = (bearer.startsWith('Bearer ') ? bearer.slice(7) : null) || req.cookies?.token;
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    const payload = jwt.verify(token, env.JWT_SECRET);
    req.user = payload; // { id, role, email }
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
}

export function requireAdmin(req, res, next) {
  if (req.user?.role === 'admin') return next();
  return res.status(403).json({ error: 'Forbidden' });
}
