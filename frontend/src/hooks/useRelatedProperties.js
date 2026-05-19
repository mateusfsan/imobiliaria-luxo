import { useEffect, useState } from 'react';
import { listProperties } from '../services/propertyService.js';

const LAST_FILTERS_KEY = 'imobiliaria:lastFilters';
const TARGET = 6;

function readSavedFilters() {
  try {
    const raw = sessionStorage.getItem(LAST_FILTERS_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' && Object.keys(parsed).length > 0
      ? parsed
      : null;
  } catch {
    return null;
  }
}

export function useRelatedProperties(currentId) {
  const [state, setState] = useState({ items: [], mode: 'fallback', loading: true });

  useEffect(() => {
    if (!currentId) return;
    let active = true;
    setState((s) => ({ ...s, loading: true }));

    const filters = readSavedFilters();
    const fetchRelated = filters
      ? listProperties({ ...filters, limit: TARGET + 1 }).then((res) => ({
          items: res.items.filter((p) => p._id !== currentId).slice(0, TARGET),
          mode: 'filtered',
        }))
      : Promise.resolve({ items: [], mode: 'fallback' });

    fetchRelated
      .then(async (filtered) => {
        if (filtered.items.length > 0) return filtered;
        const fb = await listProperties({ highlight: true, limit: TARGET + 1 });
        return {
          items: fb.items.filter((p) => p._id !== currentId).slice(0, TARGET),
          mode: 'fallback',
          hadFilter: Boolean(filters),
        };
      })
      .then((result) => active && setState({ ...result, loading: false }))
      .catch(() => active && setState({ items: [], mode: 'fallback', loading: false }));

    return () => {
      active = false;
    };
  }, [currentId]);

  return state;
}
