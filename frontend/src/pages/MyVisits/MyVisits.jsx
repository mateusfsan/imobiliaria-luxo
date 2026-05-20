import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { listMySchedules, cancelSchedule } from '../../services/scheduleService.js';
import { formatPrice } from '../../utils/format.js';

const STATUS_LABEL = {
  pending: { label: 'Aguardando confirmação', tone: 'text-ink-secondary' },
  confirmed: { label: 'Confirmada', tone: 'text-gold' },
  cancelled: { label: 'Cancelada', tone: 'text-ink-secondary line-through' },
};

const fmtDate = new Intl.DateTimeFormat('pt-BR', {
  weekday: 'long',
  day: '2-digit',
  month: 'long',
  hour: '2-digit',
  minute: '2-digit',
});

export default function MyVisits() {
  const [items, setItems] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    listMySchedules()
      .then((data) => active && setItems(data))
      .catch(() => active && setItems([]))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  const handleCancel = async (id) => {
    const updated = await cancelSchedule(id);
    setItems((prev) => prev.map((s) => (s._id === id ? { ...s, ...updated } : s)));
  };

  return (
    <>
      <Helmet>
        <title>Minhas visitas</title>
      </Helmet>

      <section className="pt-32 pb-section">
        <div className="container-luxe">
          <div className="mb-16">
            <p className="label-eyebrow mb-4">Sua agenda</p>
            <h1 className="font-serif text-h1">Minhas visitas</h1>
          </div>

          {loading && (
            <div className="space-y-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-32 bg-card animate-pulse" />
              ))}
            </div>
          )}

          {!loading && items?.length > 0 && (
            <ul className="space-y-6">
              {items.map((schedule, i) => {
                const status = STATUS_LABEL[schedule.status] || STATUS_LABEL.pending;
                const property = schedule.property;
                return (
                  <motion.li
                    key={schedule._id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                    className="border border-subtle p-6 sm:p-8 flex flex-col sm:flex-row gap-6"
                  >
                    {property?.images?.[0] && (
                      <Link
                        to={`/imoveis/${property._id}`}
                        className="w-full sm:w-44 h-44 sm:h-32 bg-card overflow-hidden shrink-0"
                      >
                        <img
                          src={property.images[0].url}
                          alt={property.title}
                          className="h-full w-full object-cover"
                        />
                      </Link>
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                        <div className="min-w-0">
                          <p className="label-eyebrow text-ink-secondary mb-1">
                            {property?.city} &middot; {property?.state}
                          </p>
                          <h2 className="font-serif text-xl mb-1 truncate">
                            {property?.title || 'Imóvel removido'}
                          </h2>
                          {property?.price && (
                            <p className="text-sm text-ink-secondary">
                              {formatPrice(property.price)}
                            </p>
                          )}
                        </div>
                        <span className={`label-eyebrow ${status.tone} shrink-0`}>
                          {status.label}
                        </span>
                      </div>

                      <p className="mt-4 text-sm text-ink-primary">
                        {fmtDate.format(new Date(schedule.date))}
                      </p>

                      {schedule.notes && (
                        <p className="mt-3 text-sm text-ink-secondary leading-relaxed">
                          {schedule.notes}
                        </p>
                      )}

                      {schedule.status !== 'cancelled' && (
                        <button
                          onClick={() => handleCancel(schedule._id)}
                          className="mt-5 text-xs uppercase tracking-wider text-ink-secondary hover:text-gold transition-colors"
                        >
                          Cancelar visita
                        </button>
                      )}
                    </div>
                  </motion.li>
                );
              })}
            </ul>
          )}

          {!loading && items?.length === 0 && (
            <div className="py-32 text-center">
              <p className="text-ink-secondary mb-6">
                Você ainda não tem visitas agendadas.
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
