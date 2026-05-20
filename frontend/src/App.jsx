import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/layout/Navbar.jsx';
import Footer from './components/layout/Footer.jsx';
import RequireAuth from './components/layout/RequireAuth.jsx';
import RequireAdmin from './components/layout/RequireAdmin.jsx';
import AdminLayout from './components/admin/AdminLayout.jsx';
import Home from './pages/Home/Home.jsx';
import Properties from './pages/Properties/Properties.jsx';
import PropertyDetails from './pages/PropertyDetails/PropertyDetails.jsx';
import About from './pages/About/About.jsx';
import Favorites from './pages/Favorites/Favorites.jsx';
import Schedule from './pages/Schedule/Schedule.jsx';
import MyVisits from './pages/MyVisits/MyVisits.jsx';
import Login from './pages/Auth/Login.jsx';
import Register from './pages/Auth/Register.jsx';
import AdminDashboard from './pages/Admin/Dashboard.jsx';
import AdminProperties from './pages/Admin/Properties.jsx';
import AdminPropertyForm from './pages/Admin/PropertyForm.jsx';
import AdminSchedules from './pages/Admin/Schedules.jsx';
import { useAuthSync } from './hooks/useAuthSync.js';

export default function App() {
  const { pathname } = useLocation();
  const isAuthPage = pathname === '/entrar' || pathname === '/cadastro';
  const isAdminPage = pathname.startsWith('/admin');
  const showChrome = !isAuthPage && !isAdminPage;

  useAuthSync();

  return (
    <div className="min-h-screen flex flex-col">
      {showChrome && <Navbar />}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/imoveis" element={<Properties />} />
          <Route path="/imoveis/:id" element={<PropertyDetails />} />
          <Route path="/sobre" element={<About />} />
          <Route path="/entrar" element={<Login />} />
          <Route path="/cadastro" element={<Register />} />

          <Route
            path="/favoritos"
            element={
              <RequireAuth>
                <Favorites />
              </RequireAuth>
            }
          />
          <Route
            path="/agendar"
            element={
              <RequireAuth>
                <Schedule />
              </RequireAuth>
            }
          />
          <Route
            path="/minhas-visitas"
            element={
              <RequireAuth>
                <MyVisits />
              </RequireAuth>
            }
          />

          <Route
            path="/admin"
            element={
              <RequireAdmin>
                <AdminLayout />
              </RequireAdmin>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="imoveis" element={<AdminProperties />} />
            <Route path="imoveis/novo" element={<AdminPropertyForm />} />
            <Route path="imoveis/:id/editar" element={<AdminPropertyForm />} />
            <Route path="visitas" element={<AdminSchedules />} />
          </Route>

          <Route
            path="*"
            element={
              <div className="min-h-[60vh] flex items-center justify-center text-ink-secondary">
                Página não encontrada.
              </div>
            }
          />
        </Routes>
      </main>
      {showChrome && <Footer />}
    </div>
  );
}
