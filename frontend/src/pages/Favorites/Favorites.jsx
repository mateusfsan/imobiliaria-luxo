import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { listFavorites } from '../../services/favoriteService.js';
import { useFavoritesStore } from '../../store/favoritesStore.js';
import PropertyCard from '../../components/property/PropertyCard.jsx';

export default function Favorites() {
  const [items, setItems] = useState(null);
  const [loading, setLoading] = useState(true);
  const ids = useFavoritesStore((s) => s.ids);

  useEffect(() => {
    let active = true;
    setLoading(true);
    listFavorites()
      .then(({ items }) => active && setItems(items))
      .catch(() => active && setItems([]))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  const visible = items?.filter((p) => ids.has(p._id)) ?? null;

  return (
    <>
      <Helmet>
        <title>Minhas residências &middot; Favoritos</title>
      </Helmet>

      <section className="pt-32 pb-section">
        <div className="container-luxe">
          <div className="mb-16">
            <p className="label-eyebrow mb-4">Sua seleção</p>
            <h1 className="font-serif text-h1">Minhas residências</h1>
            {visible && (
              <p className="mt-4 text-ink-secondary text-sm">
                {visible.length} {visible.length === 1 ? 'imóvel salvo' : 'imóveis salvos'}
              </p>
            )}
          </div>

          {loading && (
            <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="aspect-[4/5] bg-card animate-pulse" />
              ))}
            </div>
          )}

          {!loading && visible?.length > 0 && (
            <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-3">
              {visible.map((p, i) => (
                <PropertyCard key={p._id} property={p} index={i} />
              ))}
            </div>
          )}

          {!loading && visible?.length === 0 && (
            <div className="py-32 text-center">
              <p className="text-ink-secondary mb-6">
                Você ainda não salvou nenhuma residência.
              </p>
              <Link to="/imoveis" className="btn-gold">
                Explorar portfólio
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
