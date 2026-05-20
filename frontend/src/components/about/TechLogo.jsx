import { useState } from 'react';
import { motion } from 'framer-motion';

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export default function TechLogo({ slug, name }) {
  const [failed, setFailed] = useState(false);

  return (
    <motion.div
      variants={item}
      className="group flex flex-col items-center gap-4 p-6 border border-subtle hover:border-gold/40 transition-colors duration-500 ease-silk"
    >
      <div className="relative w-12 h-12 grid place-items-center transition-transform duration-500 ease-silk group-hover:scale-110">
        {failed ? (
          <span className="font-serif text-3xl text-gold">{name.charAt(0)}</span>
        ) : (
          <>
            <img
              src={`https://cdn.simpleicons.org/${slug}/ffffff`}
              alt={name}
              loading="lazy"
              onError={() => setFailed(true)}
              className="w-10 h-10 object-contain opacity-50 group-hover:opacity-0 transition-opacity duration-500"
            />
            <img
              src={`https://cdn.simpleicons.org/${slug}`}
              alt=""
              aria-hidden
              loading="lazy"
              className="absolute inset-0 m-auto w-10 h-10 object-contain opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            />
          </>
        )}
      </div>
      <span className="text-xs uppercase tracking-wider text-center text-ink-secondary group-hover:text-ink-primary transition-colors duration-500">
        {name}
      </span>
    </motion.div>
  );
}
