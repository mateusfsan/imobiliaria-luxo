import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { formatPrice } from '../../utils/format.js';
import FavoriteButton from './FavoriteButton.jsx';

export default function PropertyCard({ property, index = 0 }) {
  const cover = property.images?.[0]?.url;

  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.9, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
      className="group relative"
    >
      <div className="absolute top-5 right-5 z-10">
        <FavoriteButton propertyId={property._id} />
      </div>

      <Link to={`/imoveis/${property._id}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden bg-card">
          {cover ? (
            <img
              src={cover}
              alt={property.title}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] ease-silk group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 grid place-items-center text-ink-secondary">
              Sem imagem
            </div>
          )}

          <div
            className="absolute inset-0 transition-opacity duration-700 ease-silk opacity-95 group-hover:opacity-100"
            style={{
              background:
                'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.65) 28%, rgba(0,0,0,0.15) 58%, transparent 80%)',
            }}
            aria-hidden
          />

          {property.highlight && (
            <span className="absolute top-5 left-5 label-eyebrow text-gold [text-shadow:_0_1px_8px_rgba(0,0,0,0.7)]">
              Destaque
            </span>
          )}

          <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 [text-shadow:_0_1px_10px_rgba(0,0,0,0.55)]">
            <p className="label-eyebrow text-white/75 mb-2">
              {property.city} · {property.state}
            </p>
            <h3 className="font-serif text-2xl sm:text-3xl text-ink-primary leading-tight">
              {property.title}
            </h3>
            <p className="mt-4 text-gold text-lg tracking-wide">
              {formatPrice(property.price)}
            </p>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
