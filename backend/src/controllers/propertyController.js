import * as propertyService from '../services/propertyService.js';

export async function list(req, res, next) {
  try {
    const result = await propertyService.list(req.query);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function getById(req, res, next) {
  try {
    const property = await propertyService.getById(req.params.id);
    res.json(property);
  } catch (err) {
    next(err);
  }
}

export async function create(req, res, next) {
  try {
    const property = await propertyService.create(req.body);
    res.status(201).json(property);
  } catch (err) {
    next(err);
  }
}

export async function update(req, res, next) {
  try {
    const property = await propertyService.update(req.params.id, req.body);
    res.json(property);
  } catch (err) {
    next(err);
  }
}

export async function remove(req, res, next) {
  try {
    await propertyService.remove(req.params.id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

export async function addImages(req, res, next) {
  try {
    const property = await propertyService.addImages(req.params.id, req.files);
    res.status(201).json(property);
  } catch (err) {
    next(err);
  }
}

export async function removeImage(req, res, next) {
  try {
    const property = await propertyService.removeImage(req.params.id, req.body.publicId);
    res.json(property);
  } catch (err) {
    next(err);
  }
}
