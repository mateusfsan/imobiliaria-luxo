import * as scheduleService from '../services/scheduleService.js';

export async function create(req, res, next) {
  try {
    const schedule = await scheduleService.create(req.user.id, req.body);
    res.status(201).json(schedule);
  } catch (err) {
    next(err);
  }
}

export async function listMine(req, res, next) {
  try {
    const items = await scheduleService.listForUser(req.user.id);
    res.json({ items });
  } catch (err) {
    next(err);
  }
}

export async function listAll(req, res, next) {
  try {
    const items = await scheduleService.listAll();
    res.json({ items });
  } catch (err) {
    next(err);
  }
}

export async function bookedTimes(req, res, next) {
  try {
    const { propertyId, date } = req.query;
    if (!propertyId || !date) {
      return res.status(400).json({
        error: { code: 'MISSING_PARAMS', message: 'propertyId e date são obrigatórios' },
      });
    }
    const times = await scheduleService.getBookedTimes(propertyId, date);
    res.json({ times });
  } catch (err) {
    next(err);
  }
}

export async function cancel(req, res, next) {
  try {
    const schedule = await scheduleService.cancelOwn(req.user.id, req.params.id);
    res.json(schedule);
  } catch (err) {
    next(err);
  }
}

export async function updateStatus(req, res, next) {
  try {
    const schedule = await scheduleService.updateStatus(req.params.id, req.body.status);
    res.json(schedule);
  } catch (err) {
    next(err);
  }
}
