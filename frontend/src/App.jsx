import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/layout/Navbar.jsx';
import Footer from './components/layout/Footer.jsx';
import Home from './pages/Home/Home.jsx';
import Properties from './pages/Properties/Properties.jsx';
import PropertyDetails from './pages/PropertyDetails/PropertyDetails.jsx';
import Login from './pages/Auth/Login.jsx';
import Register from './pages/Auth/Register.jsx';

export default function App() {
  const { pathname } = useLocation();
  const isAuthPage = pathname === '/entrar' || pathname === '/cadastro';

  return (
    <div className="min-h-screen flex flex-col">
      {!isAuthPage && <Navbar />}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/imoveis" element={<Properties />} />
          <Route path="/imoveis/:id" element={<PropertyDetails />} />
          <Route path="/entrar" element={<Login />} />
          <Route path="/cadastro" element={<Register />} />
          <Route
            path="*"
            element={
              <div className="min-h-[60vh] flex items-center justify-center text-ink-secondary">
                Pagina nao encontrada.
              </div>
            }
          />
        </Routes>
      </main>
      {!isAuthPage && <Footer />}
    </div>
  );
}
