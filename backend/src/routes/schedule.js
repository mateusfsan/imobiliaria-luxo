import { Router } from 'express';
import { z } from 'zod';
import { validate } from '../middlewares/validate.js';
import { requireAuth, requireAdmin } from '../middlewares/auth.js';
import * as scheduleController from '../controllers/scheduleController.js';

const createSchema = z.object({
  propertyId: z.string().min(1, 'Imovel obrigatorio'),
  date: z.string().min(1, 'Data obrigatoria'),
  notes: z.string().max(500).optional(),
});

const statusSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'cancelled']),
});

export const scheduleRoutes = Router();

scheduleRoutes.use(requireAuth);

scheduleRoutes.post('/', validate(createSchema), scheduleController.create);
scheduleRoutes.get('/', scheduleController.listMine);
scheduleRoutes.delete('/:id', scheduleController.cancel);

scheduleRoutes.get('/admin', requireAdmin, scheduleController.listAll);
scheduleRoutes.patch('/:id/status', requireAdmin, validate(statusSchema), scheduleController.updateStatus);
