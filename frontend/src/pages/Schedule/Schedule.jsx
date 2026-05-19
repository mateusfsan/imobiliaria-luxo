import { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { getProperty } from '../../services/propertyService.js';
import { createSchedule } from '../../services/scheduleService.js';
import { formatPrice } from '../../utils/format.js';

const schema = z.object({
  date: z.string().min(1, 'Escolha uma data'),
  time: z.string().min(1, 'Escolha um horario'),
  notes: z.string().max(500).optional(),
});

function minDateString() {
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
  return tomorrow.toISOString().split('T')[0];
}

export default function Schedule() {
  const location = useLocation();
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const propertyId = location.state?.propertyId || params.get('imovel');
  const [property, setProperty] = useState(null);
  const [loadingProperty, setLoadingProperty] = useState(Boolean(propertyId));
  const [serverError, setServerError] = useState(null);
  const [success, setSuccess] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (!propertyId) {
      setLoadingProperty(false);
      return;
    }
    let active = true;
    getProperty(propertyId)
      .then((data) => active && setProperty(data))
      .catch(() => active && setProperty(null))
      .finally(() => active && setLoadingProperty(false));
    return () => {
      active = false;
    };
  }, [propertyId]);

  const minDate = useMemo(minDateString, []);

  const onSubmit = async ({ date, time, notes }) => {
    if (!propertyId) {
      setServerError('Selecione um imovel a partir do portfolio');
      return;
    }
    setServerError(null);
    try {
      const isoDate = new Date(`${date}T${time}:00`).toISOString();
      const schedule = await createSchedule({
        propertyId,
        date: isoDate,
        notes: notes || undefined,
      });
      setSuccess(schedule);
    } catch (err) {
      setServerError(err.response?.data?.error?.message || 'Nao foi possivel agendar');
    }
  };

  if (!propertyId) {
    return (
      <div className="pt-40 container-luxe text-center min-h-[60vh]">
        <p className="text-ink-secondary mb-6">
          Escolha uma residencia no portfolio para agendar uma visita.
        </p>
        <Link to="/imoveis" className="btn-gold">
          Ver portfolio
        </Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="pt-32 pb-section">
        <Helmet>
          <title>Visita agendada</title>
        </Helmet>
        <div className="container-luxe max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="label-eyebrow text-gold mb-6">Pedido recebido</p>
            <h1 className="font-serif text-h2 mb-6">Visita solicitada com sucesso</h1>
            <p className="text-ink-secondary leading-relaxed mb-10">
              Em breve nossa equipe entrara em contato para confirmar a data e os detalhes
              da sua visita. Voce pode acompanhar o status na area "Minhas visitas".
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/minhas-visitas" className="btn-gold">
                Minhas visitas
              </Link>
              <button
                onClick={() => navigate('/imoveis')}
                className="text-sm uppercase tracking-wider text-ink-secondary hover:text-gold transition-colors px-7 py-3"
              >
                Voltar ao portfolio
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Agendar visita</title>
      </Helmet>

      <section className="pt-32 pb-section">
        <div className="container-luxe max-w-3xl">
          <p className="label-eyebrow mb-4">Atendimento exclusivo</p>
          <h1 className="font-serif text-h1 mb-12">Agendar visita</h1>

          {loadingProperty && <div className="h-24 bg-card animate-pulse mb-12" />}

          {property && (
            <div className="flex items-center gap-6 border border-subtle p-6 mb-12">
              <div className="w-24 h-24 bg-card overflow-hidden shrink-0">
                {property.images?.[0] && (
                  <img
                    src={property.images[0].url}
                    alt={property.title}
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="label-eyebrow text-ink-secondary mb-1">
                  {property.city} &middot; {property.state}
                </p>
                <h2 className="font-serif text-xl truncate">{property.title}</h2>
                <p className="mt-2 text-gold text-sm">{formatPrice(property.price)}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
            <div className="grid sm:grid-cols-2 gap-8">
              <div>
                <label className="label-eyebrow block mb-3">Data</label>
                <input
                  type="date"
                  min={minDate}
                  className="input-line"
                  {...register('date')}
                />
                {errors.date && <p className="mt-2 text-xs text-gold">{errors.date.message}</p>}
              </div>
              <div>
                <label className="label-eyebrow block mb-3">Horario</label>
                <input type="time" className="input-line" {...register('time')} />
                {errors.time && <p className="mt-2 text-xs text-gold">{errors.time.message}</p>}
              </div>
            </div>

            <div>
              <label className="label-eyebrow block mb-3">Observacoes (opcional)</label>
              <textarea
                rows="4"
                placeholder="Conte sobre suas preferencias, melhores horarios alternativos..."
                className="input-line resize-none"
                {...register('notes')}
              />
              {errors.notes && <p className="mt-2 text-xs text-gold">{errors.notes.message}</p>}
            </div>

            {serverError && (
              <p className="text-sm text-gold/90 text-center">{serverError}</p>
            )}

            <div className="pt-4">
              <button type="submit" disabled={isSubmitting} className="btn-gold w-full sm:w-auto disabled:opacity-50">
                {isSubmitting ? 'Enviando...' : 'Solicitar visita'}
              </button>
              <p className="mt-4 text-xs text-ink-secondary">
                Atendimento exclusivamente com hora marcada. Confirmaremos por contato direto.
              </p>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
