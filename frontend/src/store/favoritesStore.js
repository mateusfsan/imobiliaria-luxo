import { create } from 'zustand';
import {
  listFavoriteIds,
  addFavorite as addFavoriteApi,
  removeFavorite as removeFavoriteApi,
} from '../services/favoriteService.js';

export const useFavoritesStore = create((set, get) => ({
  ids: new Set(),
  hydrated: false,

  isFavorite: (propertyId) => get().ids.has(propertyId),

  hydrate: async () => {
    try {
      const ids = await listFavoriteIds();
      set({ ids: new Set(ids), hydrated: true });
    } catch {
      set({ hydrated: true });
    }
  },

  reset: () => set({ ids: new Set(), hydrated: false }),

  toggle: async (propertyId) => {
    const current = new Set(get().ids);
    const wasFavorite = current.has(propertyId);

    if (wasFavorite) current.delete(propertyId);
    else current.add(propertyId);
    set({ ids: current });

    try {
      if (wasFavorite) await removeFavoriteApi(propertyId);
      else await addFavoriteApi(propertyId);
    } catch (err) {
      const rollback = new Set(get().ids);
      if (wasFavorite) rollback.add(propertyId);
      else rollback.delete(propertyId);
      set({ ids: rollback });
      throw err;
    }
  },
}));
