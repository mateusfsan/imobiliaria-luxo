import * as favoriteService from '../services/favoriteService.js';

export async function list(req, res, next) {
  try {
    const items = await favoriteService.list(req.user.id);
    res.json({ items });
  } catch (err) {
    next(err);
  }
}

export async function listIds(req, res, next) {
  try {
    const ids = await favoriteService.listIds(req.user.id);
    res.json({ ids });
  } catch (err) {
    next(err);
  }
}

export async function add(req, res, next) {
  try {
    await favoriteService.add(req.user.id, req.params.propertyId);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

export async function remove(req, res, next) {
  try {
    await favoriteService.remove(req.user.id, req.params.propertyId);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}
