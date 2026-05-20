import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { register as registerUser } from '../../services/authService.js';
import { useAuthStore } from '../../store/authStore.js';

const schema = z.object({
  name: z.string().min(2, 'Nome muito curto'),
  email: z.string().email('E-mail inválido'),
  password: z.string().min(8, 'Mínimo 8 caracteres'),
});

export default function Register() {
  const [serverError, setServerError] = useState(null);
  const setSession = useAuthStore((s) => s.setSession);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (values) => {
    setServerError(null);
    try {
      const { user, token } = await registerUser(values);
      setSession(user, token);
      navigate('/', { replace: true });
    } catch (err) {
      setServerError(err.response?.data?.error?.message || 'Não foi possível cadastrar');
    }
  };

  return (
    <>
      <Helmet>
        <title>Cadastro &middot; Residências</title>
      </Helmet>
      <div className="min-h-screen flex items-center justify-center px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md"
        >
          <p className="label-eyebrow text-center mb-4">Crie sua conta</p>
          <h1 className="font-serif text-h1 text-center mb-12">Comece agora</h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div>
              <label className="label-eyebrow block mb-3">Nome</label>
              <input type="text" autoComplete="name" className="input-line" {...register('name')} />
              {errors.name && <p className="mt-2 text-xs text-gold">{errors.name.message}</p>}
            </div>

            <div>
              <label className="label-eyebrow block mb-3">E-mail</label>
              <input type="email" autoComplete="email" className="input-line" {...register('email')} />
              {errors.email && <p className="mt-2 text-xs text-gold">{errors.email.message}</p>}
            </div>

            <div>
              <label className="label-eyebrow block mb-3">Senha</label>
              <input type="password" autoComplete="new-password" className="input-line" {...register('password')} />
              {errors.password && <p className="mt-2 text-xs text-gold">{errors.password.message}</p>}
            </div>

            {serverError && (
              <p className="text-sm text-gold/90 text-center">{serverError}</p>
            )}

            <button type="submit" disabled={isSubmitting} className="btn-gold w-full disabled:opacity-50">
              {isSubmitting ? 'Criando...' : 'Cadastrar'}
            </button>

            <p className="text-center text-sm text-ink-secondary">
              Já tem conta?{' '}
              <Link to="/entrar" className="text-gold hover:text-gold-hover transition-colors">
                Entrar
              </Link>
            </p>
          </form>
        </motion.div>
      </div>
    </>
  );
}
