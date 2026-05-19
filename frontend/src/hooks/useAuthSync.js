import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore.js';
import { useFavoritesStore } from '../store/favoritesStore.js';

export function useAuthSync() {
  const user = useAuthStore((s) => s.user);
  const hydrate = useFavoritesStore((s) => s.hydrate);
  const reset = useFavoritesStore((s) => s.reset);

  useEffect(() => {
    if (user) hydrate();
    else reset();
  }, [user, hydrate, reset]);
}
