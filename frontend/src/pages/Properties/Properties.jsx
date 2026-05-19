import { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSearchParams } from 'react-router-dom';
import { useProperties } from '../../hooks/useProperties.js';
import PropertyCard from '../../components/property/PropertyCard.jsx';
import FiltersDrawer from './FiltersDrawer.jsx';

const FILTER_KEYS = ['city', 'state', 'bedrooms', 'priceMin', 'priceMax', 'sort'];
const LAST_FILTERS_KEY = 'imobiliaria:lastFilters';

function paramsToObject(searchParams) {
  const obj = {};
  for (const key of FILTER_KEYS) {
    const v = searchParams.get(key);
    if (v) obj[key] = v;
  }
  return obj;
}

export default function Properties() {
  const [searchParams, setSearchParams] = useSearchParams();
  const filters = useMemo(() => paramsToObject(searchParams), [searchParams]);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    sessionStorage.setItem(LAST_FILTERS_KEY, JSON.stringify(filters));
  }, [filters]);

  const { data, loading } = useProperties(filters);

  const activeCount = Object.keys(filters).length;

  const updateFilters = (next) => {
    const sp = new URLSearchParams();
    for (const [k, v] of Object.entries(next)) {
      if (v) sp.set(k, String(v));
    }
    setSearchParams(sp);
  };

  return (
    <>
      <Helmet>
        <title>Residencias &middot; Portfolio</title>
        <meta name="description" content="Portfolio completo de residencias de alto padrao." />
      </Helmet>

      <section className="pt-32 pb-section">
        <div className="container-luxe">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
            <div>
              <p className="label-eyebrow mb-4">Portfolio</p>
              <h1 className="font-serif text-h1">Residencias selecionadas</h1>
              {!loading && data && (
                <p className="mt-4 text-ink-secondary text-sm">
                  {data.total} {data.total === 1 ? 'imovel' : 'imoveis'} encontrados
                </p>
              )}
            </div>

            <button
              onClick={() => setDrawerOpen(true)}
              className="self-start md:self-auto inline-flex items-center gap-3 text-sm uppercase tracking-wider text-ink-primary hover:text-gold transition-colors group"
            >
              <span>Filtrar</span>
              {activeCount > 0 && (
                <span className="inline-grid place-items-center w-6 h-6 rounded-full bg-gold text-black text-xs">
                  {activeCount}
                </span>
              )}
              <span className="w-8 h-px bg-current transition-all group-hover:w-12" aria-hidden />
            </button>
          </div>

          {loading && (
            <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-[4/5] bg-card animate-pulse" />
              ))}
            </div>
          )}

          {!loading && data?.items?.length > 0 && (
            <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-3">
              {data.items.map((p, i) => (
                <PropertyCard key={p._id} property={p} index={i} />
              ))}
            </div>
          )}

          {!loading && data?.items?.length === 0 && (
            <div className="py-32 text-center">
              <p className="text-ink-secondary mb-6">
                Nenhum imovel corresponde aos filtros selecionados.
              </p>
              <button
                onClick={() => updateFilters({})}
                className="text-sm uppercase tracking-wider text-gold hover:text-gold-hover transition-colors"
              >
                Limpar filtros
              </button>
            </div>
          )}
        </div>
      </section>

      <FiltersDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        value={filters}
        onChange={updateFilters}
        onReset={() => updateFilters({})}
      />
    </>
  );
}
