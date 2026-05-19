import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore.js';

const nav = [
  { to: '/', label: 'Inicio' },
  { to: '/imoveis', label: 'Residencias' },
  { to: '/sobre', label: 'Sobre' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuthStore();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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
            <>
              <span className="hidden sm:inline text-sm text-ink-secondary">
                {user.name?.split(' ')[0]}
              </span>
              <button
                onClick={logout}
                className="text-sm uppercase tracking-wider text-ink-secondary hover:text-gold transition-colors"
              >
                Sair
              </button>
            </>
          ) : (
            <>
              <Link to="/entrar" className="text-sm uppercase tracking-wider text-ink-secondary hover:text-ink-primary transition-colors">
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
