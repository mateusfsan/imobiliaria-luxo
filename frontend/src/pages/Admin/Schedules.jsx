import { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import {
  listAllSchedules,
  updateScheduleStatus,
} from '../../services/scheduleService.js';

const STATUS_LABELS = {
  pending: { label: 'Pendente', tone: 'text-ink-primary border-subtle' },
  confirmed: { label: 'Confirmada', tone: 'text-black bg-gold border-gold' },
  cancelled: { label: 'Cancelada', tone: 'text-ink-secondary line-through border-subtle' },
};

const FILTERS = [
  { key: 'all', label: 'Todas' },
  { key: 'pending', label: 'Pendentes' },
  { key: 'confirmed', label: 'Confirmadas' },
  { key: 'cancelled', label: 'Canceladas' },
];

function fmtRequestDate(date) {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const hour = String(d.getHours()).padStart(2, '0');
  const minute = String(d.getMinutes()).padStart(2, '0');
  return `${day}/${month} as ${hour}:${minute}`;
}

const fmtDate = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});

export default function AdminSchedules() {
  const [items, setItems] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    listAllSchedules()
      .then((data) => active && setItems(data))
      .catch(() => active && setItems([]))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  const filtered = useMemo(() => {
    if (!items) return null;
    if (filter === 'all') return items;
    return items.filter((s) => s.status === filter);
  }, [items, filter]);

  const counts = useMemo(() => {
    if (!items) return {};
    return items.reduce((acc, s) => {
      acc.all = (acc.all || 0) + 1;
      acc[s.status] = (acc[s.status] || 0) + 1;
      return acc;
    }, {});
  }, [items]);

  const setStatus = async (scheduleId, status) => {
    setError(null);
    setUpdatingId(scheduleId);
    try {
      const updated = await updateScheduleStatus(scheduleId, status);
      setItems((prev) => prev.map((s) => (s._id === scheduleId ? { ...s, ...updated } : s)));
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Falha ao atualizar status');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <>
      <Helmet>
        <title>Admin &middot; Visitas</title>
      </Helmet>

      <header className="mb-12">
        <p className="label-eyebrow text-ink-secondary mb-4">Agenda</p>
        <h1 className="font-serif text-h1">Visitas agendadas</h1>
      </header>

      <div className="flex flex-wrap gap-2 mb-8">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-5 py-2 text-sm uppercase tracking-wider border transition-all duration-300 ease-silk ${
              filter === f.key
                ? 'border-gold text-gold'
                : 'border-subtle text-ink-secondary hover:border-ink-secondary hover:text-ink-primary'
            }`}
          >
            {f.label}
            {counts[f.key] !== undefined && (
              <span className="ml-2 text-xs opacity-70">({counts[f.key] || 0})</span>
            )}
          </button>
        ))}
      </div>

      {error && (
        <div className="mb-6 px-5 py-4 border border-gold/40 text-sm text-gold">
          {error}
        </div>
      )}

      {loading && (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-32 bg-card animate-pulse" />
          ))}
        </div>
      )}

      {!loading && filtered?.length > 0 && (
        <ul className="space-y-4">
          {filtered.map((schedule) => {
            const status = STATUS_LABELS[schedule.status] || STATUS_LABELS.pending;
            return (
              <li
                key={schedule._id}
                className="border border-subtle p-5 sm:p-6 grid gap-4 sm:grid-cols-12 sm:items-start"
              >
                <div className="sm:col-span-5 min-w-0">
                  <p className="label-eyebrow text-ink-secondary mb-1">
                    {schedule.property?.city} &middot; {schedule.property?.state}
                  </p>
                  <Link
                    to={`/imoveis/${schedule.property?._id || ''}`}
                    target="_blank"
                    className="font-serif text-lg hover:text-gold transition-colors block truncate"
                  >
                    {schedule.property?.title || 'Imovel removido'}
                  </Link>
                  <p className="mt-2 text-sm text-ink-secondary">
                    {schedule.user?.name} &middot; {schedule.user?.email}
                  </p>
                </div>

                <div className="sm:col-span-4">
                  <p className="label-eyebrow text-ink-secondary mb-1">Data da visita</p>
                  <p className="text-sm">{fmtDate.format(new Date(schedule.date))}</p>
                  {schedule.createdAt && (
                    <p className="mt-2 text-xs text-ink-secondary/60">
                      Solicitado em {fmtRequestDate(schedule.createdAt)}
                    </p>
                  )}
                  {schedule.notes && (
                    <p className="mt-3 text-xs text-ink-secondary leading-relaxed">
                      {schedule.notes}
                    </p>
                  )}
                </div>

                <div className="sm:col-span-3 sm:text-right space-y-3">
                  <span
                    className={`inline-block label-eyebrow border px-3 py-2 ${status.tone}`}
                  >
                    {status.label}
                  </span>

                  {schedule.status !== 'cancelled' && (
                    <div className="flex sm:justify-end gap-2 pt-2">
                      {schedule.status !== 'confirmed' && (
                        <button
                          onClick={() => setStatus(schedule._id, 'confirmed')}
                          disabled={updatingId === schedule._id}
                          className="text-xs uppercase tracking-wider text-gold hover:bg-gold hover:text-black transition-colors px-3 py-2 border border-gold disabled:opacity-50"
                        >
                          Confirmar
                        </button>
                      )}
                      <button
                        onClick={() => setStatus(schedule._id, 'cancelled')}
                        disabled={updatingId === schedule._id}
                        className="text-xs uppercase tracking-wider text-ink-secondary hover:text-ink-primary transition-colors px-3 py-2 border border-subtle disabled:opacity-50"
                      >
                        Cancelar
                      </button>
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {!loading && filtered?.length === 0 && (
        <div className="py-24 text-center border border-subtle">
          <p className="text-ink-secondary">
            {filter === 'all'
              ? 'Nenhuma visita agendada ainda.'
              : 'Nenhuma visita corresponde ao filtro.'}
          </p>
        </div>
      )}
    </>
  );
}
