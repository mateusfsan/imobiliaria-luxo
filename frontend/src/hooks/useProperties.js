import { useEffect, useState } from 'react';
import { listProperties, getProperty } from '../services/propertyService.js';

export function useProperties(params = {}) {
  const key = JSON.stringify(params);
  const [state, setState] = useState({ data: null, loading: true, error: null });

  useEffect(() => {
    let active = true;
    setState((s) => ({ ...s, loading: true, error: null }));
    listProperties(params)
      .then((data) => active && setState({ data, loading: false, error: null }))
      .catch((err) => active && setState({ data: null, loading: false, error: err }));
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return state;
}

export function useProperty(id) {
  const [state, setState] = useState({ data: null, loading: true, error: null });

  useEffect(() => {
    if (!id) return;
    let active = true;
    setState({ data: null, loading: true, error: null });
    getProperty(id)
      .then((data) => active && setState({ data, loading: false, error: null }))
      .catch((err) => active && setState({ data: null, loading: false, error: err }));
    return () => {
      active = false;
    };
  }, [id]);

  return state;
}
