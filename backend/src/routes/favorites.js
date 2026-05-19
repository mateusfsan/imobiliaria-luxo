import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.js';
import * as favoriteController from '../controllers/favoriteController.js';

export const favoriteRoutes = Router();

favoriteRoutes.use(requireAuth);

favoriteRoutes.get('/', favoriteController.list);
favoriteRoutes.get('/ids', favoriteController.listIds);
favoriteRoutes.post('/:propertyId', favoriteController.add);
favoriteRoutes.delete('/:propertyId', favoriteController.remove);
