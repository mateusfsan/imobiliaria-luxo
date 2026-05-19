import { Router } from 'express';
import { z } from 'zod';
import { validate } from '../middlewares/validate.js';
import { requireAuth, requireAdmin } from '../middlewares/auth.js';
import { uploadImages } from '../middlewares/upload.js';
import * as propertyController from '../controllers/propertyController.js';

const propertySchema = z.object({
  title: z.string().min(3).max(160),
  description: z.string().min(10),
  price: z.coerce.number().positive(),

  city: z.string().min(2),
  state: z.string().length(2),

  bedrooms: z.coerce.number().int().min(0),
  bathrooms: z.coerce.number().int().min(0),
  parking: z.coerce.number().int().min(0),
  area: z.coerce.number().positive(),

  highlight: z.coerce.boolean().optional(),
  luxuryLevel: z.coerce.number().int().min(1).max(5).optional(),
});

const updateSchema = propertySchema.partial();

export const propertyRoutes = Router();

propertyRoutes.get('/', propertyController.list);
propertyRoutes.get('/:id', propertyController.getById);

propertyRoutes.post(
  '/',
  requireAuth,
  requireAdmin,
  validate(propertySchema),
  propertyController.create
);

propertyRoutes.put(
  '/:id',
  requireAuth,
  requireAdmin,
  validate(updateSchema),
  propertyController.update
);

propertyRoutes.delete(
  '/:id',
  requireAuth,
  requireAdmin,
  propertyController.remove
);

propertyRoutes.post(
  '/:id/images',
  requireAuth,
  requireAdmin,
  uploadImages,
  propertyController.addImages
);

const removeImageSchema = z.object({ publicId: z.string().min(1) });

propertyRoutes.delete(
  '/:id/images',
  requireAuth,
  requireAdmin,
  validate(removeImageSchema),
  propertyController.removeImage
);
