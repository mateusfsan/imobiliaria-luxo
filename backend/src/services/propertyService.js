import { Property } from '../models/Property.js';
import { HttpError } from '../middlewares/errorHandler.js';
import { uploadBuffer, destroyImage } from '../config/cloudinary.js';

export async function list(query = {}) {
  const filter = {};

  if (query.city) filter.city = new RegExp(`^${query.city}$`, 'i');
  if (query.state) filter.state = query.state.toUpperCase();
  if (query.bedrooms) filter.bedrooms = { $gte: Number(query.bedrooms) };
  if (query.highlight === 'true') filter.highlight = true;

  if (query.priceMin || query.priceMax) {
    filter.price = {};
    if (query.priceMin) filter.price.$gte = Number(query.priceMin);
    if (query.priceMax) filter.price.$lte = Number(query.priceMax);
  }

  const limit = Math.min(Number(query.limit) || 24, 60);
  const page = Math.max(Number(query.page) || 1, 1);
  const skip = (page - 1) * limit;

  const sort = query.sort === 'price_asc' ? { price: 1 }
            : query.sort === 'price_desc' ? { price: -1 }
            : { createdAt: -1 };

  const [items, total] = await Promise.all([
    Property.find(filter).sort(sort).skip(skip).limit(limit).lean(),
    Property.countDocuments(filter),
  ]);

  return { items, total, page, limit, pages: Math.ceil(total / limit) };
}

export async function getById(id) {
  const property = await Property.findById(id).lean();
  if (!property) throw new HttpError(404, 'PROPERTY_NOT_FOUND', 'Imóvel não encontrado');
  return property;
}

export async function create(data) {
  return Property.create(data);
}

export async function update(id, data) {
  const property = await Property.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!property) throw new HttpError(404, 'PROPERTY_NOT_FOUND', 'Imóvel não encontrado');
  return property;
}

export async function remove(id) {
  const property = await Property.findById(id);
  if (!property) throw new HttpError(404, 'PROPERTY_NOT_FOUND', 'Imóvel não encontrado');

  await Promise.all(property.images.map((img) => destroyImage(img.publicId)));
  await property.deleteOne();
}

export async function addImages(id, files) {
  if (!files || files.length === 0) {
    throw new HttpError(400, 'NO_FILES', 'Nenhuma imagem enviada');
  }

  const property = await Property.findById(id);
  if (!property) throw new HttpError(404, 'PROPERTY_NOT_FOUND', 'Imóvel não encontrado');

  const uploaded = await Promise.all(files.map((f) => uploadBuffer(f.buffer)));
  property.images.push(...uploaded);
  await property.save();
  return property;
}

export async function removeImage(id, publicId) {
  const property = await Property.findById(id);
  if (!property) throw new HttpError(404, 'PROPERTY_NOT_FOUND', 'Imóvel não encontrado');

  const before = property.images.length;
  property.images = property.images.filter((img) => img.publicId !== publicId);
  if (property.images.length === before) {
    throw new HttpError(404, 'IMAGE_NOT_FOUND', 'Imagem não encontrada');
  }

  await destroyImage(publicId);
  await property.save();
  return property;
}
