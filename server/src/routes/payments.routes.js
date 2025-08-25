import { Router } from 'express';
import { listPayments } from '../controllers/payments.controller.js';
import { authRequired, requireAdmin } from '../middleware/auth.js';

const r = Router();

r.use(authRequired, requireAdmin);

r.get('/', listPayments);

export default r;
