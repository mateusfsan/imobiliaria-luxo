import { Link, NavLink, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore.js';

const items = [
  { to: '/admin', label: 'Visão geral', end: true },
  { to: '/admin/imoveis', label: 'Imóveis' },
  { to: '/admin/visitas', label: 'Visitas' },
];

export default function AdminLayout() {
  const user = useAuthStore((s) => s.user);

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <aside className="w-full md:w-72 md:min-h-screen border-b md:border-b-0 md:border-r border-subtle bg-surface">
        <div className="p-8 md:p-10">
          <Link to="/" className="font-serif text-xl tracking-wide block">
            <span className="text-ink-primary">Residências</span>
            <span className="text-gold">.</span>
          </Link>
          <p className="label-eyebrow text-gold mt-2">Painel admin</p>
        </div>

        <nav className="px-4 pb-8 md:pb-10">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `block px-6 py-4 text-sm uppercase tracking-wider transition-colors duration-300 border-l-2 ${
                  isActive
                    ? 'text-gold border-gold bg-card'
                    : 'text-ink-secondary border-transparent hover:text-ink-primary hover:border-ink-secondary'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto px-10 py-8 border-t border-subtle hidden md:block">
          <p className="label-eyebrow text-ink-secondary mb-2">Conectado como</p>
          <p className="text-sm">{user?.name}</p>
          <p className="text-xs text-ink-secondary mt-1">{user?.email}</p>
          <Link
            to="/"
            className="mt-6 inline-block text-xs uppercase tracking-wider text-ink-secondary hover:text-gold transition-colors"
          >
            &larr; Voltar ao site
          </Link>
        </div>
      </aside>

      <main className="flex-1 min-w-0">
        <div className="px-6 sm:px-10 py-10 md:py-14 max-w-6xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
