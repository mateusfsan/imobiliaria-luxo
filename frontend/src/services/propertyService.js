import { api } from './api.js';

export async function listProperties(params = {}) {
  const { data } = await api.get('/properties', { params });
  return data;
}

export async function getProperty(id) {
  const { data } = await api.get(`/properties/${id}`);
  return data;
}
