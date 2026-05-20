import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useRelatedProperties } from '../../hooks/useRelatedProperties.js';
import PropertyCard from './PropertyCard.jsx';

function useVisibleCount() {
  const compute = () => {
    if (typeof window === 'undefined') return 3;
    if (window.innerWidth < 640) return 1;
    if (window.innerWidth < 1024) return 2;
    return 3;
  };
  const [count, setCount] = useState(compute);

  useEffect(() => {
    const onResize = () => setCount(compute());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return count;
}

export default function RelatedProperties({ currentId }) {
  const { items, mode, hadFilter, loading } = useRelatedProperties(currentId);
  const visible = useVisibleCount();
  const [page, setPage] = useState(0);

  const pages = Math.max(1, Math.ceil(items.length / visible));

  useEffect(() => {
    if (page >= pages) setPage(0);
  }, [page, pages]);

  const slidePercent = useMemo(() => {
    if (items.length === 0) return 0;
    return -(page * (visible / items.length) * 100);
  }, [page, visible, items.length]);

  if (!loading && items.length === 0) return null;

  const isFiltered = mode === 'filtered';
  const showFallbackMessage = mode === 'fallback' && hadFilter;

  const title = isFiltered ? 'Outras residências como esta' : 'Você também pode gostar';
  const eyebrow = isFiltered ? 'Compatível com sua busca' : 'Curadoria';

  return (
    <section className="container-luxe pt-section-sm md:pt-section pb-section-sm md:pb-section border-t border-subtle mt-section-sm">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
        <div>
          <p className="label-eyebrow mb-4">{eyebrow}</p>
          <h2 className="font-serif text-h2">{title}</h2>
          {showFallbackMessage && (
            <p className="mt-4 text-ink-secondary max-w-2xl">
              Não encontramos mais residências com os filtros selecionados, mas estas
              selecionadas podem te interessar.
            </p>
          )}
        </div>

        {pages > 1 && !loading && (
          <div className="flex items-center gap-6">
            <span className="label-eyebrow text-ink-secondary">
              {page + 1} / {pages}
            </span>
            <div className="flex gap-3">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                aria-label="Anterior"
                className="w-10 h-10 rounded-full border border-subtle text-ink-secondary hover:border-gold hover:text-gold transition-colors duration-300 disabled:opacity-30 disabled:cursor-not-allowed grid place-items-center"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              <button
                onClick={() => setPage((p) => Math.min(pages - 1, p + 1))}
                disabled={page === pages - 1}
                aria-label="Próxima"
                className="w-10 h-10 rounded-full border border-subtle text-ink-secondary hover:border-gold hover:text-gold transition-colors duration-300 disabled:opacity-30 disabled:cursor-not-allowed grid place-items-center"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>

      {loading && (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: visible }).map((_, i) => (
            <div key={i} className="aspect-[4/5] bg-card animate-pulse" />
          ))}
        </div>
      )}

      {!loading && items.length > 0 && (
        <div className="overflow-hidden">
          <motion.div
            animate={{ x: `${slidePercent}%` }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="flex"
          >
            {items.map((p, i) => (
              <div
                key={p._id}
                className="shrink-0 pr-8 last:pr-0"
                style={{ width: `${100 / visible}%` }}
              >
                <PropertyCard property={p} index={i % visible} />
              </div>
            ))}
          </motion.div>
        </div>
      )}
    </section>
  );
}
