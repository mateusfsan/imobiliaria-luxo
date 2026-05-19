import { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { getProperty } from '../../services/propertyService.js';
import { createSchedule, getBookedTimes } from '../../services/scheduleService.js';
import { formatPrice } from '../../utils/format.js';
import { TIME_SLOTS, PERIODS } from '../../config/scheduleSlots.js';

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
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema), defaultValues: { time: '' } });

  const dateValue = watch('date');
  const [bookedTimes, setBookedTimes] = useState([]);
  const [loadingBooked, setLoadingBooked] = useState(false);

  useEffect(() => {
    if (!propertyId || !dateValue) {
      setBookedTimes([]);
      return;
    }
    let active = true;
    setLoadingBooked(true);
    getBookedTimes(propertyId, dateValue)
      .then((times) => {
        if (!active) return;
        setBookedTimes(times);
        if (times.includes(watch('time'))) {
          setValue('time', '', { shouldValidate: false });
        }
      })
      .catch(() => active && setBookedTimes([]))
      .finally(() => active && setLoadingBooked(false));
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateValue, propertyId]);

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

            <Controller
              control={control}
              name="time"
              render={({ field }) => {
                const availableSlots = TIME_SLOTS.filter(
                  (s) => !bookedTimes.includes(s.value)
                );
                const allTaken = dateValue && !loadingBooked && availableSlots.length === 0;

                return (
                  <div>
                    <div className="flex items-baseline justify-between mb-5">
                      <label className="label-eyebrow">Horario disponivel</label>
                      {loadingBooked && (
                        <span className="text-xs text-ink-secondary/60">verificando disponibilidade...</span>
                      )}
                    </div>

                    {!dateValue && (
                      <p className="text-sm text-ink-secondary mb-4">
                        Escolha uma data acima para ver os horarios disponiveis.
                      </p>
                    )}

                    {allTaken && (
                      <div className="border border-subtle px-6 py-8 text-center">
                        <p className="text-sm text-ink-primary mb-1">
                          Todos os horarios desta data ja foram reservados.
                        </p>
                        <p className="text-xs text-ink-secondary">
                          Por favor, escolha outra data.
                        </p>
                      </div>
                    )}

                    {!allTaken &&
                      PERIODS.map((period) => {
                        const slots = availableSlots.filter((s) => s.period === period);
                        if (slots.length === 0) return null;
                        return (
                          <div key={period} className="mb-6 last:mb-0">
                            <p className="text-xs uppercase tracking-wider text-ink-secondary/70 mb-3">
                              {period}
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {slots.map((slot) => {
                                const active = field.value === slot.value;
                                return (
                                  <button
                                    key={slot.value}
                                    type="button"
                                    disabled={!dateValue}
                                    onClick={() => dateValue && field.onChange(slot.value)}
                                    aria-pressed={active}
                                    className={`px-5 py-3 text-sm font-medium border transition-all duration-300 ease-silk min-w-[88px] ${
                                      active
                                        ? 'border-gold text-black bg-gold'
                                        : !dateValue
                                        ? 'border-subtle/50 text-ink-secondary/40 cursor-not-allowed'
                                        : 'border-subtle text-ink-secondary hover:border-ink-secondary hover:text-ink-primary'
                                    }`}
                                  >
                                    {slot.value}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}

                    {errors.time && (
                      <p className="mt-3 text-xs text-gold">{errors.time.message}</p>
                    )}
                  </div>
                );
              }}
            />

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
