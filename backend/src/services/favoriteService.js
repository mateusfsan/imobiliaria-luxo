import mongoose from 'mongoose';
import { User } from '../models/User.js';
import { Property } from '../models/Property.js';
import { HttpError } from '../middlewares/errorHandler.js';

function assertValidId(id) {
  if (!mongoose.isValidObjectId(id)) {
    throw new HttpError(400, 'INVALID_ID', 'ID invalido');
  }
}

export async function add(userId, propertyId) {
  assertValidId(propertyId);

  const property = await Property.exists({ _id: propertyId });
  if (!property) throw new HttpError(404, 'PROPERTY_NOT_FOUND', 'Imovel nao encontrado');

  await User.updateOne(
    { _id: userId },
    { $addToSet: { favorites: propertyId } }
  );
}

export async function remove(userId, propertyId) {
  assertValidId(propertyId);
  await User.updateOne(
    { _id: userId },
    { $pull: { favorites: propertyId } }
  );
}

export async function list(userId) {
  const user = await User.findById(userId)
    .populate({
      path: 'favorites',
      options: { sort: { createdAt: -1 } },
    })
    .lean();

  return user?.favorites || [];
}

export async function listIds(userId) {
  const user = await User.findById(userId).select('favorites').lean();
  return (user?.favorites || []).map(String);
}
