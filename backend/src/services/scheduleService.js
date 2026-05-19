import mongoose from 'mongoose';
import { Schedule } from '../models/Schedule.js';
import { Property } from '../models/Property.js';
import { HttpError } from '../middlewares/errorHandler.js';

function assertValidId(id) {
  if (!mongoose.isValidObjectId(id)) {
    throw new HttpError(400, 'INVALID_ID', 'ID invalido');
  }
}

export async function create(userId, { propertyId, date, notes }) {
  assertValidId(propertyId);

  const property = await Property.exists({ _id: propertyId });
  if (!property) throw new HttpError(404, 'PROPERTY_NOT_FOUND', 'Imovel nao encontrado');

  const when = new Date(date);
  if (Number.isNaN(when.getTime())) {
    throw new HttpError(400, 'INVALID_DATE', 'Data invalida');
  }
  if (when.getTime() < Date.now() + 60 * 60 * 1000) {
    throw new HttpError(400, 'DATE_TOO_SOON', 'A visita precisa ser marcada com pelo menos 1 hora de antecedencia');
  }

  return Schedule.create({
    user: userId,
    property: propertyId,
    date: when,
    notes,
  });
}

export async function listForUser(userId) {
  return Schedule.find({ user: userId })
    .populate('property', 'title city state images price')
    .sort({ date: 1 })
    .lean();
}

export async function listAll() {
  return Schedule.find()
    .populate('property', 'title city state price')
    .populate('user', 'name email')
    .sort({ date: 1 })
    .lean();
}

export async function cancelOwn(userId, scheduleId) {
  assertValidId(scheduleId);
  const schedule = await Schedule.findOne({ _id: scheduleId, user: userId });
  if (!schedule) throw new HttpError(404, 'SCHEDULE_NOT_FOUND', 'Agendamento nao encontrado');
  if (schedule.status === 'cancelled') return schedule;

  schedule.status = 'cancelled';
  await schedule.save();
  return schedule;
}

export async function updateStatus(scheduleId, status) {
  assertValidId(scheduleId);
  const schedule = await Schedule.findByIdAndUpdate(
    scheduleId,
    { status },
    { new: true, runValidators: true }
  );
  if (!schedule) throw new HttpError(404, 'SCHEDULE_NOT_FOUND', 'Agendamento nao encontrado');
  return schedule;
}
