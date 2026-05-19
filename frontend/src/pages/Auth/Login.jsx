import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { login } from '../../services/authService.js';
import { useAuthStore } from '../../store/authStore.js';

const schema = z.object({
  email: z.string().email('E-mail invalido'),
  password: z.string().min(1, 'Senha obrigatoria'),
});

export default function Login() {
  const [serverError, setServerError] = useState(null);
  const setSession = useAuthStore((s) => s.setSession);
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || '/';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (values) => {
    setServerError(null);
    try {
      const { user, token } = await login(values);
      setSession(user, token);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setServerError(err.response?.data?.error?.message || 'Nao foi possivel entrar');
    }
  };

  return (
    <>
      <Helmet>
        <title>Entrar &middot; Residencias</title>
      </Helmet>
      <div className="min-h-screen flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md"
        >
          <p className="label-eyebrow text-center mb-4">Acesso reservado</p>
          <h1 className="font-serif text-h1 text-center mb-12">Bem-vindo</h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div>
              <label className="label-eyebrow block mb-3">E-mail</label>
              <input type="email" autoComplete="email" className="input-line" {...register('email')} />
              {errors.email && <p className="mt-2 text-xs text-gold">{errors.email.message}</p>}
            </div>

            <div>
              <label className="label-eyebrow block mb-3">Senha</label>
              <input type="password" autoComplete="current-password" className="input-line" {...register('password')} />
              {errors.password && <p className="mt-2 text-xs text-gold">{errors.password.message}</p>}
            </div>

            {serverError && (
              <p className="text-sm text-gold/90 text-center">{serverError}</p>
            )}

            <button type="submit" disabled={isSubmitting} className="btn-gold w-full disabled:opacity-50">
              {isSubmitting ? 'Entrando...' : 'Entrar'}
            </button>

            <p className="text-center text-sm text-ink-secondary">
              Ainda nao tem conta?{' '}
              <Link to="/cadastro" className="text-gold hover:text-gold-hover transition-colors">
                Cadastre-se
              </Link>
            </p>
          </form>
        </motion.div>
      </div>
    </>
  );
}
