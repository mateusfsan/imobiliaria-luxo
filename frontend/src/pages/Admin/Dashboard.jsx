import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { listProperties } from '../../services/propertyService.js';
import { listAllSchedules } from '../../services/scheduleService.js';

function StatCard({ label, value, hint, to, delay = 0 }) {
  const content = (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className="border border-subtle p-8 hover:border-gold/40 transition-colors duration-500"
    >
      <p className="label-eyebrow text-ink-secondary mb-4">{label}</p>
      <p className="font-serif text-5xl text-ink-primary">{value}</p>
      {hint && <p className="mt-3 text-xs text-ink-secondary">{hint}</p>}
    </motion.div>
  );
  return to ? <Link to={to}>{content}</Link> : content;
}

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    Promise.all([
      listProperties({ limit: 60 }),
      listProperties({ highlight: true, limit: 60 }),
      listAllSchedules(),
    ])
      .then(([all, highlighted, schedules]) => {
        if (!active) return;
        const pending = schedules.filter((s) => s.status === 'pending').length;
        const confirmed = schedules.filter((s) => s.status === 'confirmed').length;
        setStats({
          totalProperties: all.total,
          highlightedProperties: highlighted.total,
          pending,
          confirmed,
        });
      })
      .catch(() => active && setStats(null))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  return (
    <>
      <Helmet>
        <title>Admin &middot; Visao geral</title>
      </Helmet>

      <header className="mb-14">
        <p className="label-eyebrow text-ink-secondary mb-4">Painel</p>
        <h1 className="font-serif text-h1">Visao geral</h1>
      </header>

      {loading && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-40 bg-card animate-pulse" />
          ))}
        </div>
      )}

      {!loading && stats && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            label="Imoveis no portfolio"
            value={stats.totalProperties}
            hint="Total cadastrado"
            to="/admin/imoveis"
            delay={0}
          />
          <StatCard
            label="Em destaque"
            value={stats.highlightedProperties}
            hint="Aparecem na home"
            to="/admin/imoveis?destaque=true"
            delay={0.08}
          />
          <StatCard
            label="Visitas pendentes"
            value={stats.pending}
            hint="Aguardando confirmacao"
            to="/admin/visitas"
            delay={0.16}
          />
          <StatCard
            label="Visitas confirmadas"
            value={stats.confirmed}
            hint="Agendadas com cliente"
            to="/admin/visitas"
            delay={0.24}
          />
        </div>
      )}

      <section className="mt-16">
        <h2 className="font-serif text-h3 mb-6">Atalhos</h2>
        <div className="flex flex-wrap gap-4">
          <Link to="/admin/imoveis/novo" className="btn-gold">
            Adicionar imovel
          </Link>
          <Link
            to="/admin/visitas"
            className="text-sm uppercase tracking-wider text-ink-secondary hover:text-gold transition-colors px-7 py-3 border border-subtle"
          >
            Ver agendamentos
          </Link>
        </div>
      </section>
    </>
  );
}
