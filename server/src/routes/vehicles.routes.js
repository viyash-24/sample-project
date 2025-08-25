import { Router } from 'express';
import { createVehicle, listVehicles, markPaid, exitVehicle } from '../controllers/vehicles.controller.js';
import { authRequired, requireAdmin } from '../middleware/auth.js';

const r = Router();

r.use(authRequired, requireAdmin);

r.get('/', listVehicles);
r.post('/', createVehicle);
r.patch('/:id/pay', markPaid);
r.patch('/:id/exit', exitVehicle);

export default r;
