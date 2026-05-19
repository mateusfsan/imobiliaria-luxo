import { api } from './api.js';

export async function listFavorites() {
  const { data } = await api.get('/favorites');
  return data;
}

export async function listFavoriteIds() {
  const { data } = await api.get('/favorites/ids');
  return data.ids;
}

export async function addFavorite(propertyId) {
  await api.post(`/favorites/${propertyId}`);
}

export async function removeFavorite(propertyId) {
  await api.delete(`/favorites/${propertyId}`);
}
