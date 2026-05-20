import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { listProperties, deleteProperty } from '../../services/propertyService.js';
import { formatPrice } from '../../utils/format.js';

export default function AdminProperties() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState(null);

  const load = () => {
    setLoading(true);
    listProperties({ limit: 60 })
      .then(setData)
      .catch(() => setData({ items: [], total: 0 }))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (property) => {
    const ok = window.confirm(`Remover "${property.title}"? Esta ação não pode ser desfeita.`);
    if (!ok) return;
    setError(null);
    setDeletingId(property._id);
    try {
      await deleteProperty(property._id);
      setData((prev) => ({
        ...prev,
        items: prev.items.filter((p) => p._id !== property._id),
        total: prev.total - 1,
      }));
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Falha ao remover imóvel');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <>
      <Helmet>
        <title>Admin &middot; Imóveis</title>
      </Helmet>

      <header className="mb-12 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
        <div>
          <p className="label-eyebrow text-ink-secondary mb-4">Portfólio</p>
          <h1 className="font-serif text-h1">Imóveis</h1>
          {data && (
            <p className="mt-3 text-sm text-ink-secondary">
              {data.total} {data.total === 1 ? 'imóvel cadastrado' : 'imóveis cadastrados'}
            </p>
          )}
        </div>
        <Link to="/admin/imoveis/novo" className="btn-gold self-start">
          Adicionar imóvel
        </Link>
      </header>

      {error && (
        <div className="mb-6 px-5 py-4 border border-gold/40 text-sm text-gold">
          {error}
        </div>
      )}

      {loading && (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 bg-card animate-pulse" />
          ))}
        </div>
      )}

      {!loading && data?.items?.length > 0 && (
        <ul className="border border-subtle divide-y divide-white/[0.06]">
          {data.items.map((p) => (
            <li key={p._id} className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 sm:p-5">
              <div className="w-full sm:w-24 h-24 bg-card overflow-hidden shrink-0">
                {p.images?.[0] && (
                  <img src={p.images[0].url} alt={p.title} className="h-full w-full object-cover" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  {p.highlight && (
                    <span className="label-eyebrow text-gold">Destaque</span>
                  )}
                  <span className="label-eyebrow text-ink-secondary">
                    {p.city} &middot; {p.state}
                  </span>
                </div>
                <h2 className="font-serif text-lg truncate">{p.title}</h2>
                <p className="mt-1 text-sm text-gold">{formatPrice(p.price)}</p>
              </div>

              <div className="flex gap-3 shrink-0">
                <Link
                  to={`/imoveis/${p._id}`}
                  target="_blank"
                  className="text-xs uppercase tracking-wider text-ink-secondary hover:text-ink-primary transition-colors px-4 py-2 border border-subtle"
                >
                  Ver
                </Link>
                <Link
                  to={`/admin/imoveis/${p._id}/editar`}
                  className="text-xs uppercase tracking-wider text-gold hover:bg-gold hover:text-black transition-colors px-4 py-2 border border-gold"
                >
                  Editar
                </Link>
                <button
                  onClick={() => handleDelete(p)}
                  disabled={deletingId === p._id}
                  className="text-xs uppercase tracking-wider text-ink-secondary hover:text-gold transition-colors px-4 py-2 border border-subtle disabled:opacity-50"
                >
                  {deletingId === p._id ? '...' : 'Remover'}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {!loading && data?.items?.length === 0 && (
        <div className="py-24 text-center border border-subtle">
          <p className="text-ink-secondary mb-6">Nenhum imóvel cadastrado ainda.</p>
          <Link to="/admin/imoveis/novo" className="btn-gold">
            Adicionar primeiro imóvel
          </Link>
        </div>
      )}
    </>
  );
}
