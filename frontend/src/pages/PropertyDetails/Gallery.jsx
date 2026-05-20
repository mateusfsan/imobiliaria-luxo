import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Gallery({ images = [], title }) {
  const [openIndex, setOpenIndex] = useState(null);

  useEffect(() => {
    const onKey = (e) => {
      if (openIndex === null) return;
      if (e.key === 'Escape') setOpenIndex(null);
      if (e.key === 'ArrowRight') setOpenIndex((i) => (i + 1) % images.length);
      if (e.key === 'ArrowLeft') setOpenIndex((i) => (i - 1 + images.length) % images.length);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [openIndex, images.length]);

  if (images.length === 0) return null;

  const [cover, ...rest] = images;

  return (
    <>
      <div className="grid gap-2 md:gap-3 md:grid-cols-12">
        <button
          onClick={() => setOpenIndex(0)}
          className="md:col-span-8 relative aspect-[16/10] overflow-hidden bg-card group"
        >
          <img
            src={cover.url}
            alt={title}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] ease-silk group-hover:scale-[1.03]"
          />
        </button>

        <div className="md:col-span-4 grid grid-cols-2 md:grid-cols-1 gap-2 md:gap-3">
          {rest.slice(0, 4).map((img, i) => (
            <button
              key={img.publicId || i}
              onClick={() => setOpenIndex(i + 1)}
              className="relative aspect-[4/3] md:aspect-[16/10] overflow-hidden bg-card group"
            >
              <img
                src={img.url}
                alt={`${title} - foto ${i + 2}`}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] ease-silk group-hover:scale-[1.03]"
              />
              {i === 3 && rest.length > 4 && (
                <div className="absolute inset-0 bg-black/60 grid place-items-center text-sm uppercase tracking-wider text-ink-primary">
                  + {rest.length - 4} fotos
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {openIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-black/95 grid place-items-center p-4 sm:p-10"
            onClick={() => setOpenIndex(null)}
          >
            <button
              onClick={() => setOpenIndex(null)}
              className="absolute top-6 right-6 sm:top-10 sm:right-10 text-ink-secondary hover:text-gold text-sm uppercase tracking-wider transition-colors"
              aria-label="Fechar galeria"
            >
              Fechar
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setOpenIndex((i) => (i - 1 + images.length) % images.length);
              }}
              className="absolute left-4 sm:left-10 top-1/2 -translate-y-1/2 text-ink-secondary hover:text-gold text-4xl transition-colors"
              aria-label="Anterior"
            >
              &larr;
            </button>

            <motion.img
              key={openIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              src={images[openIndex].url}
              alt={`${title} - foto ${openIndex + 1}`}
              className="max-h-full max-w-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />

            <button
              onClick={(e) => {
                e.stopPropagation();
                setOpenIndex((i) => (i + 1) % images.length);
              }}
              className="absolute right-4 sm:right-10 top-1/2 -translate-y-1/2 text-ink-secondary hover:text-gold text-4xl transition-colors"
              aria-label="Próxima"
            >
              &rarr;
            </button>

            <p className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 text-xs uppercase tracking-wider text-ink-secondary">
              {openIndex + 1} / {images.length}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
