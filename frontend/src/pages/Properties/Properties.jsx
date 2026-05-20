import { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
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
        <title>Residências · Portfólio</title>
        <meta name="description" content="Portfólio completo de residências de alto padrão." />
      </Helmet>

      <section className="relative h-[70vh] min-h-[480px] w-full overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2400&q=80')",
          }}
          aria-hidden
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-bg" aria-hidden />

        <div className="relative h-full container-luxe flex flex-col items-center justify-center text-center">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="label-eyebrow text-gold mb-6"
          >
            Portfólio
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="font-serif text-display max-w-3xl text-ink-primary"
          >
            O portfólio completo
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.35 }}
            className="mt-6 max-w-xl text-ink-secondary"
          >
            Residências singulares selecionadas para quem busca o extraordinário.
          </motion.p>
        </div>
      </section>

      <section className="pb-section">
        <div className="container-luxe pt-section-sm md:pt-section">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-16">
            <div>
              {!loading && data && (
                <p className="text-ink-secondary text-sm">
                  {data.total} {data.total === 1 ? 'imóvel encontrado' : 'imóveis encontrados'}
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
                Nenhum imóvel corresponde aos filtros selecionados.
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
