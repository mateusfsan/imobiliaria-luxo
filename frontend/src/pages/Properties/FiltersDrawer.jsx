import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const STATES = ['', 'SP', 'RJ', 'BA', 'MG', 'PR', 'SC', 'RS'];
const BEDROOMS = ['', '1', '2', '3', '4', '5'];
const SORTS = [
  { value: '', label: 'Mais recentes' },
  { value: 'price_asc', label: 'Menor preco' },
  { value: 'price_desc', label: 'Maior preco' },
];

export default function FiltersDrawer({ open, onClose, value, onChange, onReset }) {
  const [local, setLocal] = useState(value);

  useEffect(() => setLocal(value), [value, open]);

  const update = (patch) => setLocal((s) => ({ ...s, ...patch }));

  const apply = () => {
    onChange(local);
    onClose();
  };

  const reset = () => {
    onReset();
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-0 right-0 h-full w-full sm:w-[440px] bg-surface border-l border-subtle z-50 overflow-y-auto"
          >
            <div className="p-8 sm:p-10">
              <div className="flex items-center justify-between mb-12">
                <h2 className="font-serif text-2xl">Filtrar</h2>
                <button
                  onClick={onClose}
                  className="text-ink-secondary hover:text-gold transition-colors text-sm uppercase tracking-wider"
                  aria-label="Fechar filtros"
                >
                  Fechar
                </button>
              </div>

              <div className="space-y-10">
                <div>
                  <label className="label-eyebrow block mb-3">Cidade</label>
                  <input
                    type="text"
                    placeholder="Ex: Sao Paulo"
                    value={local.city || ''}
                    onChange={(e) => update({ city: e.target.value })}
                    className="input-line"
                  />
                </div>

                <div>
                  <label className="label-eyebrow block mb-3">Estado</label>
                  <select
                    value={local.state || ''}
                    onChange={(e) => update({ state: e.target.value })}
                    className="input-line bg-bg appearance-none cursor-pointer"
                  >
                    {STATES.map((s) => (
                      <option key={s} value={s} className="bg-surface">
                        {s || 'Todos'}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="label-eyebrow block mb-3">Quartos (minimo)</label>
                  <div className="flex flex-wrap gap-2">
                    {BEDROOMS.map((b) => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => update({ bedrooms: b })}
                        className={`px-5 py-2 text-sm border transition-all duration-300 ease-silk ${
                          (local.bedrooms || '') === b
                            ? 'border-gold text-gold'
                            : 'border-subtle text-ink-secondary hover:border-ink-secondary hover:text-ink-primary'
                        }`}
                      >
                        {b ? `${b}+` : 'Todos'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="label-eyebrow block mb-3">Preco minimo (R$)</label>
                    <input
                      type="number"
                      inputMode="numeric"
                      placeholder="0"
                      value={local.priceMin || ''}
                      onChange={(e) => update({ priceMin: e.target.value })}
                      className="input-line"
                    />
                  </div>
                  <div>
                    <label className="label-eyebrow block mb-3">Preco maximo (R$)</label>
                    <input
                      type="number"
                      inputMode="numeric"
                      placeholder="Sem limite"
                      value={local.priceMax || ''}
                      onChange={(e) => update({ priceMax: e.target.value })}
                      className="input-line"
                    />
                  </div>
                </div>

                <div>
                  <label className="label-eyebrow block mb-3">Ordenar por</label>
                  <select
                    value={local.sort || ''}
                    onChange={(e) => update({ sort: e.target.value })}
                    className="input-line bg-bg appearance-none cursor-pointer"
                  >
                    {SORTS.map((s) => (
                      <option key={s.value} value={s.value} className="bg-surface">
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-14 space-y-4">
                <button onClick={apply} className="btn-gold w-full">
                  Aplicar filtros
                </button>
                <button
                  onClick={reset}
                  className="w-full text-sm uppercase tracking-wider text-ink-secondary hover:text-gold transition-colors py-2"
                >
                  Limpar tudo
                </button>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
