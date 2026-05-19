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

  const existing = await Schedule.findOne({
    property: propertyId,
    status: { $ne: 'cancelled' },
    date: when,
  }).lean();
  if (existing) {
    throw new HttpError(409, 'SLOT_TAKEN', 'Esse horario ja foi reservado por outro cliente');
  }

  return Schedule.create({
    user: userId,
    property: propertyId,
    date: when,
    notes,
  });
}

export async function getBookedTimes(propertyId, dateStr) {
  assertValidId(propertyId);

  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) {
    throw new HttpError(400, 'INVALID_DATE', 'Data invalida');
  }

  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);

  const schedules = await Schedule.find({
    property: propertyId,
    status: { $ne: 'cancelled' },
    date: { $gte: start, $lte: end },
  })
    .select('date')
    .lean();

  return schedules.map((s) => {
    const d = new Date(s.date);
    const h = String(d.getHours()).padStart(2, '0');
    const m = String(d.getMinutes()).padStart(2, '0');
    return `${h}:${m}`;
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
    .sort({ createdAt: 1 })
    .lean();
}

export async function cancelOwn(userId, scheduleId) {
  assertValidId(scheduleId);
  const schedule = await Schedule.findOneAndUpdate(
    { _id: scheduleId, user: userId },
    { status: 'cancelled' },
    { new: true }
  ).populate('property', 'title city state images price');
  if (!schedule) throw new HttpError(404, 'SCHEDULE_NOT_FOUND', 'Agendamento nao encontrado');
  return schedule;
}

export async function updateStatus(scheduleId, status) {
  assertValidId(scheduleId);

  if (status === 'confirmed') {
    const current = await Schedule.findById(scheduleId).select('property date status').lean();
    if (!current) throw new HttpError(404, 'SCHEDULE_NOT_FOUND', 'Agendamento nao encontrado');

    if (current.status !== 'confirmed') {
      const conflict = await Schedule.findOne({
        _id: { $ne: scheduleId },
        property: current.property,
        date: current.date,
        status: 'confirmed',
      }).lean();
      if (conflict) {
        throw new HttpError(
          409,
          'SLOT_TAKEN',
          'Ja existe uma visita confirmada para este imovel neste horario'
        );
      }
    }
  }

  const schedule = await Schedule.findByIdAndUpdate(
    scheduleId,
    { status },
    { new: true, runValidators: true }
  )
    .populate('property', 'title city state price')
    .populate('user', 'name email');
  if (!schedule) throw new HttpError(404, 'SCHEDULE_NOT_FOUND', 'Agendamento nao encontrado');
  return schedule;
}
