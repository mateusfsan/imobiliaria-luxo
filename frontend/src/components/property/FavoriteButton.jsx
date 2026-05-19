import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useFavoritesStore } from '../../store/favoritesStore.js';
import { useAuthStore } from '../../store/authStore.js';

export default function FavoriteButton({ propertyId, size = 'md', label = false, className = '' }) {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore((s) => s.user);
  const isFavorite = useFavoritesStore((s) => s.ids.has(propertyId));
  const toggle = useFavoritesStore((s) => s.toggle);

  const handleClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      navigate('/entrar', { state: { from: location.pathname } });
      return;
    }

    try {
      await toggle(propertyId);
    } catch (err) {
      console.error('[favoritos] falha ao alternar', err);
    }
  };

  const dimensions = size === 'lg' ? 'w-12 h-12' : 'w-10 h-10';
  const iconSize = size === 'lg' ? 22 : 18;

  return (
    <button
      onClick={handleClick}
      aria-label={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
      aria-pressed={isFavorite}
      className={`inline-flex items-center gap-3 ${className}`}
    >
      <motion.span
        whileTap={{ scale: 0.85 }}
        animate={{ scale: isFavorite ? [1, 1.15, 1] : 1 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className={`${dimensions} rounded-full grid place-items-center border transition-colors duration-300 ease-silk ${
          isFavorite
            ? 'bg-gold/15 border-gold text-gold'
            : 'bg-black/30 backdrop-blur-sm border-white/20 text-ink-primary hover:border-gold hover:text-gold'
        }`}
      >
        <svg
          width={iconSize}
          height={iconSize}
          viewBox="0 0 24 24"
          fill={isFavorite ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      </motion.span>
      {label && (
        <span className="text-sm uppercase tracking-wider">
          {isFavorite ? 'Salvo' : 'Salvar'}
        </span>
      )}
    </button>
  );
}
