import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuthStore } from '../../store/authStore.js';
import { useFavoritesStore } from '../../store/favoritesStore.js';

const nav = [
  { to: '/', label: 'Inicio' },
  { to: '/imoveis', label: 'Residencias' },
  { to: '/sobre', label: 'Sobre' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const { user, logout } = useAuthStore();
  const resetFavorites = useFavoritesStore((s) => s.reset);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [menuOpen]);

  const handleLogout = () => {
    logout();
    resetFavorites();
    setMenuOpen(false);
    navigate('/');
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-40 transition-all duration-500 ease-silk ${
        scrolled ? 'bg-bg/85 backdrop-blur-md border-b border-subtle' : 'bg-transparent'
      }`}
    >
      <div className="container-luxe flex items-center justify-between h-20">
        <Link to="/" className="font-serif text-xl tracking-wide">
          <span className="text-ink-primary">Residencias</span>
          <span className="text-gold">.</span>
        </Link>

        <nav className="hidden md:flex items-center gap-10">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `text-sm tracking-wider uppercase transition-colors duration-300 ${
                  isActive ? 'text-gold' : 'text-ink-secondary hover:text-ink-primary'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-5">
          {user ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen((s) => !s)}
                className="flex items-center gap-3 text-sm uppercase tracking-wider text-ink-secondary hover:text-ink-primary transition-colors"
                aria-haspopup="menu"
                aria-expanded={menuOpen}
              >
                <span className="w-8 h-8 rounded-full border border-gold/40 grid place-items-center font-serif text-gold text-sm">
                  {user.name?.charAt(0).toUpperCase()}
                </span>
                <span className="hidden sm:inline">{user.name?.split(' ')[0]}</span>
              </button>

              <AnimatePresence>
                {menuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    role="menu"
                    className="absolute right-0 top-full mt-3 w-56 bg-surface border border-subtle"
                  >
                    <Link
                      to="/favoritos"
                      onClick={() => setMenuOpen(false)}
                      className="block px-6 py-4 text-sm uppercase tracking-wider text-ink-secondary hover:text-gold hover:bg-card transition-colors"
                    >
                      Minhas residencias
                    </Link>
                    <Link
                      to="/minhas-visitas"
                      onClick={() => setMenuOpen(false)}
                      className="block px-6 py-4 text-sm uppercase tracking-wider text-ink-secondary hover:text-gold hover:bg-card transition-colors border-t border-subtle"
                    >
                      Minhas visitas
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-6 py-4 text-sm uppercase tracking-wider text-ink-secondary hover:text-gold hover:bg-card transition-colors border-t border-subtle"
                    >
                      Sair
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <>
              <Link
                to="/entrar"
                className="text-sm uppercase tracking-wider text-ink-secondary hover:text-ink-primary transition-colors"
              >
                Entrar
              </Link>
              <Link to="/cadastro" className="btn-gold text-xs">
                Cadastrar
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
