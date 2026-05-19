import { api } from './api.js';

export async function listProperties(params = {}) {
  const { data } = await api.get('/properties', { params });
  return data;
}

export async function getProperty(id) {
  const { data } = await api.get(`/properties/${id}`);
  return data;
}

export async function createProperty(payload) {
  const { data } = await api.post('/properties', payload);
  return data;
}

export async function updateProperty(id, payload) {
  const { data } = await api.put(`/properties/${id}`, payload);
  return data;
}

export async function deleteProperty(id) {
  await api.delete(`/properties/${id}`);
}

export async function uploadPropertyImages(id, files) {
  const formData = new FormData();
  for (const file of files) formData.append('images', file);
  const { data } = await api.post(`/properties/${id}/images`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

export async function deletePropertyImage(id, publicId) {
  const { data } = await api.delete(`/properties/${id}/images`, {
    data: { publicId },
  });
  return data;
}
